import { useState } from "react";
import { Search, MapPin, Loader2, Navigation, SlidersHorizontal, Building2, Home, LandPlot, Store, TrendingUp, BarChart3, Info, GraduationCap, Stethoscope, Train, TreePine, ShoppingBag, Globe, Clock, ExternalLink, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { geocodeLocation, haversineDistance } from "@/utils/geo";
import { getPropertiesInRadius, computeMarketInsights, Property, PropertyType } from "@/data/propertyData";
import { microMarkets } from "@/data/microMarkets";
import { discoverLocation, generateLocationIntelligence, OSMDiscoveryResult } from "@/utils/osmDiscovery";
import { scrapeProperties, ScrapedProperty, ScrapeResult } from "@/utils/scrapeService";
import PropertyIntelligence from "@/components/PropertyIntelligence";
import LocationMap from "@/components/LocationMap";
import CoverageRequestForm from "@/components/CoverageRequestForm";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const TYPE_ICONS: Record<PropertyType, typeof Building2> = {
  Apartment: Building2, Villa: Home, Plot: LandPlot, Commercial: Store,
};
const TYPE_COLORS: Record<PropertyType, string> = {
  Apartment: "bg-primary/10 text-primary", Villa: "bg-green-100 text-green-700",
  Plot: "bg-amber-100 text-amber-700", Commercial: "bg-purple-100 text-purple-700",
};
const STATUS_COLORS: Record<string, string> = {
  "Ready to Move": "bg-green-100 text-green-700", "Under Construction": "bg-blue-100 text-blue-700",
  "Pre-Launch": "bg-purple-100 text-purple-700", "Nearing Possession": "bg-amber-100 text-amber-700",
};

export default function PropertyDiscovery() {
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
  const [osmResult, setOsmResult] = useState<OSMDiscoveryResult | null>(null);
  const [hasVerifiedData, setHasVerifiedData] = useState(false);
  const [detectedCity, setDetectedCity] = useState("");
  const [scrapedData, setScrapedData] = useState<ScrapeResult | null>(null);
  const [scrapeLoading, setScrapeLoading] = useState(false);

  const performSearch = async (lat: number, lng: number, displayName: string) => {
    setGeocodedName(displayName);
    setGeoCoords({ lat, lng });

    // Detect city from display name
    const cityMatch = ["Bangalore", "Bengaluru", "Pune", "Mumbai"].find(c =>
      displayName.toLowerCase().includes(c.toLowerCase())
    );
    const city = cityMatch === "Bengaluru" ? "Bangalore" : cityMatch || "";
    setDetectedCity(city);

    // 1. Check verified property database
    const found = getPropertiesInRadius(lat, lng, radius, city || undefined);
    setProperties(found.length > 0 ? found : null);
    setHasVerifiedData(found.length > 0);

    // 2. Discover real places via OSM Overpass API
    const osm = await discoverLocation(lat, lng, radius);
    setOsmResult(osm);

    // 3. Find nearest benchmark micro-markets
    if (found.length === 0 && osm.totalPOIs === 0) {
      setError(`No properties or places found within ${radius} km. Try increasing the radius or a different location.`);
    }

    setLoading(false);
  };

  const handleSearch = async () => {
    if (!location.trim()) { setError("Please enter a location"); return; }
    setError(""); setLoading(true); setProperties(null); setSelectedProperty(null); setOsmResult(null);

    const geo = await geocodeLocation(`${location}, India`);
    if (!geo) { setError("Could not find that location. Try a more specific address."); setLoading(false); return; }

    await performSearch(geo.lat, geo.lng, geo.displayName);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    setLoading(true); setProperties(null); setOsmResult(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse geocode to get display name
        const geo = await geocodeLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        const display = geo?.displayName || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setLocation(display.split(",")[0]);
        await performSearch(latitude, longitude, display);
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
  const osmInsights = osmResult ? generateLocationIntelligence(osmResult) : [];

  // Nearest benchmarks (for areas without verified data)
  const nearestBenchmarks = geoCoords
    ? microMarkets
        .map(m => ({ ...m, dist: haversineDistance(geoCoords.lat, geoCoords.lng, m.lat, m.lng) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5)
    : [];

  const typeDistribution = insights ? Object.entries(insights.types).filter(([, v]) => v > 0).map(([k, v]) => ({ name: k, value: v })) : [];
  const COLORS = ["hsl(225, 73%, 57%)", "hsl(142, 71%, 45%)", "hsl(45, 93%, 47%)", "hsl(270, 60%, 55%)"];

  if (selectedProperty) {
    return (
      <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
        <Button variant="ghost" onClick={() => setSelectedProperty(null)} className="gap-2 text-muted-foreground hover:text-foreground">
          ← Back to Results
        </Button>
        <PropertyIntelligence property={selectedProperty} city={detectedCity} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Search Bar */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-1">Property Discovery</h3>
        <p className="text-sm text-muted-foreground mb-4">Search any location in India — discover real properties, infrastructure, and market intelligence</p>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter any address, landmark, city, or area in India..."
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
          Works anywhere: Delhi, Hyderabad, Chennai, Kolkata, Goa, Jaipur... or Hebbal, Koregaon Park, Bandra
        </p>

        {/* Radius Slider */}
        <div className="mt-4 flex items-center gap-4">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <Slider value={[radius]} onValueChange={([v]) => setRadius(v)} min={5} max={100} step={5} className="w-full" />
          </div>
          <span className="text-sm font-semibold text-foreground w-16 text-right">{radius} km</span>
        </div>

        {error && <p className="mt-3 text-sm text-destructive flex items-center gap-2"><Info className="h-4 w-4" /> {error}</p>}

        <Button onClick={handleSearch} disabled={loading} className="mt-4 h-11 px-8 rounded-2xl gradient-primary text-primary-foreground shadow-button">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Discovering... (may take 10-15s)</> : <><Search className="mr-2 h-4 w-4" /> Discover Properties</>}
        </Button>
      </div>

      {/* Map + Results */}
      {geoCoords && (osmResult || properties) && (
        <>
          {/* Interactive Map */}
          <LocationMap
            center={geoCoords}
            radiusKm={radius}
            discovery={osmResult}
            verifiedProperties={properties?.map(p => ({ lat: p.lat, lng: p.lng, name: p.name }))}
          />

          {/* Discovery Stats */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {properties && <StatCard icon={<Building2 className="h-5 w-5" />} label="Verified Properties" value={properties.length.toString()} color="text-primary" />}
            {osmResult && (
              <>
                <StatCard icon={<Home className="h-5 w-5" />} label="Residential" value={osmResult.residentialBuildings.length.toString()} color="text-primary" />
                <StatCard icon={<Store className="h-5 w-5" />} label="Commercial" value={osmResult.commercialBuildings.length.toString()} color="text-accent" />
                <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Schools" value={osmResult.schools.length.toString()} color="text-amber-600" />
                <StatCard icon={<Stethoscope className="h-5 w-5" />} label="Hospitals" value={osmResult.hospitals.length.toString()} color="text-destructive" />
                <StatCard icon={<Train className="h-5 w-5" />} label="Transit" value={osmResult.transit.length.toString()} color="text-cyan-600" />
                <StatCard icon={<TreePine className="h-5 w-5" />} label="Parks" value={osmResult.parks.length.toString()} color="text-green-600" />
              </>
            )}
          </div>

          {/* OSM Intelligence Insights */}
          {osmInsights.length > 0 && (
            <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6">
              <h4 className="font-bold text-foreground text-sm mb-3">📊 Location Intelligence (Real-Time Discovery)</h4>
              <div className="space-y-2">
                {osmInsights.map((insight, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">• {insight}</p>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Data source: <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenStreetMap</a> (real-time) · 
                Analysis by <strong>Kabith Mani</strong>
              </p>
            </div>
          )}

          {/* Verified Properties Section */}
          {properties && insights && (
            <>
              <div className="rounded-3xl bg-green-50 border border-green-200 p-4">
                <h4 className="text-sm font-bold text-green-800 flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Verified Property Database — {detectedCity || "India"}
                </h4>
                <p className="text-xs text-green-700 mt-1">{properties.length} verified listings with pricing, RERA IDs, and intelligence data</p>
              </div>

              {/* Quick Stats */}
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
                <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Avg PSF" value={`₹${insights.avgPsf.toLocaleString("en-IN")}`} color="text-accent" />
                <StatCard icon={<Home className="h-5 w-5" />} label="Available Units" value={insights.totalUnits.toLocaleString("en-IN")} color="text-primary" />
                <StatCard icon={<BarChart3 className="h-5 w-5" />} label="Avg Yield" value={`${insights.avgYield}%`} color="text-green-600" />
                <StatCard icon={<Store className="h-5 w-5" />} label="Builders" value={insights.builders.length.toString()} color="text-accent" />
                <StatCard icon={<Building2 className="h-5 w-5" />} label="Total Properties" value={insights.totalProperties.toString()} color="text-primary" />
              </div>

              {/* Type Distribution Chart */}
              {typeDistribution.length > 0 && (
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
              )}

              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-muted-foreground mr-2">Filter:</span>
                {(["All", "Apartment", "Villa", "Plot", "Commercial"] as const).map(t => (
                  <Button key={t} variant={filterType === t ? "default" : "outline"} size="sm" onClick={() => setFilterType(t)} className="h-8 rounded-xl text-xs">{t}</Button>
                ))}
                <span className="ml-auto text-xs font-semibold text-muted-foreground mr-2">Sort:</span>
                {([["price", "Price"], ["yield", "Yield"], ["units", "Availability"]] as const).map(([k, l]) => (
                  <Button key={k} variant={sortBy === k ? "default" : "outline"} size="sm" onClick={() => setSortBy(k as typeof sortBy)} className="h-8 rounded-xl text-xs">{l}</Button>
                ))}
              </div>

              {/* Property Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map(p => {
                  const Icon = TYPE_ICONS[p.type];
                  return (
                    <div key={p.id} onClick={() => setSelectedProperty(p)} className="rounded-3xl bg-card shadow-card p-5 hover:shadow-card-hover transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${TYPE_COLORS[p.type]}`}><Icon className="h-3 w-3" /> {p.type}</span>
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${STATUS_COLORS[p.status]}`}>{p.status}</span>
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
                          <p className="text-xs font-bold text-foreground">{p.unitSizesMin} – {p.unitSizesMax} sft</p>
                        </div>
                      </div>
                      {p.rentalYield > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-semibold text-green-600">{p.rentalYield}% rental yield</span>
                        </div>
                      )}
                      <p className="text-[10px] text-primary font-medium mt-3 group-hover:underline">View Intelligence →</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Nearest Benchmarks (when no verified data) */}
          {!hasVerifiedData && nearestBenchmarks.length > 0 && (
            <div className="rounded-3xl bg-card shadow-card p-6">
              <h4 className="text-sm font-bold text-foreground mb-1">📍 Nearest Known Markets (Benchmarks)</h4>
              <p className="text-xs text-muted-foreground mb-4">No verified property data for this exact area. Here are the closest markets with known pricing:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Market</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">City</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Distance</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Avg PSF</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">YOY Growth</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">CMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nearestBenchmarks.map((m, i) => (
                      <tr key={m.name} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="p-3 font-medium text-foreground">{m.name}</td>
                        <td className="p-3 text-muted-foreground">{m.city}</td>
                        <td className="p-3 text-right text-muted-foreground">{Math.round(m.dist)} km</td>
                        <td className="p-3 text-right text-foreground">₹{m.avg_psf.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-right"><span className={m.yoy_change >= 15 ? "text-green-600 font-semibold" : "text-foreground"}>{m.yoy_change}%</span></td>
                        <td className="p-3 text-right"><span className={m.cmi >= 8.0 ? "text-primary font-semibold" : "text-foreground"}>{m.cmi}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Sources: <a href="https://rera.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">K-RERA</a>, 
                <a href="https://maharera.mahaonline.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">MahaRERA</a>, 
                <a href="https://www.99acres.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">99acres</a>, 
                <a href="https://www.magicbricks.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">MagicBricks</a>
              </p>
            </div>
          )}

          {/* Coverage Request (when no verified data) */}
          {!hasVerifiedData && geoCoords && (
            <CoverageRequestForm location={geocodedName} lat={geoCoords.lat} lng={geoCoords.lng} />
          )}

          {/* OSM Detailed Discoveries */}
          {osmResult && osmResult.totalPOIs > 0 && (
            <div className="rounded-3xl bg-card shadow-card p-6">
              <h4 className="text-sm font-bold text-foreground mb-4">🏘️ Discovered Places (OpenStreetMap)</h4>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <PlaceList icon={<Home className="h-4 w-4 text-primary" />} title="Residential" places={osmResult.residentialBuildings} />
                <PlaceList icon={<Store className="h-4 w-4 text-accent" />} title="Commercial" places={osmResult.commercialBuildings} />
                <PlaceList icon={<GraduationCap className="h-4 w-4 text-amber-600" />} title="Schools & Colleges" places={osmResult.schools} />
                <PlaceList icon={<Stethoscope className="h-4 w-4 text-destructive" />} title="Hospitals" places={osmResult.hospitals} />
                <PlaceList icon={<Train className="h-4 w-4 text-cyan-600" />} title="Transit" places={osmResult.transit} />
                <PlaceList icon={<ShoppingBag className="h-4 w-4 text-green-600" />} title="Retail & Malls" places={osmResult.retail} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-4">
                Data: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">© OpenStreetMap contributors</a> · 
                Powered by <a href="https://overpass-api.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Overpass API</a>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-3xl bg-card shadow-card p-4">
      <div className={`${color} mb-1.5`}>{icon}</div>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-bold text-foreground truncate">{value}</p>
    </div>
  );
}

function PlaceList({ icon, title, places }: { icon: React.ReactNode; title: string; places: { name: string; distance: number; subtype: string }[] }) {
  if (places.length === 0) return null;
  return (
    <div>
      <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2">{icon} {title} ({places.length})</h5>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {places.slice(0, 10).map((p, i) => (
          <div key={i} className="flex justify-between items-center text-xs py-1 px-2 rounded-lg hover:bg-muted/50">
            <span className="text-foreground truncate flex-1">{p.name || "Unnamed"}</span>
            <span className="text-muted-foreground ml-2 shrink-0">{p.distance} km</span>
          </div>
        ))}
        {places.length > 10 && <p className="text-[10px] text-muted-foreground px-2">+{places.length - 10} more</p>}
      </div>
    </div>
  );
}
