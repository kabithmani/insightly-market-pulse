import { useState } from "react";
import { Compass, Loader2 } from "lucide-react";
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
import { SearchContext } from "@/hooks/useSearchContext";
import { DynamicIntelligence, generateDynamicIntelligence } from "@/utils/dynamicIntelligence";

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
  const [searchContext, setSearchContext] = useState<SearchContext>({
    location: "",
    city: "",
    lat: 0,
    lng: 0,
    radius: 25,
    searched: false,
  });
  const [intelligence, setIntelligence] = useState<DynamicIntelligence | null>(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const handleSearchComplete = async (ctx: SearchContext) => {
    setSearchContext(ctx);
    // Start generating intelligence in background
    setIntelLoading(true);
    const intel = await generateDynamicIntelligence(
      ctx.location, ctx.city, ctx.lat, ctx.lng, ctx.radius
    );
    setIntelligence(intel);
    setIntelLoading(false);
  };

  const locationLabel = searchContext.searched
    ? searchContext.location.split(",").slice(0, 2).join(",")
    : "Search a location first";

  const isPreFedCity = ["Bangalore", "Pune", "Mumbai"].includes(searchContext.city);

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
          {searchContext.searched && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary/10">
              <span className="text-xs font-semibold text-primary truncate max-w-[200px]">
                📍 {locationLabel}
              </span>
              <span className="text-[10px] text-muted-foreground">{searchContext.radius} km</span>
              {intelLoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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

          <TabsContent value="search">
            <PropertyDiscovery onSearchComplete={handleSearchComplete} />
          </TabsContent>

          {/* Intelligence tabs — use dynamic data when available, fallback to static for pre-fed cities */}
          <TabsContent value="executive">
            {!searchContext.searched ? (
              <NoSearchPrompt />
            ) : (
              <ExecutiveBrief
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.executiveBrief}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="residential">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <ResidentialMarket
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.residential}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="heatmap">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <PricingHeatmap
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.pricing}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="land">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <LandIntelligence
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.landIntel}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="developers">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <DeveloperTracker
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.developers}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="infra">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <InfraImpact
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.infrastructure}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="commercial">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <CommercialWatch
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.commercial}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="investors">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <InvestorIntelligence
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.investors}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="national"><NationalCompass /></TabsContent>

          <TabsContent value="regulatory">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <RegulatoryWatch
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.regulatory}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="emerging">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <EmergingCorridors
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.emerging}
                loading={intelLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="deepdive">
            {!searchContext.searched ? <NoSearchPrompt /> : (
              <DeepDiveSection
                city={searchContext.city}
                location={searchContext.location}
                dynamic={intelligence?.deepDive}
                loading={intelLoading}
              />
            )}
          </TabsContent>
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
              Pan-India coverage · Real-time location discovery powered by OpenStreetMap + AI Intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function NoSearchPrompt() {
  return (
    <div className="rounded-3xl bg-card shadow-card p-12 text-center animate-[fade-in_0.3s_ease-out]">
      <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Compass className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Search a Location First</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Go to the <strong>Property Search</strong> tab, enter a location and radius to generate location-specific intelligence across all tabs.
      </p>
    </div>
  );
}

export default Index;
