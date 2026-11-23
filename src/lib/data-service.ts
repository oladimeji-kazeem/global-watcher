import { supabase } from "@/integrations/supabase/client";

export type ChangeStatus = "urgent" | "warning" | "approved" | "info";

export interface ImmigrationChange {
    id: string;
    country: string;
    country_code: string;
    flag: string;
    visa_type: string;
    category: string;
    title: string;
    description: string;
    long_description: string;
    previous_rule: string;
    new_rule: string;
    effective_date: string;
    announcement_date: string;
    source_url: string;
    source_name: string;
    status: ChangeStatus;
    impact: string;
    reviewed_by: string;
    key_points: string[];
    analytic_descriptive?: string;
    analytic_diagnostic?: string;
    analytic_predictive?: string;
    analytic_prescriptive?: string;
}

export interface Country {
    code: string;
    name: string;
    flag: string;
    authority: string;
    website: string;
    tracked: number;
    updates: number;
    visa_types: string[];
    slug: string;
}

export interface CountryPage {
    id: string;
    country_code: string;
    slug: string;
    title: string;
    content_markdown: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface TimelineEvent {
    year: string;
    title: string;
    body: string;
}

export interface SponsorOrganization {
    id: string;
    name: string;
    country_code: string;
    website_url: string | null;
    industry: string | null;
    sponsor_status: string;
    notes: string | null;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface SponsoredJob {
    id: string;
    sponsor_id: string;
    title: string;
    location_city: string | null;
    job_type: string | null;
    requirements: string | null;
    source_url: string;
    status: string;
    created_at: string;
    updated_at: string;
    sponsor?: SponsorOrganization;
}

export const SEED_COUNTRIES: Country[] = [
    {
        code: "UK",
        name: "United Kingdom",
        flag: "🇬🇧",
        authority: "Home Office",
        website: "https://www.gov.uk/browse/visas-immigration",
        tracked: 6,
        updates: 12,
        visa_types: ["Skilled Worker Visa", "Student Visa", "Graduate Visa", "Family Visa", "Global Talent Visa", "Settlement / ILR"],
        slug: "uk",
    },
    {
        code: "CA",
        name: "Canada",
        flag: "🇨🇦",
        authority: "IRCC",
        website: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
        tracked: 8,
        updates: 9,
        visa_types: ["Express Entry", "PNP", "Study Permit", "PGWP", "Family Sponsorship", "LMIA Work Permit", "Start-up Visa", "Caregiver"],
        slug: "canada",
    },
    {
        code: "AU",
        name: "Australia",
        flag: "🇦🇺",
        authority: "Home Affairs",
        website: "https://immi.homeaffairs.gov.au/",
        tracked: 5,
        updates: 7,
        visa_types: ["Subclass 482", "Subclass 186", "Subclass 500", "Subclass 189", "Subclass 190"],
        slug: "australia",
    },
    {
        code: "DE",
        name: "Germany",
        flag: "🇩🇪",
        authority: "BAMF",
        website: "https://www.make-it-in-germany.com/",
        tracked: 4,
        updates: 5,
        visa_types: ["Blue Card EU", "Job Seeker Visa", "Skilled Worker Visa", "Student Visa"],
        slug: "germany",
    },
    {
        code: "US",
        name: "United States",
        flag: "🇺🇸",
        authority: "USCIS",
        website: "https://www.uscis.gov/",
        tracked: 9,
        updates: 14,
        visa_types: ["H-1B", "H-2B", "L-1", "O-1", "EB-1", "EB-2", "EB-3", "F-1", "Green Card"],
        slug: "us",
    },
    {
        code: "IE",
        name: "Ireland",
        flag: "🇮🇪",
        authority: "Department of Enterprise, Trade and Employment",
        website: "https://enterprise.gov.ie/",
        tracked: 35,
        updates: 3,
        visa_types: ["General Employment Permit", "Critical Skills Employment Permit", "Working Holiday"],
        slug: "ireland",
    },
];

export const SEED_CHANGES: ImmigrationChange[] = [
    {
        id: "uk-sw-2026",
        country: "United Kingdom",
        country_code: "UK",
        flag: "🇬🇧",
        visa_type: "Skilled Worker Visa",
        category: "Employment",
        title: "Salary threshold raised to £30,000",
        description: "The Home Office has updated the minimum salary requirement for Skilled Worker visa sponsorship.",
        long_description: "The UK Home Office has published updated Immigration Rules raising the general minimum salary requirement for Skilled Worker visa sponsorship. The change affects all new applications and sponsor licence assignments from the effective date. Existing Skilled Worker holders extending or changing employer are not immediately affected but should confirm compliance with the new going rate for their occupation code.",
        previous_rule: "Minimum salary £26,200 per year (or going rate for the occupation).",
        new_rule: "Minimum salary £30,000 per year (or going rate for the occupation, whichever is higher).",
        effective_date: "2026-09-01",
        announcement_date: "2026-07-21",
        source_url: "https://www.gov.uk/skilled-worker-visa",
        source_name: "Home Office",
        status: "urgent",
        impact: "Future applicants & sponsors",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Applies to Certificates of Sponsorship assigned on or after 1 September 2026.",
            "Going rate percentiles for shortage occupations remain at 80%.",
            "No transitional arrangements announced for pending applications."
        ]
    },
    {
        id: "ca-ee-2026",
        country: "Canada",
        country_code: "CA",
        flag: "🇨🇦",
        visa_type: "Express Entry",
        category: "Permanent Residence",
        title: "New category-based draws for healthcare",
        description: "IRCC introduces targeted draws prioritising healthcare and STEM occupations.",
        long_description: "Immigration, Refugees and Citizenship Canada (IRCC) is introducing new category-based Express Entry rounds of invitations that prioritise candidates with experience in healthcare, STEM, skilled trades, transport and agriculture. The new draws run alongside general CRS rounds and target 2026 admissions levels.",
        previous_rule: "General Comprehensive Ranking System (CRS) draws only, held roughly every two weeks.",
        new_rule: "Category-based draws every two weeks, alternating with general CRS rounds.",
        effective_date: "2026-08-15",
        announcement_date: "2026-07-18",
        source_url: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
        source_name: "IRCC",
        status: "approved",
        impact: "Skilled worker candidates",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Requires at least 6 months of continuous full-time work in a qualifying NOC.",
            "Candidates must still meet minimum CRS score cut-off for each draw.",
            "Language proficiency requirements unchanged."
        ]
    },
    {
        id: "au-482-2026",
        country: "Australia",
        country_code: "AU",
        flag: "🇦🇺",
        visa_type: "Subclass 482",
        category: "Employment",
        title: "TSMIT increased to AUD 73,150",
        description: "Temporary Skilled Migration Income Threshold updated for the new financial year.",
        long_description: "The Australian Department of Home Affairs has indexed the Temporary Skilled Migration Income Threshold (TSMIT) for the 2026-27 financial year. New nominations from the effective date must meet the higher threshold, alongside the market salary rate for the occupation.",
        previous_rule: "TSMIT AUD 70,000 per annum.",
        new_rule: "TSMIT AUD 73,150 per annum.",
        effective_date: "2026-07-01",
        announcement_date: "2026-06-10",
        source_url: "https://immi.homeaffairs.gov.au/",
        source_name: "Department of Home Affairs",
        status: "warning",
        impact: "Employer sponsors",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Applies to new nomination applications from 1 July 2026.",
            "Existing 482 holders unaffected until their next renewal.",
            "Market salary rate assessment still required."
        ]
    },
    {
        id: "de-bc-2026",
        country: "Germany",
        country_code: "DE",
        flag: "🇩🇪",
        visa_type: "Blue Card EU",
        category: "Employment",
        title: "Salary threshold lowered for shortage occupations",
        description: "Germany expands Blue Card access with lower salary bars for shortage roles.",
        long_description: "Germany's Federal Office for Migration and Refugees (BAMF) confirmed updated Blue Card EU thresholds as part of the ongoing Skilled Immigration Act reforms. The reduction is aimed at accelerating recruitment in IT, healthcare and engineering shortage occupations.",
        previous_rule: "€45,300 general threshold; €41,041 shortage occupations.",
        new_rule: "€41,041 general; €36,672 shortage occupations.",
        effective_date: "2026-06-01",
        announcement_date: "2026-05-20",
        source_url: "https://www.make-it-in-germany.com/",
        source_name: "BAMF",
        status: "approved",
        impact: "Skilled foreign workers",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Applies to new Blue Card applications submitted from 1 June 2026.",
            "Recognition of foreign qualifications remains required.",
            "Family reunification rules unchanged."
        ]
    },
    {
        id: "us-h1b-2026",
        country: "United States",
        country_code: "US",
        flag: "🇺🇸",
        visa_type: "H-1B",
        category: "Employment",
        title: "Registration fee increased to $215",
        description: "USCIS raises H-1B electronic registration fee ahead of FY2027 cap season.",
        long_description: "U.S. Citizenship and Immigration Services (USCIS) has finalised a rule raising the H-1B electronic registration fee. The new fee applies to all registrants participating in the FY2027 cap season.",
        previous_rule: "Registration fee $10 per beneficiary.",
        new_rule: "Registration fee $215 per beneficiary.",
        effective_date: "2026-03-01",
        announcement_date: "2026-02-02",
        source_url: "https://www.uscis.gov/",
        source_name: "USCIS",
        status: "warning",
        impact: "H-1B petitioners",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Applies to the FY2027 initial registration period.",
            "Beneficiary-centric selection process retained.",
            "Filing fees for approved I-129 petitions unchanged in this update."
        ]
    },
    {
        id: "ie-cs-2026",
        country: "Ireland",
        country_code: "IE",
        flag: "🇮🇪",
        visa_type: "Critical Skills Permit",
        category: "Employment",
        title: "Occupations list expanded",
        description: "20 new roles added to the Critical Skills Occupations List including AI engineers.",
        long_description: "Ireland's Department of Enterprise, Trade and Employment (DETE) has published its 2026 review of the employment permits occupation lists, adding new roles to the Critical Skills Occupations List.",
        previous_rule: "2024 Critical Skills Occupations List with 60 eligible roles.",
        new_rule: "2026 list with 80 eligible roles, adding AI, cyber and healthcare positions.",
        effective_date: "2026-07-10",
        announcement_date: "2026-07-01",
        source_url: "https://enterprise.gov.ie/",
        source_name: "DETE",
        status: "info",
        impact: "Tech & healthcare workers",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Applies to new Critical Skills Employment Permit applications.",
            "Minimum annual remuneration criteria remain in force.",
            "Two-year stamp before eligibility for Stamp 4 unchanged."
        ]
    },
    {
        id: "uk-student-2026",
        country: "United Kingdom",
        country_code: "UK",
        flag: "🇬🇧",
        visa_type: "Student Visa",
        category: "Study",
        title: "Dependant restrictions extended to research masters",
        description: "Home Office widens dependant restrictions to include most taught research masters courses.",
        long_description: "Following the January 2024 restrictions on dependants for taught masters, the Home Office is extending the restriction to selected research masters programmes. PhD candidates remain able to bring dependants.",
        previous_rule: "Dependants restricted only for taught masters shorter than 9 months.",
        new_rule: "Dependants restricted for taught and non-doctoral research masters programmes.",
        effective_date: "2026-10-01",
        announcement_date: "2026-06-15",
        source_url: "https://www.gov.uk/student-visa",
        source_name: "Home Office",
        status: "urgent",
        impact: "International students",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Effective for CAS assigned from 1 October 2026.",
            "PhD, research doctorate and government-sponsored students exempt.",
            "Existing dependants can extend in line with the main applicant."
        ]
    },
    {
        id: "ca-pgwp-2026",
        country: "Canada",
        country_code: "CA",
        flag: "🇨🇦",
        visa_type: "Post-Graduation Work Permit",
        category: "Study",
        title: "PGWP tightened to eligible field lists",
        description: "IRCC restricts PGWP eligibility to graduates of programmes tied to labour-market shortage fields.",
        long_description: "New IRCC policy limits PGWP eligibility for non-degree college programmes to those aligned with 966 designated fields of study linked to long-term labour shortages.",
        previous_rule: "PGWP available to graduates of most eligible DLI programmes.",
        new_rule: "Non-degree college graduates must have studied one of 966 designated fields.",
        effective_date: "2026-05-15",
        announcement_date: "2026-03-20",
        source_url: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
        source_name: "IRCC",
        status: "warning",
        impact: "International college students",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Bachelor, masters and doctoral graduates unaffected.",
            "Field lists reviewed annually by IRCC.",
            "Language testing requirement retained."
        ]
    },
    {
        id: "uk-gt-2026",
        country: "United Kingdom",
        country_code: "UK",
        flag: "🇬🇧",
        visa_type: "Global Talent Visa",
        category: "Employment",
        title: "Endorsement route simplified",
        description: "The Tech Nation endorsement route has been fully transitioned to the new digital hub, reducing processing times.",
        long_description: "The Home Office and endorsing bodies have officially rolled out the fully digital endorsement processing hub for the Global Talent Visa. Applicants now benefit from streamlined evidence submission and faster turnaround times.",
        previous_rule: "Paper-heavy endorsement pathways taking up to 8 weeks.",
        new_rule: "100% digital submission with average decisions in 3 weeks.",
        effective_date: "2026-06-15",
        announcement_date: "2026-06-01",
        source_url: "https://www.gov.uk/global-talent-visa",
        source_name: "Home Office",
        status: "approved",
        impact: "Highly skilled applicants",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Fully digital endorsement upload portal.",
            "Average wait times reduced by 5 weeks.",
            "No changes to eligibility criteria."
        ]
    },
    {
        id: "us-eb2-2026",
        country: "United States",
        country_code: "US",
        flag: "🇺🇸",
        visa_type: "EB-2",
        category: "Permanent Residence",
        title: "Priority dates freeze announced",
        description: "USCIS signals a temporary freeze on EB-2 priority date advancement due to unprecedented cap demands.",
        long_description: "The State Department visa bulletin confirms that the EB-2 category will experience a stagnation in priority dates for the remainder of FY2026.",
        previous_rule: "Priority dates advanced steadily by 2-3 weeks per month.",
        new_rule: "Dates held steady at May 2023 for Rest of World.",
        effective_date: "2026-07-01",
        announcement_date: "2026-06-15",
        source_url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
        source_name: "Department of State",
        status: "warning",
        impact: "Employment-based applicants",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Affects adjustment of status applicants currently in the US.",
            "Premium processing remains available for I-140s.",
            "Next movement expected in October."
        ]
    },
    {
        id: "ca-cit-2026",
        country: "Canada",
        country_code: "CA",
        flag: "🇨🇦",
        visa_type: "Citizenship",
        category: "Citizenship",
        title: "Digital oath taking expanded",
        description: "IRCC rolls out 1-click digital oaths for new citizens.",
        long_description: "IRCC has officially modernised the citizenship ceremony process by making the digital oath legally binding via the portal, bypassing the need for scheduled video ceremonies.",
        previous_rule: "Virtual video ceremonies requiring scheduling.",
        new_rule: "On-demand digital signature for oath taking.",
        effective_date: "2026-06-30",
        announcement_date: "2026-06-05",
        source_url: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
        source_name: "IRCC",
        status: "info",
        impact: "Citizenship applicants",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Optional for all approved candidates.",
            "Reduces backlog processing.",
            "Physical ceremonies still available on request."
        ]
    },
    {
        id: "au-189-2026",
        country: "Australia",
        country_code: "AU",
        flag: "🇦🇺",
        visa_type: "Subclass 189",
        category: "Permanent Residence",
        title: "Points test restructured",
        description: "Home Affairs has heavily weighted regional study and partner English skills.",
        long_description: "In an effort to disperse skilled migrants, the Subclass 189 visa points test has been recalibrated. Studying in a designated regional area now awards double points, and partner English competency is heavily incentivised.",
        previous_rule: "Regional study: 5 points. Partner English: 5 points.",
        new_rule: "Regional study: 10 points. Partner English: 10 points.",
        effective_date: "2026-07-15",
        announcement_date: "2026-06-25",
        source_url: "https://immi.homeaffairs.gov.au/",
        source_name: "Home Affairs",
        status: "warning",
        impact: "Skilled independent candidates",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Grandfathering provisions apply to existing EOIs.",
            "Maximum points remain capped.",
            "Designed to alleviate metropolitan housing stress."
        ]
    },
    {
        id: "de-chk-2026",
        country: "Germany",
        country_code: "DE",
        flag: "🇩🇪",
        visa_type: "Job Seeker Visa",
        category: "Employment",
        title: "Chancenkarte portal launch",
        description: "The fully digital Opportunity Card portal goes live globally.",
        long_description: "Following its legislative launch, the fully integrated digital portal for the Chancenkarte (Opportunity Card) is now accessible, allowing applicants to calculate points and apply entirely online.",
        previous_rule: "Paper applications at local consulates.",
        new_rule: "Digital portal with integrated points calculator.",
        effective_date: "2026-06-05",
        announcement_date: "2026-06-01",
        source_url: "https://www.make-it-in-germany.com/",
        source_name: "BAMF",
        status: "approved",
        impact: "Job seekers",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Instant pre-approval certificates available.",
            "Integrated with Federal Employment Agency database.",
            "Streamlines consulate processing."
        ]
    },
    {
        id: "ie-gep-2026",
        country: "Ireland",
        country_code: "IE",
        flag: "🇮🇪",
        visa_type: "General Employment Permit",
        category: "Employment",
        title: "Processing times halved",
        description: "DETE clearing backlogs with new automated triage system.",
        long_description: "The Department of Enterprise, Trade and Employment has successfully deployed an automated triage system that has effectively halved the processing times for standard General Employment Permits.",
        previous_rule: "Processing times averaging 12 weeks.",
        new_rule: "Processing times averaging 6 weeks.",
        effective_date: "2026-07-10",
        announcement_date: "2026-06-20",
        source_url: "https://enterprise.gov.ie/",
        source_name: "DETE",
        status: "approved",
        impact: "Irish employers & foreign workers",
        reviewed_by: "Radar Editorial",
        key_points: [
            "Standard applicants heavily benefit.",
            "Trusted Partner wait times reduced to 2 weeks.",
            "Applies immediately to pending applications."
        ]
    }
];

