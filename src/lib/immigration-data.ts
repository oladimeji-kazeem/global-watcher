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
  longDescription: string;
  previousRule: string;
  newRule: string;
  effectiveDate: string;
  announcementDate: string;
  sourceUrl: string;
  sourceName: string;
  status: ChangeStatus;
  impact: string;
  reviewedBy: string;
  keyPoints: string[];
}

export const changes: ImmigrationChange[] = [
  {
    id: "uk-sw-2026",
    country: "United Kingdom", countryCode: "UK", flag: "🇬🇧",
    visaType: "Skilled Worker Visa", category: "Employment",
    title: "Salary threshold raised to £30,000",
    description: "The Home Office has updated the minimum salary requirement for Skilled Worker visa sponsorship.",
    longDescription: "The UK Home Office has published updated Immigration Rules raising the general minimum salary requirement for Skilled Worker visa sponsorship. The change affects all new applications and sponsor licence assignments from the effective date. Existing Skilled Worker holders extending or changing employer are not immediately affected but should confirm compliance with the new going rate for their occupation code.",
    previousRule: "Minimum salary £26,200 per year (or going rate for the occupation).",
    newRule: "Minimum salary £30,000 per year (or going rate for the occupation, whichever is higher).",
    effectiveDate: "2026-09-01", announcementDate: "2026-07-21",
    sourceUrl: "https://www.gov.uk/skilled-worker-visa", sourceName: "Home Office",
    status: "urgent", impact: "Future applicants & sponsors",
    reviewedBy: "Radar Editorial",
    keyPoints: [
      "Applies to Certificates of Sponsorship assigned on or after 1 September 2026.",
      "Going rate percentiles for shortage occupations remain at 80%.",
      "No transitional arrangements announced for pending applications.",
    ],
  },
  {
    id: "ca-ee-2026",
    country: "Canada", countryCode: "CA", flag: "🇨🇦",
    visaType: "Express Entry", category: "Permanent Residence",
    title: "New category-based draws for healthcare",
    description: "IRCC introduces targeted draws prioritising healthcare and STEM occupations.",
    longDescription: "Immigration, Refugees and Citizenship Canada (IRCC) is introducing new category-based Express Entry rounds of invitations that prioritise candidates with experience in healthcare, STEM, skilled trades, transport and agriculture. The new draws run alongside general CRS rounds and target 2026 admissions levels.",
    previousRule: "General Comprehensive Ranking System (CRS) draws only, held roughly every two weeks.",
    newRule: "Category-based draws every two weeks, alternating with general CRS rounds.",
    effectiveDate: "2026-08-15", announcementDate: "2026-07-18",
    sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship.html", sourceName: "IRCC",
    status: "approved", impact: "Skilled worker candidates",
    reviewedBy: "Radar Editorial",
    keyPoints: [
      "Requires at least 6 months of continuous full-time work in a qualifying NOC.",
      "Candidates must still meet minimum CRS score cut-off for each draw.",
      "Language proficiency requirements unchanged.",
    ],
  },
  {
    id: "au-482-2026",
    country: "Australia", countryCode: "AU", flag: "🇦🇺",
    visaType: "Subclass 482", category: "Employment",
    title: "TSMIT increased to AUD 73,150",
    description: "Temporary Skilled Migration Income Threshold updated for the new financial year.",
    longDescription: "The Australian Department of Home Affairs has indexed the Temporary Skilled Migration Income Threshold (TSMIT) for the 2026-27 financial year. New nominations from the effective date must meet the higher threshold, alongside the market salary rate for the occupation.",
    previousRule: "TSMIT AUD 70,000 per annum.",
    newRule: "TSMIT AUD 73,150 per annum.",
    effectiveDate: "2026-07-01", announcementDate: "2026-06-10",
    sourceUrl: "https://immi.homeaffairs.gov.au/", sourceName: "Department of Home Affairs",
    status: "warning", impact: "Employer sponsors",
    reviewedBy: "Radar Editorial",
    keyPoints: [
      "Applies to new nomination applications from 1 July 2026.",
      "Existing 482 holders unaffected until their next renewal.",
      "Market salary rate assessment still required.",
    ],
  },
  {
    id: "de-bc-2026",
    country: "Germany", countryCode: "DE", flag: "🇩🇪",
    visaType: "Blue Card EU", category: "Employment",
    title: "Salary threshold lowered for shortage occupations",
    description: "Germany expands Blue Card access with lower salary bars for shortage roles.",
    longDescription: "Germany's Federal Office for Migration and Refugees (BAMF) confirmed updated Blue Card EU thresholds as part of the ongoing Skilled Immigration Act reforms. The reduction is aimed at accelerating recruitment in IT, healthcare and engineering shortage occupations.",
    previousRule: "€45,300 general threshold; €41,041 shortage occupations.",
    newRule: "€41,041 general; €36,672 shortage occupations.",
    effectiveDate: "2026-06-01", announcementDate: "2026-05-20",
    sourceUrl: "https://www.make-it-in-germany.com/", sourceName: "BAMF",
    status: "approved", impact: "Skilled foreign workers",
    reviewedBy: "Radar Editorial",
    keyPoints: [
      "Applies to new Blue Card applications submitted from 1 June 2026.",
      "Recognition of foreign qualifications remains required.",
      "Family reunification rules unchanged.",
    ],
  },
  {
    id: "us-h1b-2026",
    country: "United States", countryCode: "US", flag: "🇺🇸",
    visaType: "H-1B", category: "Employment",
    title: "Registration fee increased to $215",
    description: "USCIS raises H-1B electronic registration fee ahead of FY2027 cap season.",
    longDescription: "U.S. Citizenship and Immigration Services (USCIS) has finalised a rule raising the H-1B electronic registration fee. The new fee applies to all registrants participating in the FY2027 cap season.",
    previousRule: "Registration fee $10 per beneficiary.",
    newRule: "Registration fee $215 per beneficiary.",
    effectiveDate: "2026-03-01", announcementDate: "2026-02-02",
    sourceUrl: "https://www.uscis.gov/", sourceName: "USCIS",
    status: "warning", impact: "H-1B petitioners",
    reviewedBy: "Radar Editorial",
    keyPoints: [
      "Applies to the FY2027 initial registration period.",
      "Beneficiary-centric selection process retained.",
      "Filing fees for approved I-129 petitions unchanged in this update.",
    ],
  },
  {
    id: "ie-cs-2026",
    country: "Ireland", countryCode: "IE", flag: "🇮🇪",
    visaType: "Critical Skills Permit", category: "Employment",
    title: "Occupations list expanded",
    description: "20 new roles added to the Critical Skills Occupations List including AI engineers.",
    longDescription: "Ireland's Department of Enterprise, Trade and Employment (DETE) has published its 2026 review of the employment permits occupation lists, adding new roles to the Critical Skills Occupations List.",
    previousRule: "2024 Critical Skills Occupations List with 60 eligible roles.",
    newRule: "2026 list with 80 eligible roles, adding AI, cyber and healthcare positions.",
    effectiveDate: "2026-07-10", announcementDate: "2026-07-01",
    sourceUrl: "https://enterprise.gov.ie/", sourceName: "DETE",
    status: "info", impact: "Tech & healthcare workers",
    reviewedBy: "Radar Editorial",
    keyPoints: [
      "Applies to new Critical Skills Employment Permit applications.",
      "Minimum annual remuneration criteria remain in force.",
      "Two-year stamp before eligibility for Stamp 4 unchanged.",
    ],
  },
  {
    id: "uk-student-2026",
    country: "United Kingdom", countryCode: "UK", flag: "🇬🇧",
    visaType: "Student Visa", category: "Study",
    title: "Dependant restrictions extended to research masters",
    description: "Home Office widens dependant restrictions to include most taught research masters courses.",
    longDescription: "Following the January 2024 restrictions on dependants for taught masters, the Home Office is extending the restriction to selected research masters programmes. PhD candidates remain able to bring dependants.",
    previousRule: "Dependants restricted only for taught masters shorter than 9 months.",
    newRule: "Dependants restricted for taught and non-doctoral research masters programmes.",
    effectiveDate: "2026-10-01", announcementDate: "2026-06-15",
    sourceUrl: "https://www.gov.uk/student-visa", sourceName: "Home Office",
    status: "urgent", impact: "International students",
    reviewedBy: "Radar Editorial",
    keyPoints: [
      "Effective for CAS assigned from 1 October 2026.",
      "PhD, research doctorate and government-sponsored students exempt.",
      "Existing dependants can extend in line with the main applicant.",
    ],
  },
  {
    id: "ca-pgwp-2026",
    country: "Canada", countryCode: "CA", flag: "🇨🇦",
    visaType: "Post-Graduation Work Permit", category: "Study",
    title: "PGWP tightened to eligible field lists",
    description: "IRCC restricts PGWP eligibility to graduates of programmes tied to labour-market shortage fields.",
    longDescription: "New IRCC policy limits PGWP eligibility for non-degree college programmes to those aligned with 966 designated fields of study linked to long-term labour shortages.",
    previousRule: "PGWP available to graduates of most eligible DLI programmes.",
    newRule: "Non-degree college graduates must have studied one of 966 designated fields.",
    effectiveDate: "2026-05-15", announcementDate: "2026-03-20",
    sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship.html", sourceName: "IRCC",
    status: "warning", impact: "International college students",
    reviewedBy: "Radar Editorial",
    keyPoints: [
      "Bachelor, masters and doctoral graduates unaffected.",
      "Field lists reviewed annually by IRCC.",
      "Language testing requirement retained.",
    ],
  },
];

