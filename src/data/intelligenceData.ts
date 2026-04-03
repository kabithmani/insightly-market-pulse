// FinCity Real Estate Intelligence – Comprehensive Data Layer
// All data modeled after FinCity Magazine Issue #4, March 1-15, 2026

// ── Market Performance Metrics ──
export interface MarketMetric {
  metric: string;
  currentCycle: string;
  previousCycle: string;
  change: string;
  signal: "STRONG" | "RISING" | "HEALTHY" | "STEADY" | "WATCH" | "WEAK";
}

export const bangaloreMarketMetrics: MarketMetric[] = [
  { metric: "RERA Registrations", currentCycle: "5,842 units (Feb 2026)", previousCycle: "4,749 units (Feb 2025)", change: "+23% YOY", signal: "STRONG" },
  { metric: "New Project Launches (15D)", currentCycle: "14 projects", previousCycle: "9 projects", change: "+56% YOY", signal: "STRONG" },
  { metric: "Luxury Segment Units", currentCycle: "612 units", previousCycle: "434 units", change: "+41% YOY", signal: "STRONG" },
  { metric: "Avg Days-to-Sell (Premium)", currentCycle: "18 days", previousCycle: "31 days", change: "−42% (faster)", signal: "STRONG" },
  { metric: "NRI Pre-Sales Share", currentCycle: "38–47%", previousCycle: "21–28%", change: "+18pp YOY", signal: "RISING" },
  { metric: "Unsold Inventory (City)", currentCycle: "48,200 units", previousCycle: "52,400 units", change: "−8% YOY", signal: "HEALTHY" },
  { metric: "QTS (Quarters to Sell)", currentCycle: "6.2", previousCycle: "8.1", change: "Improving", signal: "HEALTHY" },
];

export const puneMarketMetrics: MarketMetric[] = [
  { metric: "RERA Registrations", currentCycle: "4,120 units (Feb 2026)", previousCycle: "3,580 units (Feb 2025)", change: "+15% YOY", signal: "RISING" },
  { metric: "New Project Launches (15D)", currentCycle: "11 projects", previousCycle: "8 projects", change: "+38% YOY", signal: "STRONG" },
  { metric: "Luxury Segment Units", currentCycle: "285 units", previousCycle: "198 units", change: "+44% YOY", signal: "STRONG" },
  { metric: "Avg Days-to-Sell (Premium)", currentCycle: "24 days", previousCycle: "38 days", change: "−37% (faster)", signal: "RISING" },
  { metric: "NRI Pre-Sales Share", currentCycle: "22–31%", previousCycle: "15–20%", change: "+10pp YOY", signal: "RISING" },
  { metric: "Unsold Inventory (City)", currentCycle: "32,800 units", previousCycle: "35,100 units", change: "−7% YOY", signal: "HEALTHY" },
  { metric: "QTS (Quarters to Sell)", currentCycle: "7.1", previousCycle: "8.8", change: "Improving", signal: "HEALTHY" },
];

export const mumbaiMarketMetrics: MarketMetric[] = [
  { metric: "RERA Registrations", currentCycle: "8,420 units (Feb 2026)", previousCycle: "7,210 units (Feb 2025)", change: "+17% YOY", signal: "STRONG" },
  { metric: "New Project Launches (15D)", currentCycle: "18 projects", previousCycle: "14 projects", change: "+29% YOY", signal: "STRONG" },
  { metric: "Luxury Segment Units", currentCycle: "890 units", previousCycle: "620 units", change: "+44% YOY", signal: "STRONG" },
  { metric: "Avg Days-to-Sell (Premium)", currentCycle: "22 days", previousCycle: "35 days", change: "−37% (faster)", signal: "STRONG" },
  { metric: "NRI Pre-Sales Share", currentCycle: "42–55%", previousCycle: "30–38%", change: "+16pp YOY", signal: "RISING" },
  { metric: "Unsold Inventory (City)", currentCycle: "1,12,400 units", previousCycle: "1,21,600 units", change: "−8% YOY", signal: "HEALTHY" },
  { metric: "QTS (Quarters to Sell)", currentCycle: "9.2", previousCycle: "11.4", change: "Improving", signal: "HEALTHY" },
];

// ── Segment Breakdown ──
export interface SegmentData {
  segment: string;
  unitsSold: number;
  share: string;
  yoyChange: string;
}

export const bangaloreSegments: SegmentData[] = [
  { segment: "Affordable (below ₹50L)", unitsSold: 812, share: "14%", yoyChange: "−9%" },
  { segment: "Mid (₹50L–₹80L)", unitsSold: 1428, share: "24%", yoyChange: "+4%" },
  { segment: "High-end (₹80L–₹1.5Cr)", unitsSold: 1986, share: "34%", yoyChange: "+18%" },
  { segment: "Premium (₹1.5Cr–₹3Cr)", unitsSold: 1004, share: "17%", yoyChange: "+29%" },
  { segment: "Luxury (₹3Cr+)", unitsSold: 612, share: "11%", yoyChange: "+41%" },
];