export const SEED_TIMELINE: TimelineEvent[] = [
    { year: "2023", title: "Salary threshold £26,200", body: "Baseline Skilled Worker minimum salary set." },
    { year: "2024", title: "Health surcharge increased", body: "IHS rose from £624 to £1,035 per year." },
    { year: "2025", title: "Threshold raised to £38,700", body: "Major shift for new Skilled Worker applications." },
    { year: "2026", title: "Settlement reforms proposed", body: "Consultation on 10-year qualifying period underway." },
];

export async function fetchSponsors(countryCode?: string): Promise<SponsorOrganization[]> {
    try {
        let query = (supabase as any).from("sponsor_organizations").select("*").order("name", { ascending: true });
        if (countryCode) {
            query = query.eq("country_code", countryCode);
        }
        const { data, error } = await query;
        if (error) {
            console.error("Error fetching sponsors:", error);
            return [];
        }
        return Array.isArray(data) ? (data as SponsorOrganization[]) : [];
    } catch (e) {
        console.error("fetchSponsors exception:", e);
        return [];
    }
}

export async function fetchSponsorById(id: string): Promise<SponsorOrganization | null> {
    try {
        const { data, error } = await (supabase as any).from("sponsor_organizations").select("*").eq("id", id).maybeSingle();
        if (error) {
            console.error("Error fetching sponsor:", error);
            return null;
        }
        return (data as SponsorOrganization) || null;
    } catch (e) {
        console.error("fetchSponsorById exception:", e);
        return null;
    }
}