export const countries = [
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", authority: "Home Office", website: "https://www.gov.uk/browse/visas-immigration", tracked: 6, updates: 12,
    visaTypes: ["Skilled Worker Visa", "Student Visa", "Graduate Visa", "Family Visa", "Global Talent Visa", "Settlement / ILR"] },
  { code: "CA", name: "Canada", flag: "🇨🇦", authority: "IRCC", website: "https://www.canada.ca/en/immigration-refugees-citizenship.html", tracked: 8, updates: 9,
    visaTypes: ["Express Entry", "PNP", "Study Permit", "PGWP", "Family Sponsorship", "LMIA Work Permit", "Start-up Visa", "Caregiver"] },
  { code: "AU", name: "Australia", flag: "🇦🇺", authority: "Home Affairs", website: "https://immi.homeaffairs.gov.au/", tracked: 5, updates: 7,
    visaTypes: ["Subclass 482", "Subclass 186", "Subclass 500", "Subclass 189", "Subclass 190"] },
  { code: "DE", name: "Germany", flag: "🇩🇪", authority: "BAMF", website: "https://www.make-it-in-germany.com/", tracked: 4, updates: 5,
    visaTypes: ["Blue Card EU", "Job Seeker Visa", "Skilled Worker Visa", "Student Visa"] },
  { code: "US", name: "United States", flag: "🇺🇸", authority: "USCIS", website: "https://www.uscis.gov/", tracked: 9, updates: 14,
    visaTypes: ["H-1B", "H-2B", "L-1", "O-1", "EB-1", "EB-2", "EB-3", "F-1", "Green Card"] },
  { code: "IE", name: "Ireland", flag: "🇮🇪", authority: "DETE", website: "https://enterprise.gov.ie/", tracked: 3, updates: 4,
    visaTypes: ["Critical Skills Permit", "General Employment Permit", "Stamp 4"] },
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

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const allCategories = Array.from(new Set(changes.map(c => c.category)));
export const allVisaTypes = Array.from(new Set(changes.map(c => c.visaType)));
export const allCountries = Array.from(new Set(changes.map(c => c.country)));
export const allStatuses: ChangeStatus[] = ["urgent", "warning", "approved", "info"];
