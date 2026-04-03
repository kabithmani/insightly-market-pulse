import { MicroMarket } from "@/data/microMarkets";

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface GeocodedLocation {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeLocation(query: string): Promise<GeocodedLocation | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { "User-Agent": "FinCityRealEstateApp/1.0" } }
    );
    const data = await res.json();
    if (data.length === 0) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch {
    return null;
  }
}

export interface MarketWithDistance extends MicroMarket {
  distance: number;
}

export function filterMarketsByRadius(
  markets: MicroMarket[],
  lat: number,
  lng: number,
  radiusKm: number,
  city: string
): MarketWithDistance[] {
  return markets
    .filter((m) => m.city === city)
    .map((m) => ({
      ...m,
      distance: Math.round(haversineDistance(lat, lng, m.lat, m.lng) * 10) / 10,
    }))
    .filter((m) => m.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

export function generateInsights(markets: MarketWithDistance[]) {
  if (markets.length === 0) return null;
  const avgPrice = Math.round(markets.reduce((s, m) => s + m.avg_psf, 0) / markets.length);
  const highestCMI = [...markets].sort((a, b) => b.cmi - a.cmi)[0];
  const topAppreciating = [...markets].sort((a, b) => b.yoy_change - a.yoy_change)[0];
  const allLandDeals = markets.flatMap((m) => m.land_deals.map((d) => ({ market: m.name, deal: d })));
  const allInfra = markets.flatMap((m) => m.infra_news.map((n) => ({ market: m.name, news: n })));
  return { avgPrice, highestCMI, topAppreciating, allLandDeals, allInfra };
}