export const puneSegments: SegmentData[] = [
  { segment: "Affordable (below ₹40L)", unitsSold: 618, share: "15%", yoyChange: "−5%" },
  { segment: "Mid (₹40L–₹70L)", unitsSold: 1236, share: "30%", yoyChange: "+8%" },
  { segment: "High-end (₹70L–₹1.2Cr)", unitsSold: 1278, share: "31%", yoyChange: "+22%" },
  { segment: "Premium (₹1.2Cr–₹2.5Cr)", unitsSold: 658, share: "16%", yoyChange: "+35%" },
  { segment: "Luxury (₹2.5Cr+)", unitsSold: 330, share: "8%", yoyChange: "+48%" },
];

export const mumbaiSegments: SegmentData[] = [
  { segment: "Affordable (below ₹80L)", unitsSold: 1010, share: "12%", yoyChange: "−12%" },
  { segment: "Mid (₹80L–₹1.5Cr)", unitsSold: 1853, share: "22%", yoyChange: "+3%" },
  { segment: "High-end (₹1.5Cr–₹3Cr)", unitsSold: 2526, share: "30%", yoyChange: "+14%" },
  { segment: "Premium (₹3Cr–₹7Cr)", unitsSold: 1853, share: "22%", yoyChange: "+26%" },
  { segment: "Luxury (₹7Cr+)", unitsSold: 1178, share: "14%", yoyChange: "+38%" },
];

// ── Land Deals ──
export interface LandDeal {
  developer: string;
  location: string;
  sizeAcres: string;
  estValueCr: string;
  verified: string;
  status: "CONFIRMED" | "INFERRED" | "MONITORING" | "INTEL";
  city: string;
}

export const landDeals: LandDeal[] = [
  { developer: "Prestige Group", location: "Devanahalli (near BIAL T2)", sizeAcres: "42", estValueCr: "380", verified: "Dishaank ✓", status: "CONFIRMED", city: "Bangalore" },
  { developer: "Century Real Estate", location: "Yelahanka, North BLR", sizeAcres: "18", estValueCr: "165", verified: "Dishaank ✓", status: "CONFIRMED", city: "Bangalore" },
  { developer: "Shapoorji Pallonji", location: "Anekal, South BLR", sizeAcres: "28", estValueCr: "198", verified: "Bhoomi RTC ✓", status: "CONFIRMED", city: "Bangalore" },
  { developer: "Adarsh Group", location: "Nandi Hills Foothills", sizeAcres: "~22", estValueCr: "Undisclosed", verified: "Partial", status: "INFERRED", city: "Bangalore" },
  { developer: "Unknown (Shell entities)", location: "Hoskote–Malur Corridor", sizeAcres: "~60 (aggregated)", estValueCr: "Undisclosed", verified: "Pattern match", status: "MONITORING", city: "Bangalore" },
  { developer: "Godrej Properties", location: "North BLR (scouting)", sizeAcres: "Target 50+", estValueCr: "TBD", verified: "—", status: "INTEL", city: "Bangalore" },
  { developer: "Panchshil Realty", location: "Hinjewadi Phase 3", sizeAcres: "35", estValueCr: "280", verified: "IGR ✓", status: "CONFIRMED", city: "Pune" },
  { developer: "Godrej Properties", location: "Mahalunge-Balewadi", sizeAcres: "22", estValueCr: "195", verified: "IGR ✓", status: "CONFIRMED", city: "Pune" },
  { developer: "Shapoorji Pallonji", location: "Kharadi IT Corridor", sizeAcres: "18", estValueCr: "160", verified: "Partial", status: "INFERRED", city: "Pune" },
  { developer: "Macrotech (Lodha)", location: "Worli Sea-face", sizeAcres: "5.2", estValueCr: "2,800", verified: "BMC ✓", status: "CONFIRMED", city: "Mumbai" },
  { developer: "Oberoi Realty", location: "Goregaon-Mulund Link", sizeAcres: "28", estValueCr: "1,420", verified: "SRA ✓", status: "CONFIRMED", city: "Mumbai" },
  { developer: "CIDCO", location: "Ulwe Node 4", sizeAcres: "120", estValueCr: "3,200", verified: "CIDCO ✓", status: "CONFIRMED", city: "Mumbai" },
];

// ── Land Rate Trends ──
export interface LandRateTrend {
  corridor: string;
  rateQ1_2026: string;
  vsQ1_2025: string;
  vsQ1_2024: string;
  city: string;
}

