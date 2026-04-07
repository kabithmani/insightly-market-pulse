import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import { microMarkets } from "@/data/microMarkets";

interface Props { city: string; }

function getCMIColor(cmi: number): string {
  if (cmi >= 8.5) return "bg-red-500";
  if (cmi >= 8.0) return "bg-orange-500";
  if (cmi >= 7.5) return "bg-amber-400";
  if (cmi >= 7.0) return "bg-yellow-300";
  return "bg-green-300";
}

function getCMITextColor(cmi: number): string {
  if (cmi >= 8.0) return "text-white";
  return "text-foreground";
}

function getTrend(yoy: number): string {
  if (yoy >= 15) return "▲ Rising";
  if (yoy >= 8) return "► Stable+";
  return "► Stable";
}

export default function PricingHeatmap({ city }: Props) {
  const markets = microMarkets.filter(m => m.city === city).sort((a, b) => b.cmi - a.cmi);

  const chartData = markets.map(m => ({
    name: m.name,
    psf: m.avg_psf,
    yoy: m.yoy_change,
    cmi: m.cmi,
  }));

  const scatterData = markets.map(m => ({
    x: m.yoy_change,
    y: m.cmi,
    z: m.avg_psf,
    name: m.name,
  }));

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Heatmap Table */}
      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Corridor Pricing Heatmap</h3>
          <p className="text-sm text-muted-foreground">
            Average transacted residential PSF · March 2026 · CMI = Corridor Momentum Index (0-10)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Micro-Market</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Avg PSF (₹)</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">YOY Change</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Trend</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">CMI</th>
                <th className="p-3 font-semibold text-muted-foreground">Momentum Bar</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => (
                <tr key={m.name} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{m.name}</td>
                  <td className="p-3 text-right text-foreground font-medium">₹{m.avg_psf.toLocaleString("en-IN")}</td>
                  <td className={`p-3 text-right font-bold ${m.yoy_change >= 15 ? "text-green-600" : m.yoy_change >= 10 ? "text-blue-600" : "text-foreground"}`}>
                    +{m.yoy_change}%
                  </td>
                  <td className="p-3 text-center text-xs font-medium text-muted-foreground">{getTrend(m.yoy_change)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center justify-center w-10 h-7 rounded-lg text-xs font-bold ${getCMIColor(m.cmi)} ${getCMITextColor(m.cmi)}`}>
                      {m.cmi}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${m.cmi >= 8.5 ? "bg-red-500" : m.cmi >= 8.0 ? "bg-orange-500" : m.cmi >= 7.5 ? "bg-amber-400" : "bg-green-400"}`}
                        style={{ width: `${(m.cmi / 10) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PSF Comparison */}
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Price per Sft Comparison</h3>
          <p className="text-sm text-muted-foreground mb-4">Sorted by CMI score</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: 10, right: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }}
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Avg PSF"]}
                />
                <Bar dataKey="psf" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.cmi >= 8.5 ? "hsl(var(--accent))" : d.cmi >= 8.0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CMI vs YOY Scatter */}
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">CMI vs YOY Appreciation</h3>
          <p className="text-sm text-muted-foreground mb-4">Bubble size = Avg PSF</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 10, right: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="x" name="YOY %" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} label={{ value: "YOY %", position: "bottom", fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="number" dataKey="y" name="CMI" domain={[6, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} label={{ value: "CMI", angle: -90, position: "insideLeft", fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <ZAxis type="number" dataKey="z" range={[40, 400]} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }}
                  formatter={(value: number, name: string) => {
                    if (name === "YOY %") return [`${value}%`, name];
                    if (name === "CMI") return [value, name];
                    return [`₹${value.toLocaleString("en-IN")}`, "Avg PSF"];
                  }}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""}
                />
                <Scatter data={scatterData} fill="hsl(var(--primary))" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CMI Methodology */}
      <div className="rounded-3xl bg-muted/30 border border-border p-6">
        <h4 className="font-bold text-foreground text-sm mb-3">📐 CMI Methodology</h4>
        <p className="text-sm text-muted-foreground mb-3">The Corridor Momentum Index (CMI) is a composite score (0-10) based on:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Price Velocity", weight: "30%", desc: "YOY price growth" },
            { label: "Infra Proximity", weight: "25%", desc: "Nearby infra project impact" },
            { label: "Developer Conviction", weight: "25%", desc: "Activity scores in corridor" },
            { label: "RERA Velocity", weight: "20%", desc: "YOY registration growth" },
          ].map(c => (
            <div key={c.label} className="rounded-2xl bg-card p-4">
              <p className="text-xs font-bold text-primary">{c.weight}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{c.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
