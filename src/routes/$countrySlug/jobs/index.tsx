import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchCountryBySlug, fetchJobs, type SponsoredJob } from "@/lib/data-service";
import { PageHeader, PageShell } from "@/components/site-shell";
import { Briefcase, MapPin, Building2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/$countrySlug/jobs/")({
  loader: async ({ params }) => {
    const country = await fetchCountryBySlug(params.countrySlug);
    if (!country) throw notFound();
    const jobs = await fetchJobs(country.code);
    return { country, jobs };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.country?.name || 'Country'} Sponsored Jobs — Immigration Radar` },
      { name: "description", content: `Search visa-sponsored job opportunities in ${loaderData?.country?.name || 'the country'}.` },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const { country, jobs } = Route.useLoaderData();

  return (
    <PageShell>
      <div className="pt-10 px-6 max-w-7xl mx-auto">
        <Link to="/$countrySlug" params={{ countrySlug: country.slug }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to {country.name}
        </Link>
      </div>
      <PageHeader 
        eyebrow={`${country.name} Job Directory`} 
        title="Find Sponsored Roles" 
        description={`Search through opportunities across verified sponsors in ${country.name}.`} 
      />
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} countrySlug={country.slug} />
          ))}
          {jobs.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground rounded-2xl border border-border bg-card/40">
              No jobs found for {country.name}. Check back later!
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function JobCard({ job, countrySlug }: { job: SponsoredJob, countrySlug: string }) {
  return (
    <Link to="/$countrySlug/jobs/$jobId" params={{ countrySlug, jobId: job.id }} className="group block h-full">
      <div className="relative rounded-2xl ring-gradient bg-card-gradient p-5 h-full flex flex-col hover:shadow-elegant transition">
        <div className="flex justify-between items-start mb-4">
          <div className="h-10 w-10 rounded-xl bg-background/60 border border-border grid place-items-center">
            <Briefcase className="h-5 w-5 text-[color:var(--primary)]" />
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-background/50 border border-border">
            {job.job_type || 'Full-time'}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-1 group-hover:text-[color:var(--primary)] transition-colors line-clamp-1">{job.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Building2 className="h-4 w-4" /> <span className="line-clamp-1">{job.sponsor?.name || 'Verified Sponsor'}</span>
        </div>
        
        <div className="mt-auto pt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {job.location_city || 'Remote'}
          </div>
        </div>
      </div>
    </Link>
  );
}
