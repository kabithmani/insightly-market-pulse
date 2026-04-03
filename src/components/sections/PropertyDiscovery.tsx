import { useState, useEffect } from "react";
import { Search, MapPin, Loader2, Navigation, SlidersHorizontal, Building2, Home, LandPlot, Store, ExternalLink, ChevronDown, ChevronUp, TrendingUp, BarChart3, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { geocodeLocation } from "@/utils/geo";
import { getPropertiesInRadius, computeMarketInsights, getBenchmark, Property, PropertyType } from "@/data/propertyData";
import { microMarkets } from "@/data/microMarkets";
import { filterMarketsByRadius, generateInsights } from "@/utils/geo";
import PropertyIntelligence from "@/components/PropertyIntelligence";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

interface Props { city: string; }

const TYPE_ICONS: Record<PropertyType, typeof Building2> = {
  Apartment: Building2,
  Villa: Home,
  Plot: LandPlot,
  Commercial: Store,
};

const TYPE_COLORS: Record<PropertyType, string> = {
  Apartment: "bg-primary/10 text-primary",
  Villa: "bg-green-100 text-green-700",
  Plot: "bg-amber-100 text-amber-700",
  Commercial: "bg-purple-100 text-purple-700",
};

const STATUS_COLORS: Record<string, string> = {
  "Ready to Move": "bg-green-100 text-green-700",
  "Under Construction": "bg-blue-100 text-blue-700",
  "Pre-Launch": "bg-purple-100 text-purple-700",
  "Nearing Possession": "bg-amber-100 text-amber-700",
};

export default function PropertyDiscovery({ city }: Props) {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(25);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [error, setError] = useState("");
  const [geocodedName, setGeocodedName] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filterType, setFilterType] = useState<PropertyType | "All">("All");
  const [sortBy, setSortBy] = useState<"price" | "yield" | "units">("price");
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleSearch = async () => {
    if (!location.trim()) { setError("Please enter a location"); return; }
    setError(""); setLoading(true); setProperties(null); setSelectedProperty(null);

    const geo = await geocodeLocation(`${location}, ${city}, India`);
    if (!geo) { setError("Could not find that location. Try a more specific address."); setLoading(false); return; }

    setGeocodedName(geo.displayName);
    setGeoCoords({ lat: geo.lat, lng: geo.lng });
    const found = getPropertiesInRadius(geo.lat, geo.lng, radius, city);
    if (found.length === 0) { setError(`No properties found within ${radius} km. Try increasing the radius.`); setLoading(false); return; }

    setProperties(found);
    setLoading(false);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported by your browser"); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoCoords({ lat: latitude, lng: longitude });
        setGeocodedName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        const found = getPropertiesInRadius(latitude, longitude, radius, city);
        if (found.length === 0) { setError(`No properties found within ${radius} km.`); setLoading(false); return; }
        setProperties(found);
        setLoading(false);
      },
      () => { setError("Could not get your location. Please enter manually."); setLoading(false); }
    );
  };

  const filtered = properties
    ? properties.filter(p => filterType === "All" || p.type === filterType).sort((a, b) => {
        if (sortBy === "price") return a.psfMin - b.psfMin;
        if (sortBy === "yield") return b.rentalYield - a.rentalYield;
        return b.availableUnits - a.availableUnits;
      })
    : [];

  const insights = properties ? computeMarketInsights(properties) : null;

  // Market data for charts
  const marketData = properties && geoCoords
    ? filterMarketsByRadius(microMarkets, geoCoords.lat, geoCoords.lng, radius, city)
    : [];
  const marketInsights = marketData.length > 0 ? generateInsights(marketData) : null;

  const typeDistribution = insights ? Object.entries(insights.types).filter(([, v]) => v > 0).map(([k, v]) => ({ name: k, value: v })) : [];

  const COLORS = ["hsl(225, 73%, 57%)", "hsl(142, 71%, 45%)", "hsl(45, 93%, 47%)", "hsl(270, 60%, 55%)"];

  if (selectedProperty) {
    return (
      <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
        <Button variant="ghost" onClick={() => setSelectedProperty(null)} className="gap-2 text-muted-foreground hover:text-foreground">
          <ChevronUp className="h-4 w-4" /> Back to Results
        </Button>
        <PropertyIntelligence property={selectedProperty} city={city} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Search Bar */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-1">Property Discovery</h3>
        <p className="text-sm text-muted-foreground mb-4">Find all properties within your radius — apartments, villas, plots, commercial</p>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter an address, landmark, or area..."
              value={location}
              onChange={(e) => { setLocation(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 rounded-2xl border-border bg-muted/50 focus:bg-card text-sm"
            />
          </div>
          <Button onClick={handleGPS} variant="outline" className="h-12 rounded-2xl gap-2 shrink-0">
            <Navigation className="h-4 w-4" /> Use GPS
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          e.g., Hebbal, Bangalore | Koregaon Park, Pune | Bandra West, Mumbai
        </p>

        {/* Radius Slider */}
        <div className="mt-4 flex items-center gap-4">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <Slider
              value={[radius]}
              onValueChange={([v]) => setRadius(v)}
              min={5}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
          <span className="text-sm font-semibold text-foreground w-16 text-right">{radius} km</span>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive flex items-center gap-2">
            <Info className="h-4 w-4" /> {error}
          </p>
        )}

        <Button onClick={handleSearch} disabled={loading} className="mt-4 h-11 px-8 rounded-2xl gradient-primary text-primary-foreground shadow-button">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : <><Search className="mr-2 h-4 w-4" /> Discover Properties</>}
        </Button>
      </div>

      {/* Results */}
      {properties && insights && (
        <>
          {/* Quick Stats */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
            <StatCard icon={<Building2 className="h-5 w-5" />} label="Properties" value={insights.totalProperties.toString()} sub="found" color="text-primary" />
            <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Avg PSF" value={`₹${insights.avgPsf.toLocaleString("en-IN")}`} sub="per sq ft" color="text-accent" />
            <StatCard icon={<Home className="h-5 w-5" />} label="Available Units" value={insights.totalUnits.toLocaleString("en-IN")} sub="for sale" color="text-primary" />
            <StatCard icon={<BarChart3 className="h-5 w-5" />} label="Avg Yield" value={`${insights.avgYield}%`} sub="rental" color="text-green-600" />
            <StatCard icon={<Store className="h-5 w-5" />} label="Builders" value={insights.builders.length.toString()} sub="active" color="text-accent" />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Type Distribution */}
            <div className="rounded-3xl bg-card shadow-card p-6">
              <h4 className="text-sm font-bold text-foreground mb-4">Property Type Distribution</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} label={({ name, value }) => `${name}: ${value}`}>
                      {typeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PSF Comparison */}
            {marketData.length > 0 && (
              <div className="rounded-3xl bg-card shadow-card p-6">
                <h4 className="text-sm font-bold text-foreground mb-1">Micro-Market PSF Comparison</h4>
                <p className="text-xs text-muted-foreground mb-4">Average transacted price per sq ft</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketData.slice(0, 8).map(m => ({ name: m.name, psf: m.avg_psf }))} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" angle={-35} textAnchor="end" height={60} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Avg PSF"]} />
                      <Bar dataKey="psf" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-muted-foreground mr-2">Filter:</span>
            {(["All", "Apartment", "Villa", "Plot", "Commercial"] as const).map(t => (
              <Button key={t} variant={filterType === t ? "default" : "outline"} size="sm" onClick={() => setFilterType(t)} className="h-8 rounded-xl text-xs">
                {t}
              </Button>
            ))}
            <span className="ml-auto text-xs font-semibold text-muted-foreground mr-2">Sort:</span>
            {([["price", "Price"], ["yield", "Yield"], ["units", "Availability"]] as const).map(([k, l]) => (
              <Button key={k} variant={sortBy === k ? "default" : "outline"} size="sm" onClick={() => setSortBy(k as typeof sortBy)} className="h-8 rounded-xl text-xs">
                {l}
              </Button>
            ))}
          </div>

          {/* Property Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => {
              const Icon = TYPE_ICONS[p.type];
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProperty(p)}
                  className="rounded-3xl bg-card shadow-card p-5 hover:shadow-card-hover transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${TYPE_COLORS[p.type]}`}>
                      <Icon className="h-3 w-3" /> {p.type}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{p.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.builder} · {p.microMarket}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="rounded-xl bg-muted/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground font-medium">Price Range</p>
                      <p className="text-xs font-bold text-foreground">{p.priceRange}</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground font-medium">PSF</p>
                      <p className="text-xs font-bold text-foreground">₹{p.psfMin.toLocaleString("en-IN")} – {p.psfMax.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground font-medium">Config</p>
                      <p className="text-xs font-bold text-foreground">{p.unitConfig}</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground font-medium">Sizes</p>
                      <p className="text-xs font-bold text-foreground">{p.unitSizesMin} – {p.unitSizesMax} sqft</p>
                    </div>
                  </div>

                  {p.rentalYield > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-semibold text-green-600">{p.rentalYield}% rental yield</span>
                    </div>
                  )}

                  <p className="text-[10px] text-primary font-medium mt-3 group-hover:underline">
                    View Intelligence →
                  </p>
                </div>
              );
            })}
          </div>

          {/* Market Intelligence Summary */}
          {marketInsights && (
            <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6">
              <h4 className="font-bold text-foreground text-sm mb-2">📊 Market Intelligence Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Within {radius} km of {geocodedName?.split(",")[0]}, the average PSF is ₹{marketInsights.avgPrice.toLocaleString("en-IN")}.
                <strong className="text-foreground"> {marketInsights.highestCMI.name}</strong> leads with CMI {marketInsights.highestCMI.cmi}/10,
                while <strong className="text-foreground">{marketInsights.topAppreciating.name}</strong> shows {marketInsights.topAppreciating.yoy_change}% YOY growth.
                {marketInsights.allLandDeals.length > 0 && ` ${marketInsights.allLandDeals.length} land deals tracked in catchment.`}
                {marketInsights.allInfra.length > 0 && ` ${marketInsights.allInfra.length} infrastructure developments monitored.`}
              </p>
              <p className="text-[10px] text-muted-foreground mt-3">
                Sources: K-RERA, MahaRERA, Sub-Registrar filings, 99acres, MagicBricks, Builder websites ·
                Report by <strong>Kabith Mani</strong>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-3xl bg-card shadow-card p-4">
      <div className={`${color} mb-1.5`}>{icon}</div>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-bold text-foreground truncate">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}
