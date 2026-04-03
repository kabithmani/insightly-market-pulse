import { Compass } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
                by Kabith Mani · Pan-India Coverage · Live Data
              </p>
            </div>
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

          <TabsContent value="search"><PropertyDiscovery /></TabsContent>
          <TabsContent value="executive"><ExecutiveBrief city="Bangalore" /></TabsContent>
          <TabsContent value="residential"><ResidentialMarket city="Bangalore" /></TabsContent>
          <TabsContent value="heatmap"><PricingHeatmap city="Bangalore" /></TabsContent>
          <TabsContent value="land"><LandIntelligence city="Bangalore" /></TabsContent>
          <TabsContent value="developers"><DeveloperTracker city="Bangalore" /></TabsContent>
          <TabsContent value="infra"><InfraImpact city="Bangalore" /></TabsContent>
          <TabsContent value="commercial"><CommercialWatch city="Bangalore" /></TabsContent>
          <TabsContent value="investors"><InvestorIntelligence city="Bangalore" /></TabsContent>
          <TabsContent value="national"><NationalCompass /></TabsContent>
          <TabsContent value="regulatory"><RegulatoryWatch city="Bangalore" /></TabsContent>
          <TabsContent value="emerging"><EmergingCorridors city="Bangalore" /></TabsContent>
          <TabsContent value="deepdive"><DeepDiveSection city="Bangalore" /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Real Estate Intelligence by Kabith Mani — WAT Framework · Data: K-RERA, MahaRERA, OpenStreetMap, Property Portals
            </p>
            <p className="text-xs text-muted-foreground">
              Pan-India coverage · Real-time location discovery powered by OpenStreetMap
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
