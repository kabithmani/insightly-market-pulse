import { TrendingUp, Building2, Landmark, Gauge } from "lucide-react";
import { MarketWithDistance } from "@/utils/geo";

interface Props {
  markets: MarketWithDistance[];
  insights: {
    avgPrice: number;
    highestCMI: MarketWithDistance;
    topAppreciating: MarketWithDistance;
    allLandDeals: { market: string; deal: string }[];
    allInfra: { market: string; news: string }[];
  };
  location: string;
  city: string;
  radius: number;
}

export default function MarketResults({ markets, insights, location, city, radius }: Props) {
  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="Markets Found"
          value={markets.length.toString()}
          color="text-primary"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Avg PSF"
          value={`₹${insights.avgPrice.toLocaleString("en-IN")}`}
          color="text-accent"
        />
        <StatCard
          icon={<Gauge className="h-5 w-5" />}
          label="Highest CMI"
          value={`${insights.highestCMI.name} (${insights.highestCMI.cmi})`}
          color="text-primary"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Top Growth"
          value={`${insights.topAppreciating.name} (${insights.topAppreciating.yoy_change}%)`}
          color="text-accent"
        />
      </div>

      {/* Market Table */}
      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Micro-Market Analysis</h3>
          <p className="text-sm text-muted-foreground">
            {markets.length} markets within {radius} km of {location}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Market</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Distance</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Avg PSF</th>
                <th className="text-right p-3 font-medium text-muted-foreground">YOY %</th>
                <th className="text-right p-3 font-medium text-muted-foreground">CMI</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Land Deals</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Infra</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => (
                <tr key={m.name} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                  <td className="p-3 font-medium text-foreground">{m.name}</td>
                  <td className="p-3 text-right text-muted-foreground">{m.distance} km</td>
                  <td className="p-3 text-right text-foreground">₹{m.avg_psf.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">
                    <span className={m.yoy_change >= 15 ? "text-green-600 font-semibold" : "text-foreground"}>
                      {m.yoy_change}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={m.cmi >= 8.0 ? "text-primary font-semibold" : "text-foreground"}>
                      {m.cmi}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs max-w-[200px]">
                    {m.land_deals.length > 0 ? m.land_deals.join("; ") : "—"}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs max-w-[200px]">
                    {m.infra_news.length > 0 ? m.infra_news.join("; ") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Land Deals */}
      {insights.allLandDeals.length > 0 && (
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Landmark className="h-5 w-5 text-accent" /> Land Deals & Shell Entity Tracking
          </h3>
          <div className="space-y-3">
            {insights.allLandDeals.map((d, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="rounded-full bg-accent/10 text-accent text-xs font-semibold px-2 py-1 shrink-0">
                  {d.market}
                </span>
                <span className="text-sm text-muted-foreground">{d.deal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Infra */}
      {insights.allInfra.length > 0 && (
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Infrastructure Impact
          </h3>
          <div className="flex flex-wrap gap-2">
            {insights.allInfra.map((inf, i) => (
              <span
                key={i}
                className="rounded-2xl bg-primary/10 text-primary text-xs font-medium px-3 py-1.5"
              >
                {inf.market}: {inf.news}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-3xl bg-card shadow-card p-5">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-1 truncate">{value}</p>
    </div>
  );
}
