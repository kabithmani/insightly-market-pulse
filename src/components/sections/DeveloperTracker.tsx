import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { developerTrackers } from "@/data/intelligenceData";

interface Props { city: string; }

const SIGNAL_COLORS: Record<string, string> = {
  BULLISH: "bg-green-100 text-green-700",
  STRONG: "bg-blue-100 text-blue-700",
  MONITOR: "bg-amber-100 text-amber-700",
  WATCH: "bg-orange-100 text-orange-700",
  STEADY: "bg-cyan-100 text-cyan-700",
  INTEL: "bg-purple-100 text-purple-700",
};

export default function DeveloperTracker({ city }: Props) {
  const devs = developerTrackers.filter(d => d.city === city).sort((a, b) => b.activityScore - a.activityScore);

  const chartData = devs.map(d => ({
    name: d.developer.length > 12 ? d.developer.slice(0, 12) + "…" : d.developer,
    score: d.activityScore,
    signal: d.signal,
  }));

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Chart */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-1">Developer Activity Scores</h3>
        <p className="text-sm text-muted-foreground mb-4">Derived from bot signals (land, financial, media) · Score out of 100</p>
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

      {/* Developer Table */}
      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Developer Strategy Details</h3>
          <p className="text-sm text-muted-foreground">Source: Developer IR, K-RERA filings, media intelligence</p>
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
              {devs.map((d, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-bold text-foreground whitespace-nowrap">{d.developer}</td>
                  <td className="p-3 text-muted-foreground text-xs max-w-xs">{d.latestMove}</td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-foreground">{d.activityScore}</span>
                    <span className="text-muted-foreground text-xs">/100</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${SIGNAL_COLORS[d.signal]}`}>
                      {d.signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analyst Commentary */}
      <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6">
        <h4 className="font-bold text-foreground text-sm mb-2">📊 Analyst Commentary</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {city === "Bangalore" && "Developer convergence in North Bangalore is the clearest signal of this cycle. Prestige (92), Brigade (88), and Sobha (95) are in aggressive deployment mode. Sobha's record ₹2,340Cr pre-sales and Dream Acres selling out in 48 hours validate the demand thesis. Watch Godrej's scouting activity – their entry would be a major conviction signal. Total Environment's Kanakapura JDA talks suggest the sustainable luxury segment is gaining institutional interest."}
          {city === "Pune" && "Panchshil's Hinjewadi acquisition (85 score) signals institutional confidence in western Pune's IT corridor. Kolte-Patil and VTP are aggressively targeting the mid-premium segment in satellite markets. Godrej's Mahalunge land bank for a 2,000+ unit mega-launch will be the defining project of 2026."}
          {city === "Mumbai" && "Macrotech (Lodha) at 94 leads Mumbai with their Worli ultra-luxury play at ₹85,000+ psf – setting a new price ceiling. Oberoi's Goregaon-Mulund mega-township represents the largest suburban land play. Godrej's Vikhroli monetisation continues to deliver – 3 new launches in pipeline."}
        </p>
      </div>
    </div>
  );
}
