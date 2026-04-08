import { TrendingUp, Zap, AlertTriangle, Loader2 } from "lucide-react";
import { executiveThemes, getMarketMetrics } from "@/data/intelligenceData";

interface Props {
  city: string;
  location?: string;
  dynamic?: {
    summary: string;
    themes: { theme: string; summary: string }[];
    takeaways: string[];
  };
  loading?: boolean;
}

export default function ExecutiveBrief({ city, location, dynamic, loading }: Props) {
  const staticThemes = executiveThemes.filter(t => t.city === city);
  const staticMetrics = getMarketMetrics(city);

  const isPreFed = ["Bangalore", "Pune", "Mumbai"].includes(city);
  const useDynamic = dynamic && !isPreFed;

  if (loading) return <LoadingState />;

  const themes = useDynamic ? dynamic.themes : staticThemes;
  const takeaways = useDynamic ? dynamic.takeaways : [];

  const summary = useDynamic
    ? dynamic.summary
    : city === "Bangalore"
    ? "The Bangalore residential market enters March 2026 in its strongest cycle since 2019. RERA registrations are up 23% YOY, luxury segment sales have surged 41%, and NRI pre-sales have crossed the 38-47% mark at premium launches. North Bangalore has emerged as the defining thesis of this cycle, with ₹580Cr+ deployed by top developers in just 15 days."
    : city === "Pune"
    ? "Pune's western IT corridor is reaching a pricing inflection point. Hinjewadi leads with a CMI of 8.7, while satellite markets Tathawade (+22%) and Wagholi (+24%) show breakout appreciation. Metro Phase 3 tunneling at 40% completion is the primary catalyst. RERA filings up 15% YOY signal sustained developer confidence."
    : city === "Mumbai"
    ? "Mumbai's dual-catalyst story — Coastal Road and NMIA — is creating two distinct investment corridors. BKC rents hit all-time highs, GIC's ₹4,200Cr acquisition validates ultra-premium, while Ulwe's 18% YOY appreciation leads the growth corridor. Institutional capital inflows are at record levels."
    : "";

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
      {location && (
        <div className="rounded-2xl bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">📍 Intelligence for: {location}</p>
        </div>
      )}

      <div className="rounded-3xl bg-card shadow-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Market Pulse Summary</h3>
            <p className="text-sm text-muted-foreground">Intelligence Engine · {useDynamic ? "AI-Generated" : "March 1-15, 2026"} · by Kabith Mani</p>
          </div>
        </div>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="text-foreground font-medium leading-relaxed">{summary}</p>
        </div>
        {!useDynamic && staticMetrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {staticMetrics.slice(0, 4).map(m => (
              <div key={m.metric} className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground font-medium">{m.metric}</p>
                <p className="text-sm font-bold text-foreground mt-1">{m.currentCycle}</p>
                <p className={`text-xs mt-1 font-semibold ${m.signal === "STRONG" ? "text-green-600" : m.signal === "RISING" ? "text-blue-600" : "text-amber-600"}`}>{m.change}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-card shadow-card p-6 md:p-8">
        <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" /> Key Themes This Cycle
        </h3>
        <p className="text-sm text-muted-foreground mb-6">Top intelligence signals identified by the Intelligence Engine</p>
        <div className="space-y-4">
          {themes.map((t, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <span className="shrink-0 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">{i + 1}</span>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{t.theme}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(takeaways.length > 0 || isPreFed) && (
        <div className="rounded-3xl border-2 border-accent/30 bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-foreground text-sm">Top Takeaways</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {useDynamic && takeaways.map((t, i) => (
                  <li key={i}>• <strong className="text-foreground">{t}</strong></li>
                ))}
                {!useDynamic && city === "Bangalore" && <>
                  <li>• <strong className="text-foreground">Entry window closing:</strong> North Bangalore pre-catalysed pricing has 12-18 months remaining</li>
                  <li>• <strong className="text-foreground">Luxury outperformance:</strong> ₹3Cr+ segment growing 4x faster than affordable</li>
                  <li>• <strong className="text-foreground">Watch signal:</strong> Hoskote shell entity aggregation matches pre-industrial corridor pattern</li>
                  <li>• <strong className="text-foreground">Commercial tightening:</strong> 4.1% vacancy in North BLR presages residential demand wave</li>
                </>}
                {!useDynamic && city === "Pune" && <>
                  <li>• <strong className="text-foreground">Metro catalyst:</strong> Phase 3 Hinjewadi line will add 15-25% premium to station-adjacent properties</li>
                  <li>• <strong className="text-foreground">Spillover play:</strong> Tathawade and Ravet offer entry at 30-35% discount to Baner</li>
                  <li>• <strong className="text-foreground">IT expansion:</strong> Hinjewadi Ph 4 approval signals 15,000+ new jobs and residential demand surge</li>
                </>}
                {!useDynamic && city === "Mumbai" && <>
                  <li>• <strong className="text-foreground">Dual play:</strong> Ultra-premium (Coastal Road) vs Growth (NMIA) — two distinct investment theses</li>
                  <li>• <strong className="text-foreground">Institutional validation:</strong> ₹4,200Cr GIC deal is India's largest single-asset commercial acquisition</li>
                  <li>• <strong className="text-foreground">NMIA timeline:</strong> Terminal 60% complete — Ulwe entry window narrowing fast</li>
                </>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Generating location-specific intelligence...</p>
      <p className="text-xs text-muted-foreground mt-1">Analyzing market data, infrastructure, and trends via AI</p>
    </div>
  );
}
