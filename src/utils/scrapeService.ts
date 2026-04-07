// Real-time property scraping service
import { supabase } from "@/integrations/supabase/client";

export interface ScrapedProperty {
  name: string;
  type: string;
  source: string;
  sourceUrl: string;
  lat: number;
  lng: number;
  distance: number;
  details: Record<string, string>;
}

export interface ScrapeResult {
  properties: ScrapedProperty[];
  source: "cache" | "live";
  scraped_at: string;
  total: number;
}

export async function scrapeProperties(
  lat: number,
  lng: number,
  radiusKm: number,
  locationName: string
): Promise<ScrapeResult> {
  const { data, error } = await supabase.functions.invoke("scrape-properties", {
    body: { lat, lng, radius_km: radiusKm, location_name: locationName },
  });

  if (error) {
    console.error("Scrape error:", error);
    return { properties: [], source: "live", scraped_at: new Date().toISOString(), total: 0 };
  }

  return data as ScrapeResult;
}