export async function fetchSponsorBySlug(slug: string): Promise<SponsorOrganization | null> {
    try {
        const { data, error } = await (supabase as any).from("sponsor_organizations").select("*").eq("slug", slug).maybeSingle();
        if (error) {
            console.error("Error fetching sponsor by slug:", error);
            return null;
        }
        return (data as SponsorOrganization) || null;
    } catch (e) {
        console.error("fetchSponsorBySlug exception:", e);
        return null;
    }
}

export async function fetchJobs(countryCode?: string): Promise<SponsoredJob[]> {
    try {
        let query = (supabase as any).from("sponsored_jobs").select("*, sponsor:sponsor_organizations(*)").order("created_at", { ascending: false });
        const { data, error } = await query;
        if (error) {
            console.error("Error fetching jobs:", error);
            return [];
        }
        let jobs = Array.isArray(data) ? (data as SponsoredJob[]) : [];
        if (countryCode) {
            jobs = jobs.filter(j => j.sponsor?.country_code === countryCode);
        }
        return jobs;
    } catch (e) {
        console.error("fetchJobs exception:", e);
        return [];
    }
}

export async function fetchJobById(id: string): Promise<SponsoredJob | null> {
    try {
        const { data, error } = await (supabase as any).from("sponsored_jobs").select("*, sponsor:sponsor_organizations(*)").eq("id", id).maybeSingle();
        if (error) {
            console.error("Error fetching job:", error);
            return null;
        }
        return (data as SponsoredJob) || null;
    } catch (e) {
        console.error("fetchJobById exception:", e);
        return null;
    }
}