export const landRateTrends: LandRateTrend[] = [
  { corridor: "Devanahalli (BIAL zone)", rateQ1_2026: "₹2,800–3,400/sq yd", vsQ1_2025: "+22%", vsQ1_2024: "+58%", city: "Bangalore" },
  { corridor: "Yelahanka / North BLR", rateQ1_2026: "₹3,200–4,100/sq yd", vsQ1_2025: "+18%", vsQ1_2024: "+44%", city: "Bangalore" },
  { corridor: "Sarjapur (premium zone)", rateQ1_2026: "₹4,800–6,200/sq yd", vsQ1_2025: "+25%", vsQ1_2024: "+62%", city: "Bangalore" },
  { corridor: "Kanakapura (metro zone)", rateQ1_2026: "₹3,600–4,800/sq yd", vsQ1_2025: "+34%", vsQ1_2024: "+71%", city: "Bangalore" },
  { corridor: "Hoskote–Malur", rateQ1_2026: "₹800–1,400/sq yd", vsQ1_2025: "+28%", vsQ1_2024: "+35%", city: "Bangalore" },
  { corridor: "Hinjewadi Phase 3", rateQ1_2026: "₹3,200–4,500/sq yd", vsQ1_2025: "+20%", vsQ1_2024: "+48%", city: "Pune" },
  { corridor: "Wagholi–Kharadi", rateQ1_2026: "₹2,400–3,200/sq yd", vsQ1_2025: "+24%", vsQ1_2024: "+52%", city: "Pune" },
  { corridor: "Balewadi–Baner", rateQ1_2026: "₹4,200–5,800/sq yd", vsQ1_2025: "+17%", vsQ1_2024: "+38%", city: "Pune" },
  { corridor: "Ulwe (Airport Zone)", rateQ1_2026: "₹4,500–6,800/sq yd", vsQ1_2025: "+28%", vsQ1_2024: "+65%", city: "Mumbai" },
  { corridor: "Thane–Kalyan", rateQ1_2026: "₹3,800–5,200/sq yd", vsQ1_2025: "+15%", vsQ1_2024: "+32%", city: "Mumbai" },
  { corridor: "Navi Mumbai (NMIA)", rateQ1_2026: "₹5,200–7,800/sq yd", vsQ1_2025: "+22%", vsQ1_2024: "+55%", city: "Mumbai" },
];

// ── Developer Strategy Tracker ──
export interface DeveloperTracker {
  developer: string;
  latestMove: string;
  activityScore: number;
  signal: "BULLISH" | "STRONG" | "MONITOR" | "WATCH" | "STEADY" | "INTEL";
  city: string;
}

export const developerTrackers: DeveloperTracker[] = [
  { developer: "Prestige Group", latestMove: "42-acre Devanahalli acquisition · ₹380Cr · BIAL township pipeline", activityScore: 92, signal: "BULLISH", city: "Bangalore" },
  { developer: "Brigade Group", latestMove: "Sarjapur mixed-use soft launch · 1,200 units · ₹9,200–10,500 psf · 47% NRI interest", activityScore: 88, signal: "BULLISH", city: "Bangalore" },
  { developer: "Sobha Limited", latestMove: "₹2,340Cr Q3 FY26 pre-sales (record) · Dream Acres sold out in 48h", activityScore: 95, signal: "STRONG", city: "Bangalore" },
  { developer: "Puravankara", latestMove: "Pravami AIF second close at $180M · targeting luxury in North BLR & Sarjapur", activityScore: 72, signal: "MONITOR", city: "Bangalore" },
  { developer: "Godrej Properties", latestMove: "Active scouting for 50+ acre North BLR plots · JDA structure preferred", activityScore: 58, signal: "WATCH", city: "Bangalore" },
  { developer: "Embassy (REIT)", latestMove: "2.4M sqft leasing pipeline · Whitefield Business District Phase 2 anchored by GCC", activityScore: 80, signal: "STRONG", city: "Bangalore" },
  { developer: "Salarpuria Sattva", latestMove: "Q3 commercial leasing +34% · 2.1M sqft active pipeline", activityScore: 76, signal: "STEADY", city: "Bangalore" },
  { developer: "Total Environment", latestMove: "JDA talks for 30+ acre Kanakapura parcel · sustainable luxury segment", activityScore: 48, signal: "INTEL", city: "Bangalore" },
  { developer: "Panchshil Realty", latestMove: "Hinjewadi Phase 3 acquisition · premium office+residential township", activityScore: 85, signal: "BULLISH", city: "Pune" },
  { developer: "Godrej Properties", latestMove: "Mahalunge land bank · 2,000+ unit residential mega-launch planned Q2", activityScore: 82, signal: "BULLISH", city: "Pune" },
  { developer: "Kolte-Patil", latestMove: "Wakad + Tathawade 3 project launches · mid-segment focus · ₹6,200-7,800 psf", activityScore: 78, signal: "STRONG", city: "Pune" },
  { developer: "VTP Realty", latestMove: "Balewadi premium launch · 800 units · 62% sold in launch week", activityScore: 74, signal: "STRONG", city: "Pune" },
  { developer: "Macrotech (Lodha)", latestMove: "Worli sea-face ultra-luxury · ₹85,000+ psf · NRI-focused", activityScore: 94, signal: "BULLISH", city: "Mumbai" },
  { developer: "Oberoi Realty", latestMove: "Goregaon-Mulund Link Road mega-township · 5,000+ units planned", activityScore: 88, signal: "BULLISH", city: "Mumbai" },
  { developer: "Godrej Properties", latestMove: "Vikhroli land monetisation · 3 new launches in pipeline", activityScore: 82, signal: "STRONG", city: "Mumbai" },
];

