import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ScrapedProperty {
  name: string;
  type: string;
  source: string;
  sourceUrl: string;
  lat: number;
  lng: number;
  distance: number;
  details: Record<string, string>;
}

// Overpass query for real estate buildings, construction sites, and developments
async function queryOverpass(lat: number, lng: number, radiusKm: number): Promise<ScrapedProperty[]> {
  const radiusM = radiusKm * 1000;
  const query = `
[out:json][timeout:30];
(
  // Residential buildings with names
  nwr["building"="apartments"]["name"](around:${radiusM},${lat},${lng});
  nwr["building"="residential"]["name"](around:${radiusM},${lat},${lng});
  nwr["building"="house"]["name"](around:${radiusM},${lat},${lng});
  // Commercial buildings
  nwr["building"="commercial"]["name"](around:${radiusM},${lat},${lng});
  nwr["building"="office"]["name"](around:${radiusM},${lat},${lng});
  nwr["building"="retail"]["name"](around:${radiusM},${lat},${lng});
  // Construction sites (new launches/under construction)
  nwr["landuse"="construction"](around:${radiusM},${lat},${lng});
  nwr["building"="construction"](around:${radiusM},${lat},${lng});
  // Real estate offices
  nwr["office"="estate_agent"](around:${radiusM},${lat},${lng});
  // Developer offices
  nwr["office"="company"]["name"](around:${radiusM},${lat},${lng});
  // Land plots for sale
  nwr["landuse"="residential"](around:${radiusM},${lat},${lng});
);
out center tags;`;

  try {
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!resp.ok) {
      console.error("Overpass API error:", resp.status);
      return [];
    }

    const data = await resp.json();
    const results: ScrapedProperty[] = [];

    for (const el of data.elements || []) {
      const elLat = el.lat || el.center?.lat;
      const elLng = el.lon || el.center?.lon;
      if (!elLat || !elLng) continue;

      const name = el.tags?.name || el.tags?.["addr:housename"] || "";
      if (!name && !el.tags?.["building"]) continue;

      const dist = haversine(lat, lng, elLat, elLng);
      const type = categorizeBuilding(el.tags);

      results.push({
        name: name || `${type} (${el.tags?.["addr:street"] || "unnamed"})`,
        type,
        source: "OpenStreetMap",
        sourceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
        lat: elLat,
        lng: elLng,
        distance: Math.round(dist * 10) / 10,
        details: extractDetails(el.tags),
      });
    }

    return results.sort((a, b) => a.distance - b.distance);
  } catch (err) {
    console.error("Overpass query failed:", err);
    return [];
  }
}

// Try to fetch property listings from public RERA-like endpoints
async function queryPublicSources(lat: number, lng: number, radiusKm: number, locationName: string): Promise<ScrapedProperty[]> {
  const results: ScrapedProperty[] = [];

  // Query Nominatim for nearby real estate related POIs
  try {
    const searchTerms = ["real estate", "apartment", "villa", "township", "housing"];
    for (const term of searchTerms.slice(0, 2)) {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term + " " + locationName)}&format=json&limit=10&bounded=1&viewbox=${lng - radiusKm * 0.015},${lat + radiusKm * 0.01},${lng + radiusKm * 0.015},${lat - radiusKm * 0.01}`,
        { headers: { "User-Agent": "RealEstateIntelligence/1.0" } }
      );
      if (resp.ok) {
        const data = await resp.json();
        for (const place of data) {
          const pLat = parseFloat(place.lat);
          const pLng = parseFloat(place.lon);
          const dist = haversine(lat, lng, pLat, pLng);
          if (dist <= radiusKm) {
            results.push({
              name: place.display_name?.split(",")[0] || "Property",
              type: place.type === "commercial" ? "Commercial" : "Residential",
              source: "Nominatim",
              sourceUrl: `https://www.openstreetmap.org/?mlat=${pLat}&mlon=${pLng}#map=17/${pLat}/${pLng}`,
              lat: pLat,
              lng: pLng,
              distance: Math.round(dist * 10) / 10,
              details: { category: place.category || "", type: place.type || "" },
            });
          }
        }
      }
      // Respect Nominatim rate limit
      await new Promise(r => setTimeout(r, 1100));
    }
  } catch (err) {
    console.error("Nominatim search failed:", err);
  }

  // Deduplicate by proximity
  const deduped: ScrapedProperty[] = [];
  for (const prop of results) {
    const isDupe = deduped.some(d => haversine(d.lat, d.lng, prop.lat, prop.lng) < 0.05);
    if (!isDupe) deduped.push(prop);
  }

  return deduped;
}