export async function fetchChanges(): Promise<ImmigrationChange[]> {
    try {
        const { data, error } = await (supabase as any).from("immigration_changes").select("*").order("effective_date", { ascending: false });
        if (error || !data || data.length === 0) {
            if (error) console.error("Error fetching immigration changes, using fallback seed data:", error);
            return SEED_CHANGES;
        }
        return data as ImmigrationChange[];
    } catch (e) {
        console.error("fetchChanges exception, using fallback seed data:", e);
        return SEED_CHANGES;
    }
}

export async function fetchChangesByCountry(countryName: string): Promise<ImmigrationChange[]> {
    try {
        const { data, error } = await (supabase as any).from("immigration_changes").select("*").eq("country", countryName).order("effective_date", { ascending: false });
        if (error || !data || data.length === 0) {
            const fallback = SEED_CHANGES.filter(c => c.country.toLowerCase() === countryName.toLowerCase());
            return fallback.length > 0 ? fallback : SEED_CHANGES.slice(0, 3);
        }
        return data as ImmigrationChange[];
    } catch (e) {
        console.error("fetchChangesByCountry exception, using fallback:", e);
        return SEED_CHANGES.filter(c => c.country.toLowerCase() === countryName.toLowerCase());
    }
}

export async function fetchChangeById(id: string): Promise<ImmigrationChange | null> {
    try {
        const { data, error } = await (supabase as any).from("immigration_changes").select("*").eq("id", id).maybeSingle();
        if (error || !data) {
            const fallback = SEED_CHANGES.find(c => c.id === id);
            return fallback || null;
        }
        return data as ImmigrationChange;
    } catch (e) {
        console.error("fetchChangeById exception, searching fallback:", e);
        return SEED_CHANGES.find(c => c.id === id) || null;
    }
}

