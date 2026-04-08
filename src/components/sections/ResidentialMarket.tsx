import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getMarketMetrics, getSegments } from "@/data/intelligenceData";
import { Loader2 } from "lucide-react";

interface Props {
  city: string;
  location?: string;
  dynamic?: {
    metrics: { metric: string; value: string; change: string; signal: string }[];
    segments: { segment: string; units: number; share: string; yoyChange: string }[];
    insight: string;
  };
  loading?: boolean;
}

const SIGNAL_COLORS: Record<string, string> = {
  STRONG: "text-green-600 bg-green-50",
  RISING: "text-blue-600 bg-blue-50",
  HEALTHY: "text-emerald-600 bg-emerald-50",
  STEADY: "text-amber-600 bg-amber-50",
  WATCH: "text-red-600 bg-red-50",
};

const CHART_COLORS = ["hsl(var(--muted-foreground))", "hsl(var(--muted-foreground))", "hsl(var(--primary))", "hsl(var(--primary))", "hsl(var(--accent))"];

export default function ResidentialMarket({ city, location, dynamic, loading }: Props) {
  if (loading) return <LoadingState />;

  const isPreFed = ["Bangalore", "Pune", "Mumbai"].includes(city);
  const useDynamic = dynamic && !isPreFed;

  const metrics = useDynamic
    ? dynamic.metrics.map(m => ({ metric: m.metric, currentCycle: m.value, previousCycle: "-", change: m.change, signal: m.signal as any }))
    : getMarketMetrics(city);

  const segments = useDynamic
    ? dynamic.segments
    : getSegments(city);

  const insight = useDynamic
    ? dynamic.insight
    : city === "Bangalore"
    ? "The market is experiencing a clear premiumisation trend. Luxury segment (₹3Cr+) grew 41% YOY while affordable declined 9%. NRI participation at 38-47% is unprecedented and concentrated in North Bangalore and Sarjapur corridors."
    : city === "Pune"
    ? "Pune's market mirrors Bangalore's premiumisation but with a 12-18 month lag. The luxury segment surge (+48% YOY) is driven by IT professionals upgrading from mid-segment."
    : "Mumbai's market is structurally supply-constrained, driving persistent price appreciation across segments. The luxury segment (₹7Cr+) saw 38% growth, fueled by institutional and NRI buyers.";

  const chartData = segments.map(s => ({
    name: typeof s.segment === "string" ? s.segment.split("(")[0].trim() : s.segment,
    units: s.unitsSold ?? s.units,
    share: parseInt(s.share),
  }));

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {location && (
        <div className="rounded-2xl bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">📍 Residential Market: {location}</p>
        </div>
      )}

      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Market Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">{useDynamic ? "AI-Generated · Location-specific data" : "Current cycle vs previous cycle · Source: K-RERA, portals"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Metric</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">{useDynamic ? "Value" : "Current Cycle"}</th>
                {!useDynamic && <th className="text-right p-3 font-semibold text-muted-foreground">Previous Cycle</th>}
                <th className="text-right p-3 font-semibold text-muted-foreground">Change</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Signal</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m: any, i: number) => (
                <tr key={m.metric} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-medium text-foreground">{m.metric}</td>
                  <td className="p-3 text-right text-foreground font-semibold">{m.currentCycle || m.value}</td>
                  {!useDynamic && <td className="p-3 text-right text-muted-foreground">{m.previousCycle}</td>}
                  <td className="p-3 text-right font-semibold text-green-600">{m.change}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${SIGNAL_COLORS[m.signal] || "bg-muted text-muted-foreground"}`}>{m.signal}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Segment Breakdown</h3>
          <p className="text-sm text-muted-foreground mb-4">Units sold by price segment</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} formatter={(value: number) => [value.toLocaleString("en-IN") + " units", "Sold"]} />
                <Bar dataKey="units" radius={[0, 8, 8, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-card shadow-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">Detailed Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-semibold text-muted-foreground">Segment</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Units</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Share</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">YOY</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((s: any, i: number) => (
                  <tr key={s.segment} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                    <td className="p-3 font-medium text-foreground">{s.segment}</td>
                    <td className="p-3 text-right text-foreground">{(s.unitsSold ?? s.units ?? 0).toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right text-muted-foreground">{s.share}</td>
                    <td className={`p-3 text-right font-semibold ${s.yoyChange.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{s.yoyChange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6">
        <h4 className="font-bold text-foreground text-sm mb-2">📊 Analyst Insight</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Analyzing residential market data...</p>
    </div>
  );
}
