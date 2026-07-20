export type ChangeStatus = "urgent" | "warning" | "approved" | "info";

export interface ImmigrationChange {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  visaType: string;
  category: string;
  title: string;
  description: string;
  previousRule: string;
  newRule: string;
  effectiveDate: string;
  announcementDate: string;
  sourceUrl: string;
  sourceName: string;
  status: ChangeStatus;
  impact: string;
}

export const changes: ImmigrationChange[] = [
  {
    id: "uk-sw-2026",
    country: "United Kingdom", countryCode: "UK", flag: "🇬🇧",
    visaType: "Skilled Worker Visa", category: "Employment",
    title: "Salary threshold raised to £30,000",
    description: "The Home Office has updated the minimum salary requirement for Skilled Worker visa sponsorship.",
    previousRule: "Minimum salary £26,200 per year",
    newRule: "Minimum salary £30,000 per year",
    effectiveDate: "2026-09-01", announcementDate: "2026-07-21",
    sourceUrl: "https://www.gov.uk/skilled-worker-visa", sourceName: "Home Office",
    status: "urgent", impact: "Future applicants & sponsors",
  },
  {
    id: "ca-ee-2026",
    country: "Canada", countryCode: "CA", flag: "🇨🇦",
    visaType: "Express Entry", category: "Permanent Residence",
    title: "New category-based draws for healthcare",
    description: "IRCC introduces targeted draws prioritising healthcare and STEM occupations.",
    previousRule: "General CRS draws only",
    newRule: "Category-based draws every 2 weeks",
    effectiveDate: "2026-08-15", announcementDate: "2026-07-18",
    sourceUrl: "https://www.canada.ca/immigration", sourceName: "IRCC",
    status: "approved", impact: "Skilled worker candidates",
  },
  {
    id: "au-482-2026",
    country: "Australia", countryCode: "AU", flag: "🇦🇺",
    visaType: "Subclass 482", category: "Employment",
    title: "TSMIT increased to AUD 73,150",
    description: "Temporary Skilled Migration Income Threshold updated for the new financial year.",
    previousRule: "TSMIT AUD 70,000",
    newRule: "TSMIT AUD 73,150",
    effectiveDate: "2026-07-01", announcementDate: "2026-06-10",
    sourceUrl: "https://immi.homeaffairs.gov.au", sourceName: "Department of Home Affairs",
    status: "warning", impact: "Employer sponsors",
  },
  {
    id: "de-bc-2026",
    country: "Germany", countryCode: "DE", flag: "🇩🇪",
    visaType: "Blue Card EU", category: "Employment",
    title: "Salary threshold lowered for shortage occupations",
    description: "Germany expands Blue Card access with lower salary bars for shortage roles.",
    previousRule: "€45,300 general threshold",
    newRule: "€41,041 general, €36,672 shortage",
    effectiveDate: "2026-06-01", announcementDate: "2026-05-20",
    sourceUrl: "https://www.make-it-in-germany.com", sourceName: "BAMF",
    status: "approved", impact: "Skilled foreign workers",
  },
  {
    id: "us-h1b-2026",
    country: "United States", countryCode: "US", flag: "🇺🇸",
    visaType: "H-1B", category: "Employment",
    title: "Registration fee increased to $215",
    description: "USCIS raises H-1B electronic registration fee ahead of FY2027 cap season.",
    previousRule: "Registration fee $10",
    newRule: "Registration fee $215",
    effectiveDate: "2026-03-01", announcementDate: "2026-02-02",
    sourceUrl: "https://www.uscis.gov", sourceName: "USCIS",
    status: "warning", impact: "H-1B petitioners",
  },
  {
    id: "ie-cs-2026",
    country: "Ireland", countryCode: "IE", flag: "🇮🇪",
    visaType: "Critical Skills Permit", category: "Employment",
    title: "Occupations list expanded",
    description: "20 new roles added to the Critical Skills Occupations List including AI engineers.",
    previousRule: "Existing 2024 list",
    newRule: "Expanded 2026 list (+20 roles)",
    effectiveDate: "2026-07-10", announcementDate: "2026-07-01",
    sourceUrl: "https://enterprise.gov.ie", sourceName: "DETE",
    status: "info", impact: "Tech & healthcare workers",
  },
];

export const countries = [
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", authority: "Home Office", tracked: 6, updates: 12 },
  { code: "CA", name: "Canada", flag: "🇨🇦", authority: "IRCC", tracked: 8, updates: 9 },
  { code: "AU", name: "Australia", flag: "🇦🇺", authority: "Home Affairs", tracked: 5, updates: 7 },
  { code: "DE", name: "Germany", flag: "🇩🇪", authority: "BAMF", tracked: 4, updates: 5 },
  { code: "US", name: "United States", flag: "🇺🇸", authority: "USCIS", tracked: 9, updates: 14 },
  { code: "IE", name: "Ireland", flag: "🇮🇪", authority: "DETE", tracked: 3, updates: 4 },
];

export const timeline = [
  { year: "2023", title: "Salary threshold £26,200", body: "Baseline Skilled Worker minimum salary set." },
  { year: "2024", title: "Health surcharge increased", body: "IHS rose from £624 to £1,035 per year." },
  { year: "2025", title: "Threshold raised to £38,700", body: "Major shift for new Skilled Worker applications." },
  { year: "2026", title: "Settlement reforms proposed", body: "Consultation on 10-year qualifying period underway." },
];

export const statusStyles: Record<ChangeStatus, { label: string; dot: string; badge: string }> = {
  urgent:   { label: "Urgent",   dot: "bg-[color:var(--danger)]",  badge: "bg-[color:var(--danger)]/15 text-[color:var(--danger)] border-[color:var(--danger)]/30" },
  warning:  { label: "Warning",  dot: "bg-[color:var(--warning)]", badge: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30" },
  approved: { label: "Approved", dot: "bg-[color:var(--success)]", badge: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30" },
  info:     { label: "Info",     dot: "bg-[color:var(--info)]",    badge: "bg-[color:var(--info)]/15 text-[color:var(--info)] border-[color:var(--info)]/30" },
};