// ── Infrastructure Projects ──
export interface InfraProject {
  project: string;
  status: string;
  impactAssessment: string;
  expectedPriceLift: string;
  timeline: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  city: string;
}

export const infraProjects: InfraProject[] = [
  { project: "Metro Phase 3 – Yellow Line", status: "Alignment confirmed, tender awarded", impactAssessment: "20-35% appreciation for stations within 800m", expectedPriceLift: "+20-35%", timeline: "36 months", confidence: "HIGH", city: "Bangalore" },
  { project: "Peripheral Ring Road – Pkg 3", status: "Contractor mobilised (Hebbal-EC)", impactAssessment: "Commute 90→35 min; mid-corridor demand acceleration", expectedPriceLift: "+15-22%", timeline: "Q4 2027", confidence: "MEDIUM", city: "Bangalore" },
  { project: "BIAL Terminal 2", status: "Phase 2 operational mid-2027", impactAssessment: "Second appreciation wave for Devanahalli; hotel/residential outperformance", expectedPriceLift: "+25-40%", timeline: "24 months", confidence: "HIGH", city: "Bangalore" },
  { project: "Aerospace Industrial Corridor", status: "1,200 acres notified in Doddaballapur-Devanahalli", impactAssessment: "40-60% land appreciation 5km radius within 24 months", expectedPriceLift: "+40-60%", timeline: "48 months", confidence: "MEDIUM", city: "Bangalore" },
  { project: "Satellite Town Ring Road", status: "Phase 1 construction underway", impactAssessment: "Unlocks peripheral land parcels; new township corridors", expectedPriceLift: "+30-50%", timeline: "42 months", confidence: "MEDIUM", city: "Bangalore" },
  { project: "Metro Phase 3 – Hinjewadi", status: "Tunneling 40% complete", impactAssessment: "IT corridor connectivity; 15-25% premium for transit-oriented projects", expectedPriceLift: "+15-25%", timeline: "30 months", confidence: "HIGH", city: "Pune" },
  { project: "Ring Road Widening (NH-48)", status: "Land acquisition 70% done", impactAssessment: "Reduces Hinjewadi–CBD commute; demand shift to Balewadi-Mahalunge", expectedPriceLift: "+12-18%", timeline: "24 months", confidence: "MEDIUM", city: "Pune" },
  { project: "Pune IT City (Hinjewadi Ph 4)", status: "Master plan approved", impactAssessment: "15,000 new jobs; residential demand surge in catchment", expectedPriceLift: "+20-30%", timeline: "48 months", confidence: "MEDIUM", city: "Pune" },
  { project: "Coastal Road (Phase 2)", status: "South Mumbai section open", impactAssessment: "BKC–Bandra travel 45→8 min; premium corridor formation", expectedPriceLift: "+15-25%", timeline: "18 months", confidence: "HIGH", city: "Mumbai" },
  { project: "Navi Mumbai International Airport", status: "Terminal structure 60% complete", impactAssessment: "Ulwe, Panvel, Kharghar to see 40-60% appreciation", expectedPriceLift: "+40-60%", timeline: "24 months", confidence: "HIGH", city: "Mumbai" },
  { project: "Metro Line 4 (Thane-Wadala)", status: "Tunneling underway", impactAssessment: "Eastern corridor connectivity; Thane premium expansion", expectedPriceLift: "+18-28%", timeline: "36 months", confidence: "MEDIUM", city: "Mumbai" },
];

// ── Infra × Price Correlation Matrix ──
export interface InfraCorrelation {
  project: string;
  impactedCorridors: string;
  expectedLift: string;
  timeline: string;
  confidence: string;
  city: string;
}

export const infraCorrelations: InfraCorrelation[] = [
  { project: "Metro Yellow Line", impactedCorridors: "Kanakapura, Bannerghatta, JP Nagar", expectedLift: "+20-35%", timeline: "36m", confidence: "High", city: "Bangalore" },
  { project: "BIAL Terminal 2", impactedCorridors: "Devanahalli, Hebbal, Yelahanka", expectedLift: "+25-40%", timeline: "24m", confidence: "High", city: "Bangalore" },
  { project: "Peripheral Ring Road", impactedCorridors: "Sarjapur, Hosur Road, Anekal", expectedLift: "+15-22%", timeline: "36m", confidence: "Medium", city: "Bangalore" },
  { project: "Aerospace Corridor", impactedCorridors: "Doddaballapur, Devanahalli", expectedLift: "+40-60%", timeline: "48m", confidence: "Medium", city: "Bangalore" },
  { project: "Metro Line 3", impactedCorridors: "Hinjewadi, Wakad, Balewadi", expectedLift: "+15-25%", timeline: "30m", confidence: "High", city: "Pune" },
  { project: "Coastal Road", impactedCorridors: "Bandra, Worli, Lower Parel", expectedLift: "+15-25%", timeline: "18m", confidence: "High", city: "Mumbai" },
  { project: "NMIA", impactedCorridors: "Ulwe, Panvel, Kharghar", expectedLift: "+40-60%", timeline: "24m", confidence: "High", city: "Mumbai" },
];

