import { useState } from "react";
import { Building2, Compass } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExecutiveBrief from "@/components/sections/ExecutiveBrief";
import ResidentialMarket from "@/components/sections/ResidentialMarket";
import PricingHeatmap from "@/components/sections/PricingHeatmap";
import LandIntelligence from "@/components/sections/LandIntelligence";
import DeveloperTracker from "@/components/sections/DeveloperTracker";
import InfraImpact from "@/components/sections/InfraImpact";
import CommercialWatch from "@/components/sections/CommercialWatch";
import InvestorIntelligence from "@/components/sections/InvestorIntelligence";
import NationalCompass from "@/components/sections/NationalCompass";
import RegulatoryWatch from "@/components/sections/RegulatoryWatch";
import EmergingCorridors from "@/components/sections/EmergingCorridors";
import DeepDiveSection from "@/components/sections/DeepDiveSection";
import PropertyDiscovery from "@/components/sections/PropertyDiscovery";

const cities = ["Bangalore", "Pune", "Mumbai"];

const sections = [
  { id: "🏠", label: "Property Search", value: "search" },
  { id: "01", label: "Executive Brief", value: "executive" },
  { id: "02", label: "Residential", value: "residential" },
  { id: "03", label: "Pricing Heatmap", value: "heatmap" },
  { id: "04", label: "Land Intel", value: "land" },
  { id: "05", label: "Developers", value: "developers" },
  { id: "06", label: "Infrastructure", value: "infra" },
  { id: "07", label: "Commercial", value: "commercial" },
  { id: "08", label: "Investors", value: "investors" },
  { id: "09", label: "National", value: "national" },
  { id: "10", label: "Regulatory", value: "regulatory" },
  { id: "11", label: "Emerging", value: "emerging" },
  { id: "12", label: "Deep Dive", value: "deepdive" },
];

const Index = () => {
  const [city, setCity] = useState("Bangalore");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl gradient-primary flex items-center justify-center shadow-button">
              <Compass className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Real Estate Intelligence
              </h1>
              <p className="text-xs text-muted-foreground">
                by Kabith Mani · Issue #4 · March 1–15, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-[140px] h-10 rounded-2xl border-border bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="search" className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <TabsList className="inline-flex h-auto p-1.5 bg-muted rounded-2xl gap-1 w-max">
              {sections.map(s => (
                <TabsTrigger
                  key={s.value}
                  value={s.value}
                  className="rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <span className="text-[10px] font-bold text-muted-foreground mr-1">{s.id}</span>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="search"><PropertyDiscovery city={city} /></TabsContent>
          <TabsContent value="executive"><ExecutiveBrief city={city} /></TabsContent>
          <TabsContent value="residential"><ResidentialMarket city={city} /></TabsContent>
          <TabsContent value="heatmap"><PricingHeatmap city={city} /></TabsContent>
          <TabsContent value="land"><LandIntelligence city={city} /></TabsContent>
          <TabsContent value="developers"><DeveloperTracker city={city} /></TabsContent>
          <TabsContent value="infra"><InfraImpact city={city} /></TabsContent>
          <TabsContent value="commercial"><CommercialWatch city={city} /></TabsContent>
          <TabsContent value="investors"><InvestorIntelligence city={city} /></TabsContent>
          <TabsContent value="national"><NationalCompass /></TabsContent>
          <TabsContent value="regulatory"><RegulatoryWatch city={city} /></TabsContent>
          <TabsContent value="emerging"><EmergingCorridors city={city} /></TabsContent>
          <TabsContent value="deepdive"><DeepDiveSection city={city} /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Real Estate Intelligence by Kabith Mani — WAT Framework · Data: K-RERA, MahaRERA, Dishaank, Sub-Registrar, Property Portals
            </p>
            <p className="text-xs text-muted-foreground">
              🔜 Next Issue #5: March 16–31, 2026 · Deep Dive: The Sarjapur Road Pricing Ceiling
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
