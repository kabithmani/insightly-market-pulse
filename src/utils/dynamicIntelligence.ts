// Dynamic intelligence generation using Lovable AI
import { supabase } from "@/integrations/supabase/client";

export interface DynamicIntelligence {
  executiveBrief: {
    summary: string;
    themes: { theme: string; summary: string }[];
    takeaways: string[];
  };
  residential: {
    metrics: { metric: string; value: string; change: string; signal: string }[];
    segments: { segment: string; units: number; share: string; yoyChange: string }[];
    insight: string;
  };
  commercial: {
    markets: { subMarket: string; avgRent: string; vacancy: string; absorption: string; signal: string }[];
    insight: string;
  };
  infrastructure: {
    projects: { project: string; status: string; impact: string; priceLift: string; timeline: string; confidence: string }[];
    correlations: { project: string; corridors: string; lift: string; timeline: string; confidence: string }[];
  };
  developers: {
    trackers: { developer: string; latestMove: string; score: number; signal: string }[];
    insight: string;
  };
  investors: {
    deals: { title: string; details: string; icon: string }[];
    insight: string;
  };
  regulatory: {
    signals: { signal: string; currentValue: string; whatToWatch: string }[];
    insight: string;
  };
  emerging: {
    signals: { title: string; description: string; patternMatch: string; implication: string; nextAction: string; confidence: string }[];
  };
  deepDive: {
    title: string;
    subtitle: string;
    content: string[];
    scores: { category: string; score: number }[];
    verdict: string;
  };
  landIntel: {
    deals: { developer: string; location: string; sizeAcres: string; estValueCr: string; verified: string; status: string }[];
    trends: { corridor: string; rate: string; vsLastYear: string; vs2YearsAgo: string }[];
  };
  pricing: {
    markets: { name: string; avgPsf: number; yoyChange: number; cmi: number }[];
  };
  generatedAt: string;
  location: string;
}

// Cache in memory
const intelligenceCache = new Map<string, { data: DynamicIntelligence; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function generateDynamicIntelligence(
  location: string,
  city: string,
  lat: number,
  lng: number,
  radius: number
): Promise<DynamicIntelligence | null> {
  const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}_${radius}`;
  const cached = intelligenceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const { data, error } = await supabase.functions.invoke("generate-intelligence", {
      body: { location, city, lat, lng, radius },
    });

    if (error) {
      console.error("Intelligence generation error:", error);
      return null;
    }

    const intelligence = data as DynamicIntelligence;
    intelligenceCache.set(cacheKey, { data: intelligence, timestamp: Date.now() });
    return intelligence;
  } catch (err) {
    console.error("Failed to generate intelligence:", err);
    return null;
  }
}
