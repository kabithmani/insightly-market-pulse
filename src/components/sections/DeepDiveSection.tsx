import { BookOpen } from "lucide-react";
import { deepDives } from "@/data/intelligenceData";

interface Props { city: string; }

export default function DeepDiveSection({ city }: Props) {
  const dive = deepDives.find(d => d.city === city);
  if (!dive) return null;

  const overallScore = (dive.scores.reduce((s, c) => s + c.score, 0) / dive.scores.length).toFixed(1);

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {/* Article */}
      <div className="rounded-3xl bg-card shadow-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl gradient-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{dive.title}</h3>
            <p className="text-sm text-muted-foreground">{dive.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          {dive.content.map((p, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {p.split("–").map((part, j) => j === 0 && i > 0 ? <><strong className="text-foreground">{part}</strong>{p.includes("–") ? "–" : ""}</> : part)}
            </p>
          ))}
        </div>
      </div>

      {/* FinCity Summary Score */}
      <div className="rounded-3xl bg-card shadow-card p-6 md:p-8">
        <h3 className="text-lg font-bold text-foreground mb-6">Intelligence Summary Score</h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
          {dive.scores.map(s => (
            <div key={s.category} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke={s.score >= 9 ? "hsl(142, 71%, 45%)" : s.score >= 8 ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${(s.score / 10) * 213.6} 213.6`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                  {s.score}
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground">{s.category}</p>
            </div>
          ))}
        </div>

        {/* Overall */}
        <div className="rounded-2xl gradient-primary p-6 text-center">
          <p className="text-primary-foreground/80 text-xs font-medium uppercase tracking-wider">Overall CMI Score</p>
          <p className="text-4xl font-black text-primary-foreground mt-1">{overallScore}</p>
          <p className="text-primary-foreground/80 text-xs mt-1">out of 10</p>
        </div>
      </div>

      {/* Verdict */}
      <div className="rounded-3xl bg-accent/5 border-2 border-accent/30 p-6">
        <h4 className="font-bold text-foreground text-sm mb-2">⚖️ Verdict</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{dive.verdict}</p>
      </div>
    </div>
  );
}
