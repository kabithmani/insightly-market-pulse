import { Radar, Loader2 } from "lucide-react";
import { unknownSignals } from "@/data/intelligenceData";

interface Props {
  city: string;
  location?: string;
  dynamic?: {
    signals: { title: string; description: string; patternMatch: string; implication: string; nextAction: string; confidence: string }[];
  };
  loading?: boolean;
}

export default function EmergingCorridors({ city, location, dynamic, loading }: Props) {
  if (loading) return <LoadingState />;

  const isPreFed = ["Bangalore", "Pune", "Mumbai"].includes(city);
  const useDynamic = dynamic && !isPreFed;

  const signals = useDynamic ? dynamic.signals : unknownSignals.filter(s => s.city === city);

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {location && (
        <div className="rounded-2xl bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">📍 Emerging Corridors: {location}</p>
        </div>
      )}

      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
          <Radar className="h-5 w-5 text-accent" /> Emerging Corridors & Unknown Signals
        </h3>
        <p className="text-sm text-muted-foreground mb-6">{useDynamic ? "AI-Generated · Location-specific signals" : "Low-confidence, high-upside signals detected by the Unknown Signals Bot"}</p>

        <div className="space-y-4">
          {signals.map((s, i) => (
            <div key={i} className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-5">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-2">🟡 {s.title}</h4>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                  s.confidence === "MEDIUM" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                }`}>{s.confidence} CONFIDENCE</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-card p-3">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Pattern Match</p>
                  <p className="text-xs text-foreground mt-1">{s.patternMatch}</p>
                </div>
                <div className="rounded-xl bg-card p-3">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Implication if Confirmed</p>
                  <p className="text-xs text-foreground mt-1">{s.implication}</p>
                </div>
                <div className="rounded-xl bg-card p-3">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Next Action</p>
                  <p className="text-xs text-foreground mt-1">{s.nextAction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-muted/30 border border-border p-6">
        <p className="text-xs text-muted-foreground">
          All signals sourced from the {useDynamic ? "AI Intelligence Engine" : "Unknown Signals Bot"}. Further verification via Dishaank, MCA filings, and sub-registrar data is ongoing. Confidence levels below 0.7 – treat as intelligence leads, not confirmed insights.
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Detecting emerging corridors...</p>
    </div>
  );
}