// ── Commercial Real Estate ──
export interface CommercialMarket {
  subMarket: string;
  avgRentPsfMo: string;
  vacancy: string;
  yoyAbsorption: string;
  signal: "STRONG" | "RISING" | "STEADY" | "BREAKOUT" | "WATCH";
  city: string;
}

export const commercialMarkets: CommercialMarket[] = [
  { subMarket: "Outer Ring Road", avgRentPsfMo: "₹108", vacancy: "8.2%", yoyAbsorption: "+34%", signal: "STRONG", city: "Bangalore" },
  { subMarket: "Whitefield", avgRentPsfMo: "₹95", vacancy: "11.4%", yoyAbsorption: "+28%", signal: "STRONG", city: "Bangalore" },
  { subMarket: "Hebbal / Manyata", avgRentPsfMo: "₹88", vacancy: "9.6%", yoyAbsorption: "+22%", signal: "RISING", city: "Bangalore" },
  { subMarket: "Electronic City", avgRentPsfMo: "₹72", vacancy: "15.2%", yoyAbsorption: "+8%", signal: "STEADY", city: "Bangalore" },
  { subMarket: "North Bangalore", avgRentPsfMo: "₹65", vacancy: "4.1%", yoyAbsorption: "+61%", signal: "BREAKOUT", city: "Bangalore" },
  { subMarket: "Hinjewadi", avgRentPsfMo: "₹78", vacancy: "7.8%", yoyAbsorption: "+38%", signal: "STRONG", city: "Pune" },
  { subMarket: "Kharadi", avgRentPsfMo: "₹72", vacancy: "9.2%", yoyAbsorption: "+26%", signal: "RISING", city: "Pune" },
  { subMarket: "Baner-Balewadi", avgRentPsfMo: "₹82", vacancy: "11.5%", yoyAbsorption: "+18%", signal: "STEADY", city: "Pune" },
  { subMarket: "BKC", avgRentPsfMo: "₹380", vacancy: "3.2%", yoyAbsorption: "+42%", signal: "BREAKOUT", city: "Mumbai" },
  { subMarket: "Andheri-Goregaon", avgRentPsfMo: "₹165", vacancy: "8.8%", yoyAbsorption: "+22%", signal: "RISING", city: "Mumbai" },
  { subMarket: "Thane-Navi Mumbai", avgRentPsfMo: "₹85", vacancy: "12.4%", yoyAbsorption: "+35%", signal: "STRONG", city: "Mumbai" },
  { subMarket: "Powai", avgRentPsfMo: "₹145", vacancy: "6.5%", yoyAbsorption: "+28%", signal: "STRONG", city: "Mumbai" },
];

// ── Investor Intelligence ──
export interface InvestorDeal {
  title: string;
  details: string;
  icon: string;
  city: string;
}

export const investorDeals: InvestorDeal[] = [
  { title: "Puravankara · Pravami AIF", details: "Second close $180M, targeting luxury residential in North BLR, Sarjapur, Hebbal.", icon: "💰", city: "Bangalore" },
  { title: "Embassy REIT", details: "Q3 FY26 distribution up 11% QOQ to ₹6.2/unit; 2.4M sqft leasing pipeline.", icon: "📊", city: "Bangalore" },
  { title: "NRI Demand Surge", details: "38-47% of pre-sales at premium launches; UAE/Singapore NRIs prioritise airport proximity.", icon: "✈️", city: "Bangalore" },
  { title: "Panchshil AIF", details: "₹800Cr fund for Pune commercial assets; targeting 14-16% IRR.", icon: "💰", city: "Pune" },
  { title: "Blackstone", details: "₹2,400Cr warehousing portfolio expansion in Chakan-Talegaon corridor.", icon: "🏭", city: "Pune" },
  { title: "Brookfield India REIT", details: "Mumbai portfolio NOI up 18% QOQ; Powai campus expansion.", icon: "📊", city: "Mumbai" },
  { title: "GIC Singapore", details: "₹4,200Cr BKC commercial acquisition; largest single-asset deal in 2026.", icon: "🌏", city: "Mumbai" },
];

export interface CapRate {
  assetClass: string;
  capRate: string;
  trend: string;
  appetite: "STRONG" | "RISING" | "SELECTIVE" | "BREAKOUT";
}

export const capRates: CapRate[] = [
  { assetClass: "Grade-A Office", capRate: "7.2–8.1%", trend: "Compressing", appetite: "STRONG" },
  { assetClass: "Luxury Residential", capRate: "3.4–4.2%", trend: "Stable", appetite: "STRONG" },
  { assetClass: "Warehousing/Logistics", capRate: "8.0–9.2%", trend: "Compressing", appetite: "RISING" },
  { assetClass: "Retail (Mall)", capRate: "9.0–10.5%", trend: "Stable", appetite: "SELECTIVE" },
  { assetClass: "Land (Dev potential)", capRate: "IRR basis", trend: "Very High", appetite: "BREAKOUT" },
];

// ── National Compass ──
export interface NationalCity {
  city: string;
  psfRange: string;
  yoy: string;
  keyDevelopment: string;
}

