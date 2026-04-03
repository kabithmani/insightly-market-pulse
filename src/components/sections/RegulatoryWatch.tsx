import { Shield } from "lucide-react";
import { regulatorySignals } from "@/data/intelligenceData";

interface Props { city: string; }

export default function RegulatoryWatch({ city }: Props) {
  const signals = regulatorySignals.filter(s => s.city === city);

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> RERA Intelligence Signals
          </h3>
          <p className="text-sm text-muted-foreground">Regulatory compliance tracking · {city === "Bangalore" ? "K-RERA" : city === "Mumbai" ? "MahaRERA" : "Pune RERA"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Signal</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Current Value</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">What to Watch</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((s, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{s.signal}</td>
                  <td className="p-3 text-right text-foreground font-medium">{s.currentValue}</td>
                  <td className="p-3 text-muted-foreground text-xs">{s.whatToWatch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl bg-muted/30 border border-border p-6">
        <h4 className="font-bold text-foreground text-sm mb-2">🔍 RERA Intelligence Method</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {city === "Bangalore" && "K-RERA 'Applications Under Process' (currently 227) provides a 3-6 week early warning on upcoming developer launches. Revenue Recovery Certificates are the strongest financial stress signal. Monitoring quarterly update delays identifies projects at risk of delay or default."}
          {city === "Pune" && "Pune RERA new filings at 184 indicate sustained developer confidence in western Pune corridors. Track filings by area to identify upcoming supply hotspots before public announcements."}
          {city === "Mumbai" && "MahaRERA's 312 new filings and 28 lapsed registrations provide the clearest picture of Mumbai's development pipeline. Lapsed registrations are a leading indicator of stalled projects – watch for concentration in specific micro-markets."}
        </p>
      </div>
    </div>
  );
}
