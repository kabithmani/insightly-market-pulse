import { Building2 } from "lucide-react";
import ReportForm from "@/components/ReportForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl gradient-primary flex items-center justify-center shadow-button">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              FinCity Real Estate Intelligence
            </h1>
            <p className="text-xs text-muted-foreground">
              Live market insights for Bangalore, Pune, Mumbai
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <ReportForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FinCity Real Estate Intelligence — WAT Framework
        </p>
      </footer>
    </div>
  );
};

export default Index;
