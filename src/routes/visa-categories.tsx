import { createFileRoute } from "@tanstack/react-router";
import { AppSidebarLayout } from "@/components/site-shell";
import { useState } from "react";

export const Route = createFileRoute("/visa-categories")({
  component: VisaCategoriesPage,
});

const countries = [
  { id: 'GB', flag: 'GB', name: 'United Kingdom' },
  { id: 'CA', flag: 'CA', name: 'Canada' },
  { id: 'AU', flag: 'AU', name: 'Australia' },
  { id: 'DE', flag: 'DE', name: 'Germany' },
  { id: 'US', flag: 'US', name: 'United States' },
  { id: 'IE', flag: 'IE', name: 'Ireland' },
];

const visaData: Record<string, Array<{ title: string, fee: string, processing: string, requirements: string, url: string }>> = {
  'GB': [
    { title: 'Skilled Worker Visa', fee: '£719–£1,639', processing: '3–8 weeks', requirements: 'Job offer from licensed sponsor, salary threshold, English language', url: 'https://www.gov.uk/skilled-worker-visa' },
    { title: 'Student Visa', fee: '£490', processing: '3 weeks', requirements: 'CAS from licensed institution, financial evidence', url: 'https://www.gov.uk/student-visa' },
    { title: 'Graduate Visa', fee: '£822', processing: '8 weeks', requirements: 'Completed UK degree, valid Student visa', url: 'https://www.gov.uk/graduate-visa' },
    { title: 'Family Visa', fee: '£1,938', processing: '12 weeks', requirements: 'Relationship evidence, financial requirement', url: 'https://www.gov.uk/uk-family-visa' },
    { title: 'Global Talent Visa', fee: '£766', processing: '3 weeks', requirements: 'Endorsement from approved body', url: 'https://www.gov.uk/global-talent' },
    { title: 'Settlement / ILR', fee: '£3,029', processing: '6 months', requirements: '5 years continuous residence, Life in the UK test', url: 'https://www.gov.uk/indefinite-leave-to-remain' }
  ],
  'CA': [
    { title: 'Express Entry', fee: '$1,365 CAD', processing: '6 months', requirements: 'Comprehensive Ranking System score, medical exam', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html' },
    { title: 'Study Permit', fee: '$150 CAD', processing: '9-12 weeks', requirements: 'Letter of Acceptance, proof of financial support', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html' },
    { title: 'Post-Graduation Work Permit', fee: '$255 CAD', processing: '10 weeks', requirements: 'Graduated from designated learning institution', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html' }
  ],
  'AU': [
    { title: 'Subclass 482 (TSS)', fee: '$1,455 - $3,035 AUD', processing: '2-5 months', requirements: 'Sponsored by approved employer, skill assessment', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482' },
    { title: 'Subclass 189 (Independent)', fee: '$4,640 AUD', processing: '12-14 months', requirements: 'Points tested, occupation on MLTSSL skill list', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189' },
    { title: 'Subclass 190 (State Nominated)', fee: '$4,640 AUD', processing: '10-12 months', requirements: 'Nominated by Australian state or territory government', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190' },
    { title: 'Subclass 500 (Student)', fee: '$710 AUD', processing: '4-8 weeks', requirements: 'Confirmation of Enrolment (CoE), Genuine Student test', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500' }
  ],
  'DE': [
    { title: 'EU Blue Card', fee: '€113', processing: '4-8 weeks', requirements: 'University degree, job offer meeting salary threshold', url: 'https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card' },
    { title: 'Opportunity Card (Chancenkarte)', fee: '€75', processing: '4-6 weeks', requirements: 'Points-based job seeker visa, B1 German or B2 English', url: 'https://www.make-it-in-germany.com/en/visa-residence/types/opportunity-card' },
    { title: 'Freelance Visa', fee: '€100', processing: '2-4 months', requirements: 'Business plan, financial backing, client letters (if in Germany)', url: 'https://www.make-it-in-germany.com/en/visa-residence/types/freelance-self-employed' }
  ],
  'US': [
    { title: 'H-1B Specialty Occupation', fee: '$460 + $10 Registration', processing: '2-6 months', requirements: 'Bachelor\'s degree, employer sponsorship, lottery selection', url: 'https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations' },
    { title: 'L-1 Intracompany Transferee', fee: '$460', processing: '2-4 months', requirements: 'Must have worked 1 continuous year abroad for the company', url: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager' },
    { title: 'O-1 Extraordinary Ability', fee: '$460', processing: '2-3 months', requirements: 'Sustained national or international acclaim, extensive documentation', url: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement' },
    { title: 'F-1 Student Visa', fee: '$185 + $350 SEVIS', processing: '2-4 weeks', requirements: 'Accepted at SEVP approved school, financial support proof', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
    { title: 'EB-2 NIW (Green Card)', fee: '$715 + form fees', processing: '12-18 months', requirements: 'Advanced degree, endeavor of national interest', url: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2' }
  ],
  'IE': [
    { title: 'Critical Skills Employment Permit', fee: '€1,000', processing: '1-2 months', requirements: 'Job offer over €38,000 in eligible occupation list', url: 'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/' },
    { title: 'General Employment Permit', fee: '€1,000', processing: '2-3 months', requirements: 'Job offer over €34,000, subject to labor market needs test', url: 'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/general-employment-permit/' },
    { title: 'Stamp 1G (Graduate)', fee: '€300 (Registration)', processing: '3-4 weeks', requirements: 'Graduated from Irish higher education institution', url: 'https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/' }
  ]
};

function VisaCategoriesPage() {
  const [activeCountry, setActiveCountry] = useState('GB');

  const visas = visaData[activeCountry] || [];

  return (
    <AppSidebarLayout>
      <main>
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[color:var(--primary)]/90 mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" /> LIVE MONITORING &middot; 6 JURISDICTIONS
            </div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[color:var(--primary)] mb-1 flex items-center gap-2">
              REFERENCE DATA
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Visa categories</h1>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 mb-8 mt-2">
          <div className="flex flex-wrap items-center gap-3">
            {countries.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCountry(c.id)}
                className={`flex items-center gap-2 px-4 py-2 text-[15px] rounded-lg border font-medium transition ${activeCountry === c.id ? 'border-[color:var(--primary)] text-white bg-[color:var(--primary)]/10 shadow-[0_0_20px_rgba(45,160,153,0.15)]' : 'border-border/60 text-muted-foreground hover:border-border hover:text-white'}`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">{c.flag}</span> {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24">
          {visas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visas.map((v, i) => (
                <a key={i} href={v.url} target="_blank" rel="noreferrer" className="rounded-xl border border-border/40 bg-card/20 backdrop-blur-md p-6 hover:bg-white/[0.05] hover:border-border transition flex flex-col group">
                  <h3 className="text-[17px] font-semibold text-white mb-5 flex items-center justify-between">
                    {v.title}
                    <svg className="h-4 w-4 text-muted-foreground group-hover:text-[color:var(--primary)] transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
                  </h3>
                  <div className="space-y-3 flex-1 text-[13px]">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-20 shrink-0">Fee:</span>
                      <span className="text-foreground/90 font-medium">{v.fee}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-20 shrink-0">Processing:</span>
                      <span className="text-foreground/90 font-medium">{v.processing}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-20 shrink-0">Requirements:</span>
                      <span className="text-foreground/90 leading-[1.6] font-medium">{v.requirements}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/20 backdrop-blur-md p-12 text-center text-muted-foreground/80">
              Reference data for {countries.find(c => c.id === activeCountry)?.name} is currently being mapped into our database. Check back soon.
            </div>
          )}
        </div>
      </main>
    </AppSidebarLayout>
  );
}