function categorizeBuilding(tags: Record<string, string>): string {
  if (tags?.["building"] === "apartments" || tags?.["building"] === "residential") return "Apartment";
  if (tags?.["building"] === "house") return "Villa";
  if (tags?.["building"] === "commercial" || tags?.["building"] === "office" || tags?.["building"] === "retail") return "Commercial";
  if (tags?.["landuse"] === "construction" || tags?.["building"] === "construction") return "Under Construction";
  if (tags?.["office"] === "estate_agent") return "Real Estate Office";
  if (tags?.["landuse"] === "residential") return "Residential Zone";
  return "Property";
}

function extractDetails(tags: Record<string, string>): Record<string, string> {
  const details: Record<string, string> = {};
  if (tags?.["building:levels"]) details.floors = tags["building:levels"];
  if (tags?.["addr:street"]) details.street = tags["addr:street"];
  if (tags?.["addr:postcode"]) details.pincode = tags["addr:postcode"];
  if (tags?.["operator"]) details.developer = tags["operator"];
  if (tags?.["description"]) details.description = tags["description"];
  if (tags?.["start_date"]) details.startDate = tags["start_date"];
  if (tags?.["opening_date"]) details.completionDate = tags["opening_date"];
  if (tags?.["website"]) details.website = tags["website"];
  if (tags?.["phone"]) details.phone = tags["phone"];
  return details;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, radius_km, location_name } = await req.json();

    if (!lat || !lng) {
      return new Response(JSON.stringify({ error: "lat and lng required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const radiusKm = radius_km || 25;
    const locationName = location_name || "";

    // Check cache first
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: cached } = await supabase
      .from("scraped_properties")
      .select("*")
      .gte("expires_at", new Date().toISOString())
      .gte("lat", lat - 0.01)
      .lte("lat", lat + 0.01)
      .gte("lng", lng - 0.01)
      .lte("lng", lng + 0.01)
      .eq("radius_km", radiusKm)
      .order("scraped_at", { ascending: false })
      .limit(1);

    if (cached && cached.length > 0) {
      console.log("Returning cached results");
      return new Response(JSON.stringify({
        properties: cached[0].properties,
        source: "cache",
        scraped_at: cached[0].scraped_at,
        expires_at: cached[0].expires_at,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Scrape fresh data
    console.log(`Scraping for ${locationName} (${lat}, ${lng}) radius ${radiusKm}km`);

    const [osmProperties, publicProperties] = await Promise.all([
      queryOverpass(lat, lng, radiusKm),
      queryPublicSources(lat, lng, radiusKm, locationName),
    ]);

    // Merge and deduplicate
    const allProperties = [...osmProperties];
    for (const pp of publicProperties) {
      const isDupe = allProperties.some(op => haversine(op.lat, op.lng, pp.lat, pp.lng) < 0.05);
      if (!isDupe) allProperties.push(pp);
    }

    // Cache the results
    await supabase.from("scraped_properties").insert({
      location_query: locationName,
      lat,
      lng,
      radius_km: radiusKm,
      properties: allProperties,
      source: "osm+nominatim",
    });

    // Clean expired cache entries
    await supabase.from("scraped_properties").delete().lt("expires_at", new Date().toISOString());

    console.log(`Found ${allProperties.length} properties`);

    return new Response(JSON.stringify({
      properties: allProperties,
      source: "live",
      scraped_at: new Date().toISOString(),
      total: allProperties.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Scrape error:", err);
    return new Response(JSON.stringify({ error: err.message || "Scraping failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
