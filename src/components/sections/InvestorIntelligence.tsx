import { investorDeals, capRates } from "@/data/intelligenceData";

interface Props { city: string; }

export default function InvestorIntelligence({ city }: Props) {
  const deals = investorDeals.filter(d => d.city === city);

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Deal Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((d, i) => (
          <div key={i} className="rounded-3xl bg-card shadow-card p-6 hover:shadow-lg transition-shadow">
            <span className="text-2xl mb-3 block">{d.icon}</span>
            <h4 className="font-bold text-foreground text-sm">{d.title}</h4>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d.details}</p>
          </div>
        ))}
      </div>

      {/* Cap Rate Table */}
      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Cap Rate & Yield Intelligence</h3>
          <p className="text-sm text-muted-foreground">Pan-India benchmarks · Q1 2026</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Asset Class</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Cap Rate</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Trend</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Investor Appetite</th>
              </tr>
            </thead>
            <tbody>
              {capRates.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{c.assetClass}</td>
                  <td className="p-3 text-right text-foreground font-medium">{c.capRate}</td>
                  <td className="p-3 text-center text-muted-foreground text-xs">{c.trend}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.appetite === "STRONG" ? "bg-green-100 text-green-700" :
                      c.appetite === "RISING" ? "bg-blue-100 text-blue-700" :
                      c.appetite === "BREAKOUT" ? "bg-purple-100 text-purple-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {c.appetite}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6">
        <h4 className="font-bold text-foreground text-sm mb-2">📊 Investment Outlook</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {city === "Bangalore" && "Institutional capital is flowing into Bangalore at unprecedented levels. Puravankara's $180M AIF and Embassy REIT's expanding portfolio signal deep confidence. Grade-A office cap rates compressing to 7.2-8.1% indicate pricing power. NRI demand at 38-47% is structurally reshaping the luxury segment. Key thesis: airport-proximate assets and North Bangalore land plays offer the best risk-adjusted returns over a 3-5 year horizon."}
          {city === "Pune" && "Pune is emerging as a preferred institutional destination, with Panchshil's ₹800Cr AIF and Blackstone's warehousing expansion. The IT corridor's fundamentals – low vacancy, strong absorption – support continued cap rate compression. Mid-premium residential offers the best entry point."}
          {city === "Mumbai" && "Mumbai remains India's deepest institutional market. GIC's ₹4,200Cr BKC deal and Brookfield's portfolio expansion confirm the city's safe-haven status. The NMIA corridor offers a rare growth play in an otherwise mature market. Ultra-premium (Worli, BKC) and growth corridors (Ulwe, Kharghar) represent two distinct but equally compelling investment theses."}
        </p>
      </div>
    </div>
  );
}
