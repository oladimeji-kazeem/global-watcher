import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchCountryBySlug, fetchSponsorBySlug } from "@/lib/data-service";
import { PageHeader, PageShell } from "@/components/site-shell";
import { Building2, Globe2, Briefcase, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/$countrySlug/company/$companySlug")({
  loader: async ({ params }) => {
    const country = await fetchCountryBySlug(params.countrySlug);
    if (!country) throw notFound();
    const sponsor = await fetchSponsorBySlug(params.companySlug);
    if (!sponsor || sponsor.country_code !== country.code) throw notFound();
    return { country, sponsor };
  },
  component: CompanyDetailsPage,
});

function CompanyDetailsPage() {
  const { country, sponsor } = Route.useLoaderData();

  return (
    <PageShell>
      <div className="pt-10 px-6 max-w-7xl mx-auto">
        <Link to="/$countrySlug/sponsors" params={{ countrySlug: country.slug }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Sponsors
        </Link>
      </div>
      <PageHeader 
        eyebrow="Company Profile" 
        title={sponsor.name}
        description={sponsor.industry || 'Verified Visa Sponsor'}
        action={
          sponsor.website_url ? (
            <a href={sponsor.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 backdrop-blur px-5 py-3 hover:bg-card transition">
              <Globe2 className="h-4 w-4" /> Visit Website
            </a>
          ) : null
        }
      />
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          <div className="space-y-8">
            <div className="rounded-3xl border border-border bg-card-gradient p-8 space-y-6">
              <h2 className="text-2xl font-semibold">About the Organization</h2>
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {sponsor.notes || 'No additional information available for this sponsor.'}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card-gradient p-6 space-y-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Company Overview</div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Industry</div>
                    <div className="text-muted-foreground text-sm">{sponsor.industry || 'Not specified'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Location</div>
                    <div className="text-muted-foreground text-sm">{country.name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-[color:var(--success)] mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Sponsor Status</div>
                    <div className="text-muted-foreground text-sm text-[color:var(--success)] capitalize">{sponsor.sponsor_status}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
