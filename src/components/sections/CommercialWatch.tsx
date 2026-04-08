import { Building2, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { commercialMarkets } from "@/data/intelligenceData";

interface Props {
  city: string;
  location?: string;
  dynamic?: {
    markets: { subMarket: string; avgRent: string; vacancy: string; absorption: string; signal: string }[];
    insight: string;
  };
  loading?: boolean;
}

const SIGNAL_COLORS: Record<string, string> = {
  STRONG: "bg-green-100 text-green-700",
  RISING: "bg-blue-100 text-blue-700",
  STEADY: "bg-amber-100 text-amber-700",
  BREAKOUT: "bg-purple-100 text-purple-700",
  WATCH: "bg-red-100 text-red-700",
};

export default function CommercialWatch({ city, location, dynamic, loading }: Props) {
  if (loading) return <LoadingState />;

  const isPreFed = ["Bangalore", "Pune", "Mumbai"].includes(city);
  const useDynamic = dynamic && !isPreFed;

  const markets = useDynamic
    ? dynamic.markets.map(m => ({ ...m, avgRentPsfMo: m.avgRent, yoyAbsorption: m.absorption }))
    : commercialMarkets.filter(m => m.city === city);

  const insight = useDynamic ? dynamic.insight : "";

  const chartData = markets.map(m => ({
    name: m.subMarket,
    vacancy: parseFloat(m.vacancy),
    signal: m.signal,
  }));

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {location && (
        <div className="rounded-2xl bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">📍 Commercial Watch: {location}</p>
        </div>
      )}

      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Commercial Real Estate Watch
          </h3>
          <p className="text-sm text-muted-foreground">{useDynamic ? "AI-Generated · Location-specific" : "Office absorption, GCC activity, leasing pipelines"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Sub-Market</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Avg Rent (psf/mo)</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Vacancy</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">YOY Absorption</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Signal</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{m.subMarket}</td>
                  <td className="p-3 text-right text-foreground font-medium">{m.avgRentPsfMo || m.avgRent}</td>
                  <td className={`p-3 text-right font-medium ${parseFloat(m.vacancy) < 8 ? "text-green-600" : "text-foreground"}`}>{m.vacancy}</td>
                  <td className="p-3 text-right text-green-600 font-semibold">{m.yoyAbsorption || m.absorption}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${SIGNAL_COLORS[m.signal] || "bg-muted text-muted-foreground"}`}>{m.signal}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-1">Vacancy Rates by Sub-Market</h3>
        <p className="text-sm text-muted-foreground mb-4">Lower vacancy = tighter market = stronger demand signal</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="%" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Vacancy"]} />
              <Bar dataKey="vacancy" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.vacancy < 8 ? "hsl(142, 71%, 45%)" : d.vacancy < 12 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {useDynamic && insight && (
        <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6">
          <h4 className="font-bold text-foreground text-sm mb-2">📊 Commercial Outlook</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
        </div>
      )}

      {!useDynamic && city === "Bangalore" && (
        <div className="rounded-3xl bg-accent/5 border-2 border-accent/30 p-6">
          <h4 className="font-bold text-foreground text-sm mb-2">🏢 GCC Signal</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            North Bangalore vacancy at <strong className="text-foreground">4.1%</strong>, absorption <strong className="text-foreground">+61% YOY</strong> – the tightest market in the city.
          </p>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Analyzing commercial market...</p>
    </div>
  );
}
