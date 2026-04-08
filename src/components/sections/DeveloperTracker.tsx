import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { developerTrackers } from "@/data/intelligenceData";
import { Loader2 } from "lucide-react";

interface Props {
  city: string;
  location?: string;
  dynamic?: {
    trackers: { developer: string; latestMove: string; score: number; signal: string }[];
    insight: string;
  };
  loading?: boolean;
}

const SIGNAL_COLORS: Record<string, string> = {
  BULLISH: "bg-green-100 text-green-700",
  STRONG: "bg-blue-100 text-blue-700",
  MONITOR: "bg-amber-100 text-amber-700",
  WATCH: "bg-orange-100 text-orange-700",
  STEADY: "bg-cyan-100 text-cyan-700",
  INTEL: "bg-purple-100 text-purple-700",
};

export default function DeveloperTracker({ city, location, dynamic, loading }: Props) {
  if (loading) return <LoadingState />;

  const isPreFed = ["Bangalore", "Pune", "Mumbai"].includes(city);
  const useDynamic = dynamic && !isPreFed;

  const devs = useDynamic
    ? dynamic.trackers.map(d => ({ ...d, activityScore: d.score })).sort((a, b) => b.activityScore - a.activityScore)
    : developerTrackers.filter(d => d.city === city).sort((a, b) => b.activityScore - a.activityScore);

  const insight = useDynamic
    ? dynamic.insight
    : city === "Bangalore"
    ? "Developer convergence in North Bangalore is the clearest signal of this cycle. Prestige (92), Brigade (88), and Sobha (95) are in aggressive deployment mode."
    : city === "Pune"
    ? "Panchshil's Hinjewadi acquisition (85 score) signals institutional confidence in western Pune's IT corridor."
    : "Macrotech (Lodha) at 94 leads Mumbai with their Worli ultra-luxury play at ₹85,000+ psf.";

  const chartData = devs.map(d => ({
    name: d.developer.length > 12 ? d.developer.slice(0, 12) + "…" : d.developer,
    score: d.activityScore ?? (d as any).score,
    signal: d.signal,
  }));

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {location && (
        <div className="rounded-2xl bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">📍 Developer Tracker: {location}</p>
        </div>
      )}

      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-1">Developer Activity Scores</h3>
        <p className="text-sm text-muted-foreground mb-4">{useDynamic ? "AI-Generated · Location-specific" : "Derived from bot signals (land, financial, media)"} · Score out of 100</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 10, right: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.signal === "BULLISH" ? "hsl(142, 71%, 45%)" : d.signal === "STRONG" ? "hsl(var(--primary))" : d.signal === "MONITOR" ? "hsl(45, 93%, 47%)" : "hsl(var(--muted-foreground))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Developer Strategy Details</h3>
          <p className="text-sm text-muted-foreground">Source: Developer IR, RERA filings, media intelligence</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Developer</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Latest Move</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Score</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Signal</th>
              </tr>
            </thead>
            <tbody>
              {devs.map((d: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-bold text-foreground whitespace-nowrap">{d.developer}</td>
                  <td className="p-3 text-muted-foreground text-xs max-w-xs">{d.latestMove}</td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-foreground">{d.activityScore ?? d.score}</span>
                    <span className="text-muted-foreground text-xs">/100</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${SIGNAL_COLORS[d.signal] || "bg-muted text-muted-foreground"}`}>{d.signal}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6">
        <h4 className="font-bold text-foreground text-sm mb-2">📊 Analyst Commentary</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Analyzing developer activity...</p>
    </div>
  );
}
