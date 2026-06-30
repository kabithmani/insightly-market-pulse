// Single source of truth for "as of today" period labels used across the report.
// Today drives the labels, so the report never goes stale just because the wall clock advances.

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface ReportPeriod {
  today: Date;
  asOfShort: string;       // "30 Jun 2026"
  asOfLong: string;        // "30 June 2026"
  monthLabel: string;      // "Jun 2026"
  prevYearMonthLabel: string; // "Jun 2025"
  quarterLabel: string;    // "Q2 2026"
  lastYearQuarterLabel: string; // "Q2 2025"
  twoYearsAgoQuarterLabel: string; // "Q2 2024"
  fortnightLabel: string;  // "Jun 16-30, 2026"
  year: number;
  quarter: 1 | 2 | 3 | 4;
}

export function getReportPeriod(now: Date = new Date()): ReportPeriod {
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();
  const quarter = (Math.floor(month / 3) + 1) as 1 | 2 | 3 | 4;

  const monthShort = MONTHS_SHORT[month];
  const monthLong = MONTHS_LONG[month];

  // Fortnight: 1-15 or 16-end
  const lastDay = new Date(year, month + 1, 0).getDate();
  const fortnight = day <= 15
    ? `${monthShort} 1-15, ${year}`
    : `${monthShort} 16-${lastDay}, ${year}`;

  return {
    today: now,
    asOfShort: `${day} ${monthShort} ${year}`,
    asOfLong: `${day} ${monthLong} ${year}`,
    monthLabel: `${monthShort} ${year}`,
    prevYearMonthLabel: `${monthShort} ${year - 1}`,
    quarterLabel: `Q${quarter} ${year}`,
    lastYearQuarterLabel: `Q${quarter} ${year - 1}`,
    twoYearsAgoQuarterLabel: `Q${quarter} ${year - 2}`,
    fortnightLabel: fortnight,
    year,
    quarter,
  };
}

// Convenience singleton evaluated at module load. Components can also call
// getReportPeriod() per render if they need real-time freshness across midnight.
export const REPORT_PERIOD = getReportPeriod();
