import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MarketWithDistance } from "./geo";

export function generatePDFReport(
  markets: MarketWithDistance[],
  location: string,
  city: string,
  radiusKm: number
) {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageW = doc.internal.pageSize.getWidth();

  // Title page
  doc.setFontSize(28);
  doc.setTextColor(59, 90, 200);
  doc.text("Real Estate Intelligence — by Kabith Mani", pageW / 2, 40, { align: "center" });
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(`Report for: ${location}`, pageW / 2, 55, { align: "center" });
  doc.text(`City: ${city} | Radius: ${radiusKm} km | Markets Found: ${markets.length}`, pageW / 2, 65, { align: "center" });
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}`, pageW / 2, 75, { align: "center" });

  // Executive Brief
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const avgPsf = Math.round(markets.reduce((s, m) => s + m.avg_psf, 0) / markets.length);
  const topCMI = [...markets].sort((a, b) => b.cmi - a.cmi)[0];
  const topYOY = [...markets].sort((a, b) => b.yoy_change - a.yoy_change)[0];
  const brief = [
    `Executive Intelligence Brief`,
    ``,
    `Average PSF across ${markets.length} micro-markets: ₹${avgPsf.toLocaleString("en-IN")}`,
    `Highest CMI: ${topCMI.name} (${topCMI.cmi}/10) — strong capital momentum`,
    `Top Appreciation: ${topYOY.name} (${topYOY.yoy_change}% YOY)`,
    `Total land deals tracked: ${markets.reduce((s, m) => s + m.land_deals.length, 0)}`,
    `Infrastructure projects: ${markets.reduce((s, m) => s + m.infra_news.length, 0)}`,
  ];
  doc.text(brief, 14, 95);

  // Micro-market table
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(59, 90, 200);
  doc.text("Micro-Market Analysis", 14, 20);

  autoTable(doc, {
    startY: 28,
    head: [["Market", "Distance (km)", "Avg PSF (₹)", "YOY %", "CMI", "Land Deals", "Infra"]],
    body: markets.map((m) => [
      m.name,
      m.distance.toString(),
      m.avg_psf.toLocaleString("en-IN"),
      `${m.yoy_change}%`,
      m.cmi.toString(),
      m.land_deals.join("; ") || "—",
      m.infra_news.join("; ") || "—",
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [59, 90, 200], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
  });

  // CMI Analysis
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(59, 90, 200);
  doc.text("Capital Momentum Index (CMI) Analysis", 14, 20);

  const cmiSorted = [...markets].sort((a, b) => b.cmi - a.cmi);
  autoTable(doc, {
    startY: 28,
    head: [["Rank", "Market", "CMI Score", "YOY %", "Avg PSF (₹)"]],
    body: cmiSorted.map((m, i) => [
      (i + 1).toString(),
      m.name,
      m.cmi.toString(),
      `${m.yoy_change}%`,
      m.avg_psf.toLocaleString("en-IN"),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [120, 80, 200], textColor: 255 },
  });

  // Land Deals
  const landDeals = markets.flatMap((m) =>
    m.land_deals.map((d) => ({ market: m.name, deal: d }))
  );
  if (landDeals.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(59, 90, 200);
    doc.text("Land Deals & Shell Entity Tracking", 14, 20);
    autoTable(doc, {
      startY: 28,
      head: [["Market", "Deal Details"]],
      body: landDeals.map((d) => [d.market, d.deal]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [200, 80, 80], textColor: 255 },
    });
  }

  // Infrastructure
  const infra = markets.flatMap((m) =>
    m.infra_news.map((n) => ({ market: m.name, news: n }))
  );
  if (infra.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(59, 90, 200);
    doc.text("Infrastructure Impact Assessment", 14, 20);
    autoTable(doc, {
      startY: 28,
      head: [["Market", "Infrastructure Development"]],
      body: infra.map((i) => [i.market, i.news]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [50, 160, 100], textColor: 255 },
    });
  }

  // Deep Dive Narrative
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(59, 90, 200);
  doc.text("Deep Dive Analysis & Investor Insights", 14, 20);

  const narrative = generateNarrative(markets, city, location, radiusKm);
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const lines = doc.splitTextToSize(narrative, pageW - 28);
  doc.text(lines, 14, 32);

  doc.save(`FinCity_Report_${city}_${Date.now()}.pdf`);
}

function generateNarrative(
  markets: MarketWithDistance[],
  city: string,
  location: string,
  radius: number
): string {
  const avgPsf = Math.round(markets.reduce((s, m) => s + m.avg_psf, 0) / markets.length);
  const topCMI = [...markets].sort((a, b) => b.cmi - a.cmi)[0];
  const topYOY = [...markets].sort((a, b) => b.yoy_change - a.yoy_change)[0];
  const cheapest = [...markets].sort((a, b) => a.avg_psf - b.avg_psf)[0];
  const priciest = [...markets].sort((a, b) => b.avg_psf - a.avg_psf)[0];
  const totalDeals = markets.reduce((s, m) => s + m.land_deals.length, 0);
  const totalInfra = markets.reduce((s, m) => s + m.infra_news.length, 0);

  return `The real estate landscape within ${radius} km of ${location} in ${city} reveals a dynamic and evolving market with ${markets.length} active micro-markets under surveillance. The average price per square foot across this catchment stands at ₹${avgPsf.toLocaleString("en-IN")}, reflecting the diverse range of residential and commercial opportunities available to investors and end-users alike.

${topCMI.name} emerges as the standout performer with a Capital Momentum Index (CMI) of ${topCMI.cmi}/10, indicating strong price momentum driven by a combination of infrastructure development, demand-supply dynamics, and institutional interest. This market deserves close attention from investors seeking alpha in the ${city} real estate cycle.

In terms of year-over-year appreciation, ${topYOY.name} leads with an impressive ${topYOY.yoy_change}% growth, outpacing other micro-markets significantly. This surge can be attributed to improving connectivity, upcoming infrastructure projects, and growing demand from both domestic buyers and NRI investors.

The price spectrum ranges from ₹${cheapest.avg_psf.toLocaleString("en-IN")}/sq ft in ${cheapest.name} to ₹${priciest.avg_psf.toLocaleString("en-IN")}/sq ft in ${priciest.name}, offering opportunities across different budget segments. Value investors may find ${cheapest.name} particularly attractive given its growth trajectory and proximity to employment hubs.

Our intelligence tracking has identified ${totalDeals} significant land deals and ${totalInfra} infrastructure developments across these markets. These transactions, often involving institutional players and shell entities, serve as leading indicators of future price appreciation and development activity. Investors are advised to monitor these signals closely and align their investment thesis with the infrastructure timeline for optimal returns.`;
}
