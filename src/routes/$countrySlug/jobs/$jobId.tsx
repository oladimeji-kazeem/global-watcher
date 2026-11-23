import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchCountryBySlug, fetchJobById } from "@/lib/data-service";
import { PageHeader, PageShell } from "@/components/site-shell";
import { Building2, MapPin, Briefcase, ExternalLink, ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/$countrySlug/jobs/$jobId")({
  loader: async ({ params }) => {
    const country = await fetchCountryBySlug(params.countrySlug);
    if (!country) throw notFound();
    const job = await fetchJobById(params.jobId);
    if (!job || job.sponsor?.country_code !== country.code) throw notFound();
    return { country, job };
  },
  component: JobDetailsPage,
});

function JobDetailsPage() {
  const { country, job } = Route.useLoaderData();

  return (
    <PageShell>
      <div className="pt-10 px-6 max-w-7xl mx-auto">
        <Link to="/$countrySlug/jobs" params={{ countrySlug: country.slug }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
      </div>
      <PageHeader 
        eyebrow="Job Details" 
        title={job.title}
        action={
          <a href={job.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-6 py-3 glow-cyan hover:opacity-95 transition">
            Apply Now <ExternalLink className="h-4 w-4" />
          </a>
        }
      />
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          <div className="space-y-8">
            <div className="rounded-3xl border border-border bg-card-gradient p-8 space-y-6">
              <h2 className="text-2xl font-semibold">Requirements</h2>
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {job.requirements || 'No specific requirements listed. Please check the source link.'}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card-gradient p-6 space-y-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Overview</div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-[color:var(--primary)] mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Job Type</div>
                    <div className="text-muted-foreground text-sm">{job.job_type || 'Full-time'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[color:var(--primary)] mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Location</div>
                    <div className="text-muted-foreground text-sm">{job.location_city || 'Remote'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[color:var(--success)] mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Visa Sponsorship</div>
                    <div className="text-muted-foreground text-sm text-[color:var(--success)]">Yes, provided</div>
                  </div>
                </div>
              </div>
            </div>

            {job.sponsor && (
              <div className="rounded-3xl border border-border bg-card-gradient p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">About the Sponsor</div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border grid place-items-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="font-medium">{job.sponsor.name}</div>
                </div>
                {job.sponsor.industry && (
                  <div className="text-sm text-muted-foreground">
                    Industry: {job.sponsor.industry}
                  </div>
                )}
                <Link to="/$countrySlug/company/$companySlug" params={{ countrySlug: country.slug, companySlug: job.sponsor.slug }} className="inline-flex items-center gap-1.5 text-sm text-[color:var(--primary)] font-medium mt-2">
                  View Company <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
