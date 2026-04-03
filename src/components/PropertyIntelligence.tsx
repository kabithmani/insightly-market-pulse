import { ExternalLink, TrendingUp, Building2, BarChart3, MapPin, AlertCircle, Home, Gauge, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Property, getBenchmark } from "@/data/propertyData";
import { microMarkets } from "@/data/microMarkets";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from "recharts";

interface Props {
  property: Property;
  city: string;
}

export default function PropertyIntelligence({ property, city }: Props) {
  const benchmark = getBenchmark(property.microMarket, city);
  const microMarket = microMarkets.find(m => m.name === property.microMarket && m.city === city);

  const avgPsf = (property.psfMin + property.psfMax) / 2;
  const benchmarkPsf = benchmark?.avgBuyingPsf || avgPsf;
  const psfDelta = ((avgPsf - benchmarkPsf) / benchmarkPsf * 100).toFixed(1);
  const isAboveMarket = Number(psfDelta) > 0;

  // Supply-demand signal
  const availabilityRatio = property.totalUnits > 0 ? (property.availableUnits / property.totalUnits * 100) : 0;
  const demandSignal = availabilityRatio < 5 ? "Very High Demand" : availabilityRatio < 15 ? "High Demand" : availabilityRatio < 30 ? "Moderate Demand" : "Adequate Supply";
  const demandColor = availabilityRatio < 5 ? "text-red-600" : availabilityRatio < 15 ? "text-green-600" : availabilityRatio < 30 ? "text-amber-600" : "text-muted-foreground";

  // Radar chart data for property scoring
  const radarData = [
    { subject: "Location", score: microMarket ? Math.min(10, microMarket.cmi + 0.5) : 7 },
    { subject: "Price Value", score: isAboveMarket ? Math.max(4, 8 - Number(psfDelta) / 5) : Math.min(10, 8 + Math.abs(Number(psfDelta)) / 5) },
    { subject: "Builder Rep", score: ["Prestige Group", "Godrej Properties", "Sobha Limited", "Brigade Group", "Macrotech (Lodha)", "Oberoi Realty"].includes(property.builder) ? 9 : 7.5 },
    { subject: "Infra Impact", score: microMarket && microMarket.infra_news.length > 0 ? 8.5 : 6.5 },
    { subject: "Rental Yield", score: property.rentalYield > 3.5 ? 9 : property.rentalYield > 2.5 ? 7 : 5 },
    { subject: "Growth", score: microMarket ? Math.min(10, microMarket.yoy_change / 3 + 5) : 6 },
  ];

  // Comparison chart: property vs market
  const comparisonData = [
    { name: "This Property", psf: avgPsf },
    ...(benchmark ? [{ name: "Market Avg", psf: benchmark.avgBuyingPsf }] : []),
    ...(microMarket ? [{ name: "Transacted Avg", psf: microMarket.avg_psf }] : []),
  ];

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      {/* Property Header */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                property.type === "Apartment" ? "bg-primary/10 text-primary" :
                property.type === "Villa" ? "bg-green-100 text-green-700" :
                property.type === "Plot" ? "bg-amber-100 text-amber-700" :
                "bg-purple-100 text-purple-700"
              }`}>{property.type}</span>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                property.status === "Ready to Move" ? "bg-green-100 text-green-700" :
                property.status === "Under Construction" ? "bg-blue-100 text-blue-700" :
                property.status === "Pre-Launch" ? "bg-purple-100 text-purple-700" :
                "bg-amber-100 text-amber-700"
              }`}>{property.status}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{property.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5" /> {property.microMarket}, {city}
            </p>
            <a href={property.builderUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
              {property.builder} <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="text-right shrink-0">
            <p className="text-2xl font-black text-foreground">{property.priceRange}</p>
            <p className="text-sm text-muted-foreground">₹{property.psfMin.toLocaleString("en-IN")} – {property.psfMax.toLocaleString("en-IN")} per sqft</p>
            <p className="text-xs text-muted-foreground mt-1">{property.unitConfig} · {property.unitSizesMin}–{property.unitSizesMax} sqft</p>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <Fact label="RERA ID" value={property.reraId.length > 20 ? property.reraId.slice(0, 20) + "…" : property.reraId} link={property.reraUrl} />
          <Fact label="Total Units" value={property.totalUnits.toLocaleString("en-IN")} />
          <Fact label="Available" value={property.availableUnits.toLocaleString("en-IN")} />
          <Fact label="Completion" value={property.completionDate} />
        </div>
      </div>

      {/* A. Neighborhood Benchmarks */}
      {benchmark && (
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <Gauge className="h-5 w-5 text-primary" /> Neighborhood Benchmarks — {property.microMarket}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <BenchmarkCard label="Avg Buying PSF" value={`₹${benchmark.avgBuyingPsf.toLocaleString("en-IN")}`} />
            <BenchmarkCard label="Avg Rental PSF" value={`₹${benchmark.avgRentalPsf}/sqft/mo`} />
            <BenchmarkCard label="Rental Yield" value={`${benchmark.rentalYield}%`} />
            <BenchmarkCard label="Active Listings" value={benchmark.activeListings.toString()} />
          </div>

          {/* Outlier Analysis */}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="h-4 w-4 text-green-700" />
                <span className="text-xs font-bold text-green-700">High Outlier</span>
              </div>
              <p className="text-sm text-foreground font-medium">{benchmark.priceOutlierHigh}</p>
              <p className="text-xs text-muted-foreground mt-1"><em>Remark:</em> {benchmark.remarkHigh}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownRight className="h-4 w-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-700">Low Outlier</span>
              </div>
              <p className="text-sm text-foreground font-medium">{benchmark.priceOutlierLow}</p>
              <p className="text-xs text-muted-foreground mt-1"><em>Remark:</em> {benchmark.remarkLow}</p>
            </div>
          </div>

          {/* Sources */}
          <div className="mt-4 flex flex-wrap gap-2">
            {benchmark.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted/50 text-xs text-primary hover:bg-muted transition-colors">
                {s.name} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Price Comparison */}
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h4 className="text-sm font-bold text-foreground mb-1">Price vs Market</h4>
          <p className="text-xs text-muted-foreground mb-4">
            This property is <span className={isAboveMarket ? "text-amber-600 font-semibold" : "text-green-600 font-semibold"}>
              {isAboveMarket ? `${psfDelta}% above` : `${Math.abs(Number(psfDelta))}% below`}
            </span> market average
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "PSF"]} />
                <Bar dataKey="psf" radius={[6, 6, 0, 0]}>
                  {comparisonData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Score Radar */}
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h4 className="text-sm font-bold text-foreground mb-1">Property Intelligence Score</h4>
          <p className="text-xs text-muted-foreground mb-4">Multi-dimensional analysis (0-10)</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <RechartsRadar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* B. Market Listings & Supply */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-accent" /> Market Listings & Supply
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground font-medium">Supply Signal</p>
            <p className={`text-sm font-bold ${demandColor}`}>{demandSignal}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{availabilityRatio.toFixed(0)}% inventory remaining</p>
          </div>
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground font-medium">Builder Inventory</p>
            <p className="text-sm font-bold text-foreground">{property.availableUnits} units</p>
            <p className="text-[10px] text-muted-foreground mt-1">Primary market</p>
          </div>
          {benchmark && (
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground font-medium">Total Listings</p>
              <p className="text-sm font-bold text-foreground">{benchmark.activeListings}</p>
              <p className="text-[10px] text-muted-foreground mt-1">In {property.microMarket}</p>
            </div>
          )}
        </div>

        {/* Portal Listings */}
        <div className="flex flex-wrap gap-2">
          {property.portalListings.map((pl, i) => (
            <a key={i} href={pl.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <span className="text-xs font-semibold text-foreground">{pl.portal}</span>
              <span className="text-[10px] text-muted-foreground">{pl.count} listings</span>
              <ExternalLink className="h-3 w-3 text-primary" />
            </a>
          ))}
          <a href={property.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors">
            <span className="text-xs font-semibold text-primary">Builder Website</span>
            <ExternalLink className="h-3 w-3 text-primary" />
          </a>
        </div>
      </div>

      {/* D. Investment Insights */}
      <div className="rounded-3xl bg-accent/5 border-2 border-accent/30 p-6">
        <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" /> Investment Intelligence
        </h4>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Price Position:</strong>{" "}
            {isAboveMarket
              ? `This property is priced ${psfDelta}% above the ${property.microMarket} market average of ₹${benchmarkPsf.toLocaleString("en-IN")}/sqft. This premium is ${Number(psfDelta) > 10 ? "significant — ensure the builder brand, amenities, and location justify the markup" : "within acceptable range for a branded project"}.`
              : `This property is priced ${Math.abs(Number(psfDelta))}% below the market average — potentially offering value entry for investors.`
            }
          </p>
          {microMarket && (
            <p>
              <strong className="text-foreground">Micro-Market Momentum:</strong>{" "}
              {property.microMarket} has a CMI score of {microMarket.cmi}/10 with {microMarket.yoy_change}% YOY appreciation.
              {microMarket.cmi >= 8.0 ? " This indicates strong capital momentum — a positive signal for medium-term appreciation." : " Market momentum is moderate — focus on rental yield for returns."}
            </p>
          )}
          <p>
            <strong className="text-foreground">Supply-Demand:</strong>{" "}
            {availabilityRatio < 10
              ? "Very limited inventory remaining. Strong absorption indicates robust demand. Entry window may be closing."
              : availabilityRatio < 25
              ? "Healthy absorption with moderate availability. Good entry point for end-users and investors."
              : "Adequate supply available. Negotiate for better pricing or wait for scheme benefits."
            }
          </p>
          {property.rentalYield > 0 && (
            <p>
              <strong className="text-foreground">Rental Perspective:</strong>{" "}
              Estimated rental yield of {property.rentalYield}% at ₹{property.avgRentalPsf}/sqft/month.
              {property.rentalYield >= 3.5 ? " Above-average yield — attractive for rental income investors." : property.rentalYield >= 2.5 ? " Market-rate yield. Capital appreciation is the primary return driver." : " Below-average yield typical of premium locations. Pure capital play."}
            </p>
          )}
          {microMarket && microMarket.infra_news.length > 0 && (
            <p>
              <strong className="text-foreground">Infrastructure Catalyst:</strong>{" "}
              Key developments in catchment: {microMarket.infra_news.join(", ")}. These projects typically drive 15-35% appreciation within 24-36 months of completion.
            </p>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-4">
          Analysis by <strong>Kabith Mani</strong> · Sources: K-RERA, MahaRERA, Sub-Registrar filings, 99acres, MagicBricks, Builder IRs
        </p>
      </div>

      {/* Amenities */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <h4 className="text-sm font-bold text-foreground mb-3">Amenities</h4>
        <div className="flex flex-wrap gap-2">
          {property.amenities.map((a, i) => (
            <span key={i} className="px-3 py-1.5 rounded-xl bg-muted/50 text-xs font-medium text-foreground">{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-3">
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          {value} <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <p className="text-xs font-semibold text-foreground">{value}</p>
      )}
    </div>
  );
}

function BenchmarkCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-4">
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}
