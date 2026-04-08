import { Shield, Loader2 } from "lucide-react";
import { regulatorySignals } from "@/data/intelligenceData";

interface Props {
  city: string;
  location?: string;
  dynamic?: {
    signals: { signal: string; currentValue: string; whatToWatch: string }[];
    insight: string;
  };
  loading?: boolean;
}

export default function RegulatoryWatch({ city, location, dynamic, loading }: Props) {
  if (loading) return <LoadingState />;

  const isPreFed = ["Bangalore", "Pune", "Mumbai"].includes(city);
  const useDynamic = dynamic && !isPreFed;

  const signals = useDynamic ? dynamic.signals : regulatorySignals.filter(s => s.city === city);

  const insight = useDynamic
    ? dynamic.insight
    : city === "Bangalore"
    ? "K-RERA 'Applications Under Process' (currently 227) provides a 3-6 week early warning on upcoming developer launches. Revenue Recovery Certificates are the strongest financial stress signal."
    : city === "Pune"
    ? "Pune RERA new filings at 184 indicate sustained developer confidence in western Pune corridors."
    : "MahaRERA's 312 new filings and 28 lapsed registrations provide the clearest picture of Mumbai's development pipeline.";

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {location && (
        <div className="rounded-2xl bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">📍 Regulatory Watch: {location}</p>
        </div>
      )}

      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> RERA Intelligence Signals
          </h3>
          <p className="text-sm text-muted-foreground">{useDynamic ? "AI-Generated · Location-specific" : `Regulatory compliance tracking · ${city === "Bangalore" ? "K-RERA" : city === "Mumbai" ? "MahaRERA" : "Pune RERA"}`}</p>
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
        <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Analyzing regulatory signals...</p>
    </div>
  );
}
