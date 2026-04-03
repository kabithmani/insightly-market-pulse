import { useState } from "react";
import { Search, MapPin, Loader2, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { microMarkets } from "@/data/microMarkets";
import { geocodeLocation, filterMarketsByRadius, generateInsights, MarketWithDistance } from "@/utils/geo";
import { generatePDFReport } from "@/utils/pdfReport";
import MarketResults from "./MarketResults";

const cities = ["Bangalore", "Pune", "Mumbai"];

export default function ReportForm() {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(25);
  const [city, setCity] = useState("Bangalore");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MarketWithDistance[] | null>(null);
  const [error, setError] = useState("");
  const [radiusError, setRadiusError] = useState("");
  const [geocodedName, setGeocodedName] = useState("");

  const handleRadiusChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setRadius(0);
      setRadiusError("Enter a valid number");
      return;
    }
    setRadius(num);
    setRadiusError(num < 5 || num > 100 ? "Radius must be between 5 and 100 km" : "");
  };

  const handleGenerate = async () => {
    if (!location.trim()) {
      setError("Please enter a location");
      return;
    }
    if (radius < 5 || radius > 100) {
      setRadiusError("Radius must be between 5 and 100 km");
      return;
    }
    setError("");
    setLoading(true);
    setResults(null);

    const geo = await geocodeLocation(`${location}, ${city}, India`);
    if (!geo) {
      setError("Could not find that location. Try a more specific address.");
      setLoading(false);
      return;
    }

    setGeocodedName(geo.displayName);
    const filtered = filterMarketsByRadius(microMarkets, geo.lat, geo.lng, radius, city);
    if (filtered.length === 0) {
      setError(`No micro-markets found within ${radius} km. Try increasing the radius.`);
      setLoading(false);
      return;
    }

    setResults(filtered);
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    if (results && results.length > 0) {
      generatePDFReport(results, geocodedName || location, city, radius);
    }
  };

  const insights = results ? generateInsights(results) : null;

  return (
    <div className="space-y-8">
      {/* Input Card */}
      <div className="rounded-3xl bg-card p-6 md:p-8 shadow-card">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Location */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter an address, landmark, or area..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); setError(""); }}
                className="pl-10 h-12 rounded-2xl border-border bg-muted/50 focus:bg-card"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              e.g., Hebbal, Bangalore | Koregaon Park, Pune | Bandra West, Mumbai
            </p>
          </div>

          {/* Radius */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Radius (km)</Label>
            <Input
              type="number"
              min={5}
              max={100}
              value={radius}
              onChange={(e) => handleRadiusChange(e.target.value)}
              className="h-12 rounded-2xl border-border bg-muted/50 focus:bg-card"
            />
            {radiusError ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {radiusError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">(kilometers – choose 5 to 100 km)</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-12 rounded-2xl border-border bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="h-12 px-8 rounded-2xl gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Search className="mr-2 h-4 w-4" /> Generate Report</>
            )}
          </Button>

          {results && results.length > 0 && (
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="h-12 px-8 rounded-2xl"
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {results && insights && (
        <MarketResults
          markets={results}
          insights={insights}
          location={geocodedName}
          city={city}
          radius={radius}
        />
      )}
    </div>
  );
}
