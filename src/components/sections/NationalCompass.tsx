import { Globe, MapPin } from "lucide-react";
import { karnatakaCities, nationalSnapshot } from "@/data/intelligenceData";

export default function NationalCompass() {
  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Karnataka */}
      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" /> Rest of Karnataka
          </h3>
          <p className="text-sm text-muted-foreground">Tier-2 cities showing emerging signals</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">City</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Segment</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Avg PSF (₹)</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">YOY</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Notable Signal</th>
              </tr>
            </thead>
            <tbody>
              {karnatakaCities.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{c.city}</td>
                  <td className="p-3 text-muted-foreground text-xs">{c.keyDevelopment.split(";")[0]}</td>
                  <td className="p-3 text-right text-foreground">{c.psfRange}</td>
                  <td className="p-3 text-right text-green-600 font-semibold">{c.yoy}</td>
                  <td className="p-3 text-muted-foreground text-xs max-w-[200px]">{c.keyDevelopment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* National */}
      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> 5-City National Snapshot
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">City</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Residential PSF Range</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">YOY</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Key Development</th>
              </tr>
            </thead>
            <tbody>
              {nationalSnapshot.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-bold text-foreground">{c.city}</td>
                  <td className="p-3 text-right text-foreground font-medium">{c.psfRange}</td>
                  <td className="p-3 text-right text-green-600 font-semibold">{c.yoy}</td>
                  <td className="p-3 text-muted-foreground text-xs max-w-xs">{c.keyDevelopment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