export const karnatakaCities: NationalCity[] = [
  { city: "Mysuru", psfRange: "₹3,800–4,600", yoy: "+9%", keyDevelopment: "3 wellness township plots under evaluation" },
  { city: "Hubli-Dharwad", psfRange: "₹3,200–4,100", yoy: "+12%", keyDevelopment: "North Karnataka Expressway effect emerging" },
  { city: "Mangaluru", psfRange: "₹4,500–6,200", yoy: "+14%", keyDevelopment: "Port expansion driving commercial interest" },
  { city: "Belagavi", psfRange: "₹2,800–3,500", yoy: "+7%", keyDevelopment: "Border city dynamics; Maharashtra demand spillover" },
];

export const nationalSnapshot: NationalCity[] = [
  { city: "Mumbai", psfRange: "₹22,000–35,000", yoy: "+11%", keyDevelopment: "BKC office rents all-time high; Worli luxury institutional buying" },
  { city: "Delhi NCR", psfRange: "₹8,500–14,000", yoy: "+16%", keyDevelopment: "DLF Phase 6 launch ₹4,200Cr GDV; Golf Course Ext enters premium cycle" },
  { city: "Hyderabad", psfRange: "₹7,800–11,200", yoy: "+19%", keyDevelopment: "Kokapet + Narsingi outperforming; western suburbs breakout" },
  { city: "Pune", psfRange: "₹6,500–9,800", yoy: "+13%", keyDevelopment: "Hinjewadi Phase 3 completion triggers Marunji-Wakad demand surge" },
  { city: "Chennai", psfRange: "₹6,200–9,500", yoy: "+8%", keyDevelopment: "OMR stabilising; port expansion drives industrial + logistics" },
];

// ── Regulatory ──
export interface RegulatorySignal {
  signal: string;
  currentValue: string;
  whatToWatch: string;
  city: string;
}

export const regulatorySignals: RegulatorySignal[] = [
  { signal: "New Filings (Applications Under Process)", currentValue: "227", whatToWatch: "Early signal of unannounced launches", city: "Bangalore" },
  { signal: "Revenue Recovery Certificates", currentValue: "3 issued", whatToWatch: "Developer financial stress indicator", city: "Bangalore" },
  { signal: "Quarterly Update Delays", currentValue: "42 projects flagged", whatToWatch: "Late filers = project stress", city: "Bangalore" },
  { signal: "Project Extension Requests", currentValue: "18 this cycle", whatToWatch: "Delay signal", city: "Bangalore" },
  { signal: "Complaint Volume Trends", currentValue: "156 (↑12% QOQ)", whatToWatch: "Early warning for distressed projects", city: "Bangalore" },
  { signal: "New MahaRERA Filings", currentValue: "312", whatToWatch: "Pipeline signal for Mumbai+Pune", city: "Mumbai" },
  { signal: "Lapsed Registrations", currentValue: "28 this quarter", whatToWatch: "Stalled project indicator", city: "Mumbai" },
  { signal: "New Filings (Pune RERA)", currentValue: "184", whatToWatch: "IT corridor expansion signal", city: "Pune" },
];

// ── Emerging Corridors & Unknown Signals ──
export interface UnknownSignal {
  title: string;
  description: string;
  patternMatch: string;
  implication: string;
  nextAction: string;
  confidence: "LOW" | "MEDIUM";
  city: string;
}

export const unknownSignals: UnknownSignal[] = [
  { title: "Hoskote-Malur · Shell entity land banking", description: "11 transactions in 6 weeks, ~60 acres aggregated under new entities.", patternMatch: "Matches pre-industrial corridor pattern (similar to Devanahalli 2015)", implication: "If KIADB notified, land values could appreciate 50-80% in 24 months", nextAction: "Monitor MCA filings & KIADB notifications", confidence: "MEDIUM", city: "Bangalore" },
  { title: "Aerospace SEZ boundary · 6 new entity filings", description: "MCA filings suggest large-format hospitality/service setup near Aerospace SEZ.", patternMatch: "Similar to pre-IT Park patterns in Whitefield (2008)", implication: "May indicate anchor tenant for aerospace corridor, catalysing residential demand", nextAction: "Cross-reference with KIADB allotments", confidence: "LOW", city: "Bangalore" },
  { title: "Nandi Hills foothills · large developer scouting", description: "Unnamed developer scouting 100+ acres for wellness-resort format.", patternMatch: "Matches Total Environment's expansion playbook", implication: "Could create entirely new micro-market; landowner ask rates already up 18%", nextAction: "Track sub-registrar filings in Nandi hobli", confidence: "LOW", city: "Bangalore" },
  { title: "Wagholi-Solapur Highway · aggregation", description: "4 new SPVs registered; 45 acres under negotiation along highway expansion.", patternMatch: "Pre-logistics park pattern (similar to Chakan 2018)", implication: "Warehousing + residential township potential if highway completed", nextAction: "Monitor NHAI + IGR filings", confidence: "MEDIUM", city: "Pune" },
  { title: "Ulwe Node 5 · CIDCO plot allocation surge", description: "8 new plot allocations in 3 weeks; developer interest unprecedented.", patternMatch: "Mirrors pre-airport demand in Devanahalli", implication: "Could see 40-60% appreciation once NMIA opens", nextAction: "Track CIDCO auction results", confidence: "MEDIUM", city: "Mumbai" },
];