export async function fetchCountries(): Promise<Country[]> {
    try {
        const { data, error } = await (supabase as any).from("countries").select("*").order("name", { ascending: true });
        if (error || !data || data.length === 0) {
            if (error) console.error("Error fetching countries, using fallback seed data:", error);
            return SEED_COUNTRIES;
        }
        return data as Country[];
    } catch (e) {
        console.error("fetchCountries exception, using fallback seed data:", e);
        return SEED_COUNTRIES;
    }
}

export async function fetchCountryBySlug(slug: string): Promise<Country | null> {
    try {
        const { data, error } = await (supabase as any).from("countries").select("*").eq("slug", slug.toLowerCase()).maybeSingle();
        if (error || !data) {
            const fallback = SEED_COUNTRIES.find(c => c.slug.toLowerCase() === slug.toLowerCase() || c.code.toLowerCase() === slug.toLowerCase());
            return fallback || null;
        }
        return data as Country;
    } catch (e) {
        console.error("fetchCountryBySlug exception, searching fallback:", e);
        return SEED_COUNTRIES.find(c => c.slug.toLowerCase() === slug.toLowerCase() || c.code.toLowerCase() === slug.toLowerCase()) || null;
    }
}

export async function fetchCountryPages(countryCode: string): Promise<CountryPage[]> {
    try {
        const { data, error } = await (supabase as any).from("country_pages").select("*").eq("country_code", countryCode).eq("is_published", true).order("title");
        if (error) {
            console.error("Error fetching country pages:", error);
            return [];
        }
        return Array.isArray(data) ? (data as CountryPage[]) : [];
    } catch (e) {
        console.error("fetchCountryPages exception:", e);
        return [];
    }
}

