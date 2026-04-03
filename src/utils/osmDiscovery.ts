// OpenStreetMap Overpass API for real-time location discovery
// Returns REAL buildings, infrastructure, and POIs from OpenStreetMap

export interface OSMPlace {
  id: number;
  name: string;
  type: "residential" | "commercial" | "education" | "healthcare" | "transit" | "retail" | "infrastructure" | "park";
  subtype: string;
  lat: number;
  lng: number;
  distance: number; // km from search center
  tags: Record<string, string>;
}

export interface OSMDiscoveryResult {
  residentialBuildings: OSMPlace[];
  commercialBuildings: OSMPlace[];
  schools: OSMPlace[];
  hospitals: OSMPlace[];
  transit: OSMPlace[];
  retail: OSMPlace[];
  parks: OSMPlace[];
  infrastructure: OSMPlace[];
  totalPOIs: number;
  searchCenter: { lat: number; lng: number };
  radiusKm: number;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseOSMElement(el: any, centerLat: number, centerLng: number): { lat: number; lng: number; name: string; tags: Record<string, string>; distance: number } | null {
  let lat: number, lng: number;
  if (el.type === "node") {
    lat = el.lat;
    lng = el.lon;
  } else if (el.center) {
    lat = el.center.lat;
    lng = el.center.lon;
  } else if (el.lat && el.lon) {
    lat = el.lat;
    lng = el.lon;
  } else {
    return null;
  }
  const name = el.tags?.name || el.tags?.["addr:housename"] || el.tags?.operator || "";
  const distance = Math.round(haversine(centerLat, centerLng, lat, lng) * 10) / 10;
  return { lat, lng, name, tags: el.tags || {}, distance };
}

export async function discoverLocation(lat: number, lng: number, radiusKm: number): Promise<OSMDiscoveryResult> {
  const radiusM = Math.min(radiusKm, 50) * 1000; // Cap at 50km for API performance

  // Build Overpass query for multiple categories
  const query = `
    [out:json][timeout:30];
    (
      // Residential complexes/apartments
      way["building"="apartments"](around:${radiusM},${lat},${lng});
      way["building"="residential"]["name"](around:${radiusM},${lat},${lng});
      relation["building"="apartments"](around:${radiusM},${lat},${lng});
      
      // Commercial buildings
      way["building"="commercial"](around:${radiusM},${lat},${lng});
      way["building"="office"]["name"](around:${radiusM},${lat},${lng});
      way["office"](around:${radiusM},${lat},${lng});
      
      // Schools & colleges
      node["amenity"="school"]["name"](around:${radiusM},${lat},${lng});
      way["amenity"="school"]["name"](around:${radiusM},${lat},${lng});
      node["amenity"="college"]["name"](around:${radiusM},${lat},${lng});
      node["amenity"="university"]["name"](around:${radiusM},${lat},${lng});
      
      // Hospitals
      node["amenity"="hospital"]["name"](around:${radiusM},${lat},${lng});
      way["amenity"="hospital"]["name"](around:${radiusM},${lat},${lng});
      
      // Transit
      node["railway"="station"]["name"](around:${radiusM},${lat},${lng});
      node["station"="subway"]["name"](around:${radiusM},${lat},${lng});
      node["amenity"="bus_station"]["name"](around:${radiusM},${lat},${lng});
      node["aeroway"="aerodrome"]["name"](around:${radiusM},${lat},${lng});
      
      // Major retail / malls
      way["shop"="mall"]["name"](around:${radiusM},${lat},${lng});
      way["building"="retail"]["name"](around:${radiusM},${lat},${lng});
      node["shop"="supermarket"]["name"](around:${radiusM},${lat},${lng});
      
      // Parks
      way["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
      relation["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
      
      // Infrastructure (highways, flyovers)
      way["highway"="motorway"]["name"](around:${radiusM},${lat},${lng});
      way["highway"="trunk"]["name"](around:${radiusM},${lat},${lng});
      way["man_made"="bridge"]["name"](around:${radiusM},${lat},${lng});
    );
    out center 200;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    
    if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);
    const data = await res.json();

    const result: OSMDiscoveryResult = {
      residentialBuildings: [],
      commercialBuildings: [],
      schools: [],
      hospitals: [],
      transit: [],
      retail: [],
      parks: [],
      infrastructure: [],
      totalPOIs: 0,
      searchCenter: { lat, lng },
      radiusKm,
    };

    const seen = new Set<string>();

    for (const el of data.elements || []) {
      const parsed = parseOSMElement(el, lat, lng);
      if (!parsed) continue;
      
      const key = `${parsed.lat.toFixed(4)},${parsed.lng.toFixed(4)},${parsed.name}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const tags = parsed.tags;
      const place: OSMPlace = {
        id: el.id,
        name: parsed.name,
        type: "infrastructure",
        subtype: "",
        lat: parsed.lat,
        lng: parsed.lng,
        distance: parsed.distance,
        tags,
      };

      if (tags.building === "apartments" || (tags.building === "residential" && parsed.name)) {
        place.type = "residential";
        place.subtype = tags["building:levels"] ? `${tags["building:levels"]} floors` : "Residential";
        if (parsed.name) result.residentialBuildings.push(place);
      } else if (tags.building === "commercial" || tags.building === "office" || tags.office) {
        place.type = "commercial";
        place.subtype = tags.office || "Commercial";
        if (parsed.name) result.commercialBuildings.push(place);
      } else if (tags.amenity === "school" || tags.amenity === "college" || tags.amenity === "university") {
        place.type = "education";
        place.subtype = tags.amenity;
        result.schools.push(place);
      } else if (tags.amenity === "hospital") {
        place.type = "healthcare";
        place.subtype = "Hospital";
        result.hospitals.push(place);
      } else if (tags.railway === "station" || tags.station === "subway" || tags.amenity === "bus_station" || tags.aeroway === "aerodrome") {
        place.type = "transit";
        place.subtype = tags.railway || tags.station || tags.amenity || tags.aeroway || "";
        result.transit.push(place);
      } else if (tags.shop === "mall" || tags.building === "retail" || tags.shop === "supermarket") {
        place.type = "retail";
        place.subtype = tags.shop || "Retail";
        result.retail.push(place);
      } else if (tags.leisure === "park") {
        place.type = "park";
        place.subtype = "Park";
        result.parks.push(place);
      } else if (tags.highway || tags.man_made === "bridge") {
        place.type = "infrastructure";
        place.subtype = tags.highway || "Bridge";
        if (parsed.name) result.infrastructure.push(place);
      }
    }

