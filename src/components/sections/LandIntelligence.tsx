import { Landmark, TrendingUp } from "lucide-react";
import { landDeals, landRateTrends } from "@/data/intelligenceData";

interface Props { city: string; }

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  INFERRED: "bg-amber-100 text-amber-700",
  MONITORING: "bg-red-100 text-red-700",
  INTEL: "bg-blue-100 text-blue-700",
};

export default function LandIntelligence({ city }: Props) {
  const deals = landDeals.filter(d => d.city === city);
  const trends = landRateTrends.filter(t => t.city === city);

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Land Deals */}
      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Landmark className="h-5 w-5 text-accent" /> Land Deals & Shell Entity Tracking
          </h3>
          <p className="text-sm text-muted-foreground">Deals &gt;5 acres or ₹50 Cr · verified via Dishaank + Bhoomi RTC</p>
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
              {deals.map((d, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{d.developer}</td>
                  <td className="p-3 text-muted-foreground">{d.location}</td>
                  <td className="p-3 text-right text-foreground">{d.sizeAcres}</td>
                  <td className="p-3 text-right text-foreground font-medium">{d.estValueCr}</td>
                  <td className="p-3 text-center text-xs text-muted-foreground">{d.verified}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Land Rate Trends */}
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
              {trends.map((t, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{t.corridor}</td>
                  <td className="p-3 text-right text-foreground font-medium">{t.rateQ1_2026}</td>
                  <td className="p-3 text-right text-green-600 font-semibold">{t.vsQ1_2025}</td>
                  <td className="p-3 text-right text-green-600 font-bold">{t.vsQ1_2024}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="rounded-3xl bg-muted/30 border border-border p-6">
        <h4 className="font-bold text-foreground text-sm mb-2">🔍 Verification Methodology</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Dishaank method:</strong> Survey numbers cross-referenced with Bhoomi RTC records, lake bed checks performed, rajakaluve boundaries verified. Only deals with complete survey chain marked as "Confirmed". Shell entity patterns identified through MCA director interlocking analysis.
        </p>
      </div>
    </div>
  );
}