export async function fetchPageBySlug(countryCode: string, slug: string): Promise<CountryPage | null> {
    try {
        const { data, error } = await (supabase as any).from("country_pages").select("*").eq("country_code", countryCode).eq("slug", slug).maybeSingle();
        if (error) {
            console.error("Error fetching page by slug:", error);
            return null;
        }
        return (data as CountryPage) || null;
    } catch (e) {
        console.error("fetchPageBySlug exception:", e);
        return null;
    }
}

export async function fetchTimeline(): Promise<TimelineEvent[]> {
    try {
        const { data, error } = await (supabase as any).from("timelines").select("*").order("year", { ascending: true });
        if (error || !data || data.length === 0) {
            return SEED_TIMELINE;
        }
        return data as TimelineEvent[];
    } catch (e) {
        console.error("fetchTimeline exception, using fallback:", e);
        return SEED_TIMELINE;
    }
}

const baseStatusStyles: Record<ChangeStatus, { label: string; dot: string; badge: string }> = {
    urgent: { label: "Urgent", dot: "bg-[color:var(--danger)]", badge: "bg-[color:var(--danger)]/15 text-[color:var(--danger)] border-[color:var(--danger)]/30" },
    warning: { label: "Warning", dot: "bg-[color:var(--warning)]", badge: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30" },
    approved: { label: "Approved", dot: "bg-[color:var(--success)]", badge: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30" },
    info: { label: "Info", dot: "bg-[color:var(--info)]", badge: "bg-[color:var(--info)]/15 text-[color:var(--info)] border-[color:var(--info)]/30" },
};

// Safe Proxy so accessing any status (uppercase, null, undefined, unknown) never returns undefined
export const statusStyles: Record<ChangeStatus, { label: string; dot: string; badge: string }> = new Proxy(
    baseStatusStyles,
    {
        get(target, prop: string) {
            if (typeof prop !== "string") return target.info;
            const key = prop.toLowerCase().trim() as ChangeStatus;
            return target[key] || target.info;
        },
    }
);

export function formatDate(d?: string | null) {
    if (!d) return "";
    try {
        const parsed = new Date(d);
        if (isNaN(parsed.getTime())) return d;
        return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
        return d;
    }
}

export async function getFilterOptions() {
    try {
        const changes = await fetchChanges();
        const allCategories = Array.from(new Set(changes.map(c => c.category).filter(Boolean)));
        const allVisaTypes = Array.from(new Set(changes.map(c => c.visa_type).filter(Boolean)));
        const allCountries = Array.from(new Set(changes.map(c => c.country).filter(Boolean)));
        const allStatuses: ChangeStatus[] = ["urgent", "warning", "approved", "info"];

        return {
            categories: allCategories,
            visaTypes: allVisaTypes,
            countries: allCountries,
            statuses: allStatuses
        };
    } catch (e) {
        console.error("getFilterOptions exception:", e);
        return {
            categories: ["Employment", "Study", "Permanent Residence", "Citizenship"],
            visaTypes: ["Skilled Worker Visa", "Express Entry", "Subclass 482", "Blue Card EU", "H-1B"],
            countries: ["United Kingdom", "Canada", "Australia", "Germany", "United States", "Ireland"],
            statuses: ["urgent", "warning", "approved", "info"] as ChangeStatus[]
        };
    }
}