    // Sort all by distance
    [result.residentialBuildings, result.commercialBuildings, result.schools, result.hospitals, result.transit, result.retail, result.parks, result.infrastructure].forEach(arr => arr.sort((a, b) => a.distance - b.distance));

    result.totalPOIs = result.residentialBuildings.length + result.commercialBuildings.length + result.schools.length + result.hospitals.length + result.transit.length + result.retail.length + result.parks.length + result.infrastructure.length;

    return result;
  } catch (err) {
    console.error("OSM Discovery error:", err);
    return {
      residentialBuildings: [],
      commercialBuildings: [],
      schools: [],
      hospitals: [],
      transit: [],
      retail: [],
      parks: [],
      infrastructure: [],
      totalPOIs: 0,
      searchCenter: { lat, lng },
      radiusKm,
    };
  }
}

export function generateLocationIntelligence(result: OSMDiscoveryResult): string[] {
  const insights: string[] = [];

  if (result.residentialBuildings.length > 0) {
    insights.push(`${result.residentialBuildings.length} residential complexes discovered within ${result.radiusKm} km. Nearest: ${result.residentialBuildings[0].name || "Unnamed"} (${result.residentialBuildings[0].distance} km).`);
  }

  if (result.commercialBuildings.length > 0) {
    insights.push(`${result.commercialBuildings.length} commercial/office buildings in the catchment area, indicating employment hub proximity.`);
  }

  if (result.transit.length > 0) {
    const nearestTransit = result.transit[0];
    insights.push(`Nearest transit: ${nearestTransit.name} (${nearestTransit.distance} km). ${result.transit.length} transit nodes total — good connectivity signal.`);
  } else {
    insights.push("No major transit stations found in catchment. Connectivity may be limited — factor in commute costs.");
  }

  if (result.schools.length > 0) {
    insights.push(`${result.schools.length} schools/colleges found. Social infrastructure presence supports family-oriented residential demand.`);
  }

  if (result.hospitals.length > 0) {
    insights.push(`${result.hospitals.length} hospitals nearby. Healthcare infrastructure adds to livability score.`);
  }

  if (result.parks.length > 0) {
    insights.push(`${result.parks.length} parks/green spaces. Green cover enhances quality of life and typically adds 5-10% property premium.`);
  }

  if (result.retail.length > 0) {
    insights.push(`${result.retail.length} retail/mall establishments. Retail presence indicates mature micro-market with established demand.`);
  }

  // Livability score
  const livScore = Math.min(10,
    (result.schools.length > 0 ? 2 : 0) +
    (result.hospitals.length > 0 ? 2 : 0) +
    (result.transit.length > 0 ? 2 : 0) +
    (result.retail.length > 0 ? 1 : 0) +
    (result.parks.length > 0 ? 1 : 0) +
    (result.residentialBuildings.length > 5 ? 1 : 0) +
    (result.commercialBuildings.length > 0 ? 1 : 0)
  );

  insights.push(`Livability Score: ${livScore}/10 — based on social infrastructure, connectivity, and amenity density.`);

  return insights;
}
