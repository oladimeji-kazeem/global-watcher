import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchCountryBySlug, fetchPageBySlug } from "@/lib/data-service";
import { PageHeader, PageShell } from "@/components/site-shell";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/$countrySlug/$pageSlug")({
  loader: async ({ params }) => {
    const country = await fetchCountryBySlug(params.countrySlug);
    if (!country) throw notFound();
    const page = await fetchPageBySlug(country.code, params.pageSlug);
    if (!page || !page.is_published) throw notFound();
    return { country, page };
  },
  component: CountryDynamicPage,
});

function CountryDynamicPage() {
  const { country, page } = Route.useLoaderData();

  return (
    <PageShell>
      <div className="pt-10 px-6 max-w-4xl mx-auto">
        <Link to="/$countrySlug" params={{ countrySlug: country.slug }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to {country.name}
        </Link>
      </div>
      <PageHeader 
        eyebrow={`${country.name} Portal`} 
        title={page.title}
      />
      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-3xl border border-border bg-card-gradient p-8">
            <div className="prose prose-invert prose-primary max-w-none">
                <ReactMarkdown>{page.content_markdown}</ReactMarkdown>
            </div>
        </div>
      </div>
    </PageShell>
  );
}
