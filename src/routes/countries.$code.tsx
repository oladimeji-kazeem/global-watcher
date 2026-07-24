import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { fetchCountries } from "@/lib/data-service";
import { AppSidebarLayout } from "@/components/site-shell";
import { ArrowLeft, Briefcase, TrendingUp, Lightbulb, GraduationCap, Building2 } from "lucide-react";

export const Route = createFileRoute("/countries/$code")({
    loader: async ({ params }) => {
        const countries = await fetchCountries();
        const country = countries.find(c => c.code.toLowerCase() === params.code.toLowerCase());
        if (!country) throw notFound();
        return { country };
    },
    component: CountryStrategyPage
});

// Hardcoded deterministic intelligence based on country code (Mockup)
const mockIntelligence = (code: string) => {
    switch (code.toUpperCase()) {
        case 'GB': return {
            opportunities: "Strong demand in healthcare, tech, and engineering. The Global Talent route remains highly favorable for researchers.",
            risks: "Salary threshold increases for Skilled Worker visas restrict access for entry-level roles. NHS surcharges heavily impact families.",
            pathways: ["Skilled Worker Route", "Global Talent Endorsement", "Innovator Founder"]
        }
        case 'CA': return {
            opportunities: "Provincial Nominee Programs (PNPs) offer targeted pathways. Tech workers heavily recruited in BC and Ontario.",
            risks: "Recent caps on international student intake. Express Entry points (CRS) cutoffs remain historically high.",
            pathways: ["Express Entry (Federal)", "Provincial Nominee (PNP)", "Post-Graduation Work Permit (PGWP)"]
        }
        case 'AU': return {
            opportunities: "Regional visas offer relaxed requirements. Critical skills list constantly updated to favor trades and medicine.",
            risks: "Stricter English language requirements introduced enforcing higher IELTS/PTE scores. Temporary visa extensions restricted.",
            pathways: ["Subclass 189 (Independent)", "Subclass 190 (Nominated)", "Subclass 482 (TSS)"]
        }
        default: return {
            opportunities: "Emerging frameworks prioritize highly skilled tech workers and investors. Focus on regional development.",
            risks: "Processing delays reaching historic highs across diplomatic missions. Stringent financial sponsor requirements.",
            pathways: ["Skilled Sponsorship", "Investor / Entrepreneur", "Digital Nomad"]
        }
    }
}

function CountryStrategyPage() {
    const { country } = Route.useLoaderData();
    const intel = mockIntelligence(country.code);

    return (
        <AppSidebarLayout>
            <main>

                {/* Header Section */}
                <div className="mx-auto max-w-5xl px-6 pt-10 pb-8">
                    <Link to="/countries" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition mb-6">
                        <ArrowLeft className="h-4 w-4" /> Back to Countries
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-20 w-20 rounded-2xl bg-black/40 border border-border flex items-center justify-center text-5xl shadow-elegant backdrop-blur-md">
                                {country.flag}
                            </div>
                            <div>
                                <div className="text-[10px] font-bold tracking-[0.2em] text-[color:var(--primary)] mb-1.5 uppercase flex items-center gap-2">
                                    <Building2 className="h-3 w-3" /> {country.authority}
                                </div>
                                <h1 className="text-4xl font-semibold tracking-tight text-white">{country.name}</h1>
                                <p className="text-muted-foreground font-medium mt-1">Strategic Immigration & Policy Intelligence</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mx-auto max-w-5xl px-6 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-[color:var(--success)]/20 bg-card/40 backdrop-blur-md p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase className="h-24 w-24 text-[color:var(--success)]" /></div>
                            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[color:var(--success)] mb-4 bg-[color:var(--success)]/10 px-3 py-1 rounded-full border border-[color:var(--success)]/20">
                                <TrendingUp className="h-3 w-3" /> Core Opportunities
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Strategic Advantages</h3>
                            <p className="text-foreground/80 leading-relaxed font-medium">{intel.opportunities}</p>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Lightbulb className="h-24 w-24 text-white" /></div>
                            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-4 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                                <TrendingUp className="h-3 w-3 rotate-180" /> Policy Risks & Friction
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Threat Vectors</h3>
                            <p className="text-foreground/80 leading-relaxed font-medium">{intel.risks}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
                        <div className="border-b border-border/40 px-6 py-5 bg-black/20">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-[color:var(--primary)]" /> Primary Entry Pathways
                            </h2>
                        </div>
                        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/40 text-center">
                            {intel.pathways.map((path, i) => (
                                <div key={i} className="p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.02] transition">
                                    <div className="h-10 w-10 rounded-full bg-[color:var(--primary)]/10 border border-[color:var(--primary)]/20 text-[color:var(--primary)] flex items-center justify-center font-bold font-display">
                                        0{i + 1}
                                    </div>
                                    <div className="font-semibold text-white text-[15px]">{path}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </AppSidebarLayout>
    );
}
