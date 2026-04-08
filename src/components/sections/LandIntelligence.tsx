import { Landmark, TrendingUp, Loader2 } from "lucide-react";
import { landDeals, landRateTrends } from "@/data/intelligenceData";

interface Props {
  city: string;
  location?: string;
  dynamic?: {
    deals: { developer: string; location: string; sizeAcres: string; estValueCr: string; verified: string; status: string }[];
    trends: { corridor: string; rate: string; vsLastYear: string; vs2YearsAgo: string }[];
  };
  loading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  INFERRED: "bg-amber-100 text-amber-700",
  MONITORING: "bg-red-100 text-red-700",
  INTEL: "bg-blue-100 text-blue-700",
};

export default function LandIntelligence({ city, location, dynamic, loading }: Props) {
  if (loading) return <LoadingState />;

  const isPreFed = ["Bangalore", "Pune", "Mumbai"].includes(city);
  const useDynamic = dynamic && !isPreFed;

  const deals = useDynamic ? dynamic.deals : landDeals.filter(d => d.city === city);
  const trends = useDynamic
    ? dynamic.trends.map(t => ({ corridor: t.corridor, rateQ1_2026: t.rate, vsQ1_2025: t.vsLastYear, vsQ1_2024: t.vs2YearsAgo }))
    : landRateTrends.filter(t => t.city === city);

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {location && (
        <div className="rounded-2xl bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">📍 Land Intelligence: {location}</p>
        </div>
      )}

      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Landmark className="h-5 w-5 text-accent" /> Land Deals & Shell Entity Tracking
          </h3>
          <p className="text-sm text-muted-foreground">{useDynamic ? "AI-Generated · Location-specific data" : "Deals >5 acres or ₹50 Cr · verified via Dishaank + Bhoomi RTC"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Developer</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Location</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Size (acres)</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Est. Value (₹Cr)</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Verified</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{d.developer}</td>
                  <td className="p-3 text-muted-foreground">{d.location}</td>
                  <td className="p-3 text-right text-foreground">{d.sizeAcres}</td>
                  <td className="p-3 text-right text-foreground font-medium">{d.estValueCr}</td>
                  <td className="p-3 text-center text-xs text-muted-foreground">{d.verified}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[d.status] || "bg-muted text-muted-foreground"}`}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Land Rate Trends (Key Corridors)
          </h3>
          <p className="text-sm text-muted-foreground">Source: Sub-registrar stamp duty filings · Dishaank verified</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Corridor</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Rate Q1 2026</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">vs Q1 2025</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">vs Q1 2024</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((t: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{t.corridor}</td>
                  <td className="p-3 text-right text-foreground font-medium">{t.rateQ1_2026 || t.rate}</td>
                  <td className="p-3 text-right text-green-600 font-semibold">{t.vsQ1_2025 || t.vsLastYear}</td>
                  <td className="p-3 text-right text-green-600 font-bold">{t.vsQ1_2024 || t.vs2YearsAgo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl bg-muted/30 border border-border p-6">
        <h4 className="font-bold text-foreground text-sm mb-2">🔍 Verification Methodology</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Dishaank method:</strong> Survey numbers cross-referenced with Bhoomi RTC records, lake bed checks performed, rajakaluve boundaries verified. Only deals with complete survey chain marked as "Confirmed". Shell entity patterns identified through MCA director interlocking analysis.
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Analyzing land intelligence...</p>
    </div>
  );
}
