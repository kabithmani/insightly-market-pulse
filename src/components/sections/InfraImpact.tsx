import { Construction, ArrowRight, Loader2 } from "lucide-react";
import { infraProjects, infraCorrelations } from "@/data/intelligenceData";

interface Props {
  city: string;
  location?: string;
  dynamic?: {
    projects: { project: string; status: string; impact: string; priceLift: string; timeline: string; confidence: string }[];
    correlations: { project: string; corridors: string; lift: string; timeline: string; confidence: string }[];
  };
  loading?: boolean;
}

const CONF_COLORS: Record<string, string> = {
  HIGH: "bg-green-100 text-green-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-red-100 text-red-700",
};

export default function InfraImpact({ city, location, dynamic, loading }: Props) {
  if (loading) return <LoadingState />;

  const isPreFed = ["Bangalore", "Pune", "Mumbai"].includes(city);
  const useDynamic = dynamic && !isPreFed;

  const projects = useDynamic
    ? dynamic.projects.map(p => ({ ...p, expectedPriceLift: p.priceLift, impactAssessment: p.impact }))
    : infraProjects.filter(p => p.city === city);

  const correlations = useDynamic
    ? dynamic.correlations.map(c => ({ ...c, impactedCorridors: c.corridors, expectedLift: c.lift }))
    : infraCorrelations.filter(c => c.city === city);

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {location && (
        <div className="rounded-2xl bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">📍 Infrastructure Impact: {location}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p: any, i: number) => (
          <div key={i} className="rounded-3xl bg-card shadow-card p-6">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-foreground text-sm">{p.project}</h4>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${CONF_COLORS[p.confidence?.toUpperCase?.()] || CONF_COLORS[p.confidence] || "bg-muted text-muted-foreground"}`}>
                {p.confidence}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{p.status}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground">{p.impactAssessment || p.impact}</span>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="rounded-xl bg-green-50 px-3 py-1.5">
                  <p className="text-xs text-green-700 font-bold">{p.expectedPriceLift || p.priceLift}</p>
                  <p className="text-[10px] text-green-600">Price Lift</p>
                </div>
                <div className="rounded-xl bg-blue-50 px-3 py-1.5">
                  <p className="text-xs text-blue-700 font-bold">{p.timeline}</p>
                  <p className="text-[10px] text-blue-600">Timeline</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-card shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Construction className="h-5 w-5 text-primary" /> Infrastructure × Price Correlation Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground">Project</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Impacted Corridors</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Expected Lift</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Timeline</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {correlations.map((c: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{c.project}</td>
                  <td className="p-3 text-muted-foreground text-xs">{c.impactedCorridors || c.corridors}</td>
                  <td className="p-3 text-right text-green-600 font-bold">{c.expectedLift || c.lift}</td>
                  <td className="p-3 text-right text-foreground">{c.timeline}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${CONF_COLORS[(c.confidence || "").toUpperCase()] || "bg-muted text-muted-foreground"}`}>
                      {c.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Analyzing infrastructure impact...</p>
    </div>
  );
}
