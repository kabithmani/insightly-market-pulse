import { Construction, ArrowRight } from "lucide-react";
import { infraProjects, infraCorrelations } from "@/data/intelligenceData";

interface Props { city: string; }

const CONF_COLORS: Record<string, string> = {
  HIGH: "bg-green-100 text-green-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-red-100 text-red-700",
};

export default function InfraImpact({ city }: Props) {
  const projects = infraProjects.filter(p => p.city === city);
  const correlations = infraCorrelations.filter(c => c.city === city);

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Project Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p, i) => (
          <div key={i} className="rounded-3xl bg-card shadow-card p-6">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-foreground text-sm">{p.project}</h4>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${CONF_COLORS[p.confidence]}`}>
                {p.confidence}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{p.status}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground">{p.impactAssessment}</span>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="rounded-xl bg-green-50 px-3 py-1.5">
                  <p className="text-xs text-green-700 font-bold">{p.expectedPriceLift}</p>
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

      {/* Correlation Matrix */}
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
              {correlations.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="p-3 font-semibold text-foreground">{c.project}</td>
                  <td className="p-3 text-muted-foreground text-xs">{c.impactedCorridors}</td>
                  <td className="p-3 text-right text-green-600 font-bold">{c.expectedLift}</td>
                  <td className="p-3 text-right text-foreground">{c.timeline}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${CONF_COLORS[c.confidence.toUpperCase() as keyof typeof CONF_COLORS]}`}>
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