// ── Deep Dive ──
export interface DeepDive {
  title: string;
  subtitle: string;
  content: string[];
  scores: { category: string; score: number }[];
  verdict: string;
  city: string;
}

export const deepDives: DeepDive[] = [
  {
    title: "Why North Bangalore Is The Next Real Estate Power Corridor",
    subtitle: "A strategic analysis of the forces converging to create a decade-long appreciation event.",
    city: "Bangalore",
    content: [
      "The Power Corridor Theory – Every decade Bangalore produces one outperforming corridor. In the 2000s, it was Whitefield riding the IT boom. In the 2010s, Sarjapur Road caught the wave of ORR development and startup culture. In the 2020s, the arc from Hebbal through Yelahanka to Devanahalli has all four catalysts: infrastructure triple play (BIAL T2, Metro Yellow Line, Aerospace Corridor), developer conviction (₹580Cr+ deployed in 15 days), NRI premium, and policy support.",
      "Catalyst 1: Infrastructure Triple Play – BIAL Terminal 2 (mid-2027, capacity 25M→55M passengers), the Aerospace Industrial Corridor (1,200 notified acres in Doddaballapur-Devanahalli), and the Metro Yellow Line extension – all arriving in a 24-month window. This is unprecedented in Bangalore's history. No other corridor has had three mega-infrastructure projects converging simultaneously.",
      "Catalyst 2: Developer Convergence – Prestige, Brigade, Century, and Adarsh have collectively deployed over ₹580Cr in North Bangalore land acquisitions this cycle alone. Godrej is actively scouting for 50+ acre parcels, and Total Environment is in JDA talks for a sustainable luxury project on Kanakapura Road. This pattern of institutional developer convergence preceded the Sarjapur boom of 2014-2019.",
      "Catalyst 3: NRI Premium – Airport proximity is the #1 factor driving NRI purchase decisions in Bangalore. Brigade's recent Sarjapur launch saw 47% NRI pre-sales, the highest ever for a Bangalore project. North Bangalore projects, with their direct airport access, are expected to see even higher NRI participation – potentially 50-60%.",
      "Catalyst 4: Commercial Demand – North Bangalore's commercial vacancy at 4.1% is the tightest in the city, with absorption up 61% YOY. This signals imminent new supply and, more importantly, residential demand from GCC relocations. Companies like Rolls-Royce, Collins Aerospace, and Boeing already have facilities in the corridor.",
      "Risk Factors – The thesis is not without risks. Infrastructure execution delays remain the primary concern – metro timelines have historically slipped 12-18 months. A potential supply overhang in 2027-28 could temporarily dampen appreciation if too many projects launch simultaneously. Investors should underwrite a 36-month holding period to ride through any short-term volatility.",
    ],
    scores: [
      { category: "Infrastructure", score: 9.2 },
      { category: "Developer Conviction", score: 8.8 },
      { category: "Demand Fundamentals", score: 8.4 },
      { category: "Risk-Reward", score: 8.1 },
    ],
    verdict: "North Bangalore is a structured multi-catalyst thesis. The window to enter at pre-catalysed pricing is 12-18 months. Investors with a 3-5 year horizon should prioritise Devanahalli, Yelahanka, and the BIAL corridor.",
  },
  {
    title: "Hinjewadi-Balewadi: Pune's IT Corridor Reaching Pricing Inflection",
    subtitle: "How Metro Phase 3 and IT expansion are reshaping western Pune's real estate dynamics.",
    city: "Pune",
    content: [
      "Western Pune's IT corridor stretching from Hinjewadi through Wakad, Balewadi, and into Mahalunge represents the city's most dynamic real estate micro-market. With 8.7 CMI for Hinjewadi – the highest in Pune – and YOY appreciation rates of 17-22% across the corridor, the question is no longer whether this corridor will outperform, but how high prices can go.",
      "The Metro Factor – Metro Phase 3 connecting Hinjewadi to Shivajinagar is 40% complete. Historical data from Bangalore shows that metro connectivity added 15-25% premium to residential prices within 800m of stations. For Hinjewadi, where commute times currently average 75 minutes to CBD, this could be transformative.",
      "IT Expansion – Hinjewadi IT Park Phase 4 has received master plan approval, with capacity for 15,000+ new jobs. Combined with Phase 3's ongoing expansion, the total employment base in the corridor is expected to reach 250,000 by 2028 – creating unprecedented residential demand.",
      "Price Discovery – Balewadi at ₹7,900 psf and Mahalunge at ₹6,800 psf represent the pricing frontier. With Baner already at ₹8,500 psf and approaching saturation, spillover demand is pushing these adjacent micro-markets into a premium cycle.",
    ],
    scores: [
      { category: "Infrastructure", score: 8.5 },
      { category: "Developer Conviction", score: 8.2 },
      { category: "Demand Fundamentals", score: 8.8 },
      { category: "Risk-Reward", score: 7.8 },
    ],
    verdict: "The Hinjewadi-Balewadi corridor is entering a pricing inflection. Metro connectivity will be the primary catalyst. Entry at current levels (₹6,800-7,900 psf) offers strong risk-adjusted returns over a 3-year horizon.",
  },
  {
    title: "Mumbai's Airport & Coastal Road: Two Mega-Catalysts Reshaping the City",
    subtitle: "Navi Mumbai Airport and Coastal Road are creating India's most valuable real estate corridors.",
    city: "Mumbai",
    content: [
      "Mumbai stands at a unique inflection point with two mega-infrastructure projects simultaneously reshaping its real estate geography. The Coastal Road (Phase 2) is already transforming South-Central Mumbai connectivity, while the Navi Mumbai International Airport (NMIA) promises to create an entirely new economic center.",
      "Coastal Road Impact – The South Mumbai section is operational, cutting BKC-Bandra travel from 45 to 8 minutes. This has already triggered a premium expansion in Worli and Lower Parel, with institutional buyers (GIC's ₹4,200Cr BKC deal) validating the thesis. Phase 2 extending to Kandivali will bring northern suburbs into the premium orbit.",
      "NMIA – The Game Changer – With terminal structure 60% complete and a 2027 opening target, NMIA will be India's largest airport. Ulwe, positioned directly adjacent, has seen 18% YOY appreciation – the highest in Mumbai. CIDCO's 120-acre allocation at ₹3,200Cr signals the scale of development planned.",
      "The Convergence – Mumbai's real estate market is unique in India – supply-constrained, redevelopment-driven, and increasingly bifurcated between ultra-premium South Mumbai and growth corridors in the extended suburbs and Navi Mumbai. Both catalysts serve different segments but together make Mumbai's overall market the deepest and most resilient in India.",
    ],
    scores: [
      { category: "Infrastructure", score: 9.5 },
      { category: "Developer Conviction", score: 9.0 },
      { category: "Demand Fundamentals", score: 8.8 },
      { category: "Risk-Reward", score: 7.5 },
    ],
    verdict: "Mumbai offers two distinct plays: ultra-premium (Worli, BKC via Coastal Road) and growth (Ulwe, Kharghar via NMIA). Both have strong institutional backing. The NMIA corridor offers better risk-reward for mid-term investors.",
  },
];

