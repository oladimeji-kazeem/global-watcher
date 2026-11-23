import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchCountryBySlug, fetchSponsors, type SponsorOrganization } from "@/lib/data-service";
import { PageHeader, PageShell } from "@/components/site-shell";
import { Building2, ExternalLink, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/$countrySlug/sponsors/")({
  loader: async ({ params }) => {
    const country = await fetchCountryBySlug(params.countrySlug);
    if (!country) throw notFound();
    const sponsors = await fetchSponsors(country.code);
    return { country, sponsors };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.country?.name || 'Country'} Verified Visa Sponsors — Immigration Radar` },
      { name: "description", content: `Browse licensed visa sponsor employers in ${loaderData?.country?.name || 'the country'}.` },
    ],
  }),
  component: SponsorsPage,
});

function SponsorsPage() {
  const { country, sponsors } = Route.useLoaderData();

  return (
    <PageShell>
      <div className="pt-10 px-6 max-w-7xl mx-auto">
        <Link to="/$countrySlug" params={{ countrySlug: country.slug }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to {country.name}
        </Link>
      </div>
      <PageHeader 
        eyebrow={`${country.name} Sponsor Directory`} 
        title="Verified Sponsors" 
        description={`Browse organizations known to sponsor work visas in ${country.name}.`} 
      />
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} countrySlug={country.slug} />
          ))}
          {sponsors.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground rounded-2xl border border-border bg-card/40">
              No sponsors found for {country.name}. Check back later!
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function SponsorCard({ sponsor, countrySlug }: { sponsor: SponsorOrganization, countrySlug: string }) {
  return (
    <Link to="/$countrySlug/company/$companySlug" params={{ countrySlug, companySlug: sponsor.slug }} className="group block h-full">
      <div className="relative rounded-2xl ring-gradient bg-card-gradient p-6 h-full flex flex-col hover:shadow-elegant transition">
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded-xl bg-background border border-border grid place-items-center">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[color:var(--success)]/10 text-[color:var(--success)] font-medium">
            Verified
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-[color:var(--primary)] transition-colors">{sponsor.name}</h3>
        <div className="text-sm text-muted-foreground mb-4">{sponsor.industry || 'General Industry'}</div>
        
        <div className="mt-auto pt-4 flex justify-between items-center text-sm font-medium text-[color:var(--primary)]">
          View Profile <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
