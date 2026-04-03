import { useState } from "react";
import { Search, MapPin, Loader2, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { microMarkets } from "@/data/microMarkets";
import { geocodeLocation, filterMarketsByRadius, generateInsights, MarketWithDistance } from "@/utils/geo";
import { generatePDFReport } from "@/utils/pdfReport";
import MarketResults from "@/components/MarketResults";

interface Props { city: string; }

export default function MicroMarketSearch({ city }: Props) {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(25);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MarketWithDistance[] | null>(null);
  const [error, setError] = useState("");
  const [geocodedName, setGeocodedName] = useState("");

  const handleGenerate = async () => {
    if (!location.trim()) { setError("Please enter a location"); return; }
    if (radius < 5 || radius > 100) { setError("Radius must be between 5 and 100 km"); return; }
    setError(""); setLoading(true); setResults(null);

    const geo = await geocodeLocation(`${location}, ${city}, India`);
    if (!geo) { setError("Could not find that location. Try a more specific address."); setLoading(false); return; }

    setGeocodedName(geo.displayName);
    const filtered = filterMarketsByRadius(microMarkets, geo.lat, geo.lng, radius, city);
    if (filtered.length === 0) { setError(`No micro-markets found within ${radius} km. Try increasing the radius.`); setLoading(false); return; }

    setResults(filtered); setLoading(false);
  };

  const insights = results ? generateInsights(results) : null;

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Search */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Location-Based Market Search</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter an address, landmark, or area..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); setError(""); }}
                className="pl-10 h-12 rounded-2xl border-border bg-muted/50 focus:bg-card"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Radius (km)</Label>
            <Input type="number" min={5} max={100} value={radius} onChange={(e) => setRadius(parseInt(e.target.value) || 25)} className="h-12 rounded-2xl border-border bg-muted/50" />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</p>}
        <div className="mt-4 flex gap-3">
          <Button onClick={handleGenerate} disabled={loading} className="h-11 px-6 rounded-2xl gradient-primary text-primary-foreground shadow-button">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Search className="mr-2 h-4 w-4" /> Search Markets</>}
          </Button>
          {results && results.length > 0 && (
            <Button onClick={() => generatePDFReport(results, geocodedName || location, city, radius)} variant="outline" className="h-11 px-6 rounded-2xl">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          )}
        </div>
      </div>

      {results && insights && (
        <MarketResults markets={results} insights={insights} location={geocodedName} city={city} radius={radius} />
      )}
    </div>
  );
}