// ── Executive Brief Themes ──
export interface ExecutiveTheme {
  theme: string;
  summary: string;
  city: string;
}

export const executiveThemes: ExecutiveTheme[] = [
  { theme: "North Bangalore Inflection", summary: "₹580Cr+ deployed by top developers in 15 days. Infrastructure triple play (BIAL T2 + Metro + Aerospace) creates decade-defining opportunity.", city: "Bangalore" },
  { theme: "NRI Demand Surge", summary: "38-47% pre-sales share at premium launches. UAE/Singapore NRIs prioritise airport proximity and branded developers.", city: "Bangalore" },
  { theme: "Kanakapura Road Breakout", summary: "+31% YOY appreciation – highest in city. Metro Yellow Line confirmation triggering transit-induced value unlocking.", city: "Bangalore" },
  { theme: "Hoskote Unknown Signal", summary: "Shell entity land aggregation (~60 acres, 11 transactions in 6 weeks) matches pre-industrial corridor pattern.", city: "Bangalore" },
  { theme: "Commercial Recovery", summary: "North BLR vacancy 4.1%, absorption +61% YOY. GCC relocations driving tightest commercial market in city.", city: "Bangalore" },
  { theme: "IT Corridor Pricing Inflection", summary: "Hinjewadi CMI 8.7 – highest in Pune. Metro Phase 3 + IT Park Ph 4 creating dual catalyst.", city: "Pune" },
  { theme: "Western Pune Dominance", summary: "Tathawade (+22%), Ravet (+20%), Wagholi (+24%) leading appreciation. Spillover from saturated Baner-Balewadi.", city: "Pune" },
  { theme: "Coastal Road Premium Wave", summary: "South Mumbai section operational. BKC-Bandra travel cut from 45 to 8 minutes. Ultra-premium corridor forming.", city: "Mumbai" },
  { theme: "NMIA Game Changer", summary: "Ulwe +18% YOY – highest in Mumbai. CIDCO ₹3,200Cr allocation signals scale of development ahead.", city: "Mumbai" },
  { theme: "Institutional Capital Surge", summary: "GIC ₹4,200Cr BKC deal + Brookfield REIT NOI +18%. Foreign institutional conviction at all-time high.", city: "Mumbai" },
];

// Helper to get data by city
export function getMarketMetrics(city: string): MarketMetric[] {
  if (city === "Bangalore") return bangaloreMarketMetrics;
  if (city === "Pune") return puneMarketMetrics;
  return mumbaiMarketMetrics;
}

export function getSegments(city: string): SegmentData[] {
  if (city === "Bangalore") return bangaloreSegments;
  if (city === "Pune") return puneSegments;
  return mumbaiSegments;
}
