import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ExternalLink, TrendingUp } from "lucide-react";
import { fetchCountries } from "@/lib/data-service";
import { AppSidebarLayout, PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/countries")({
  loader: async () => {
    const countries = await fetchCountries();
    return { countries };
  },
  head: () => ({
    meta: [
      { title: "Countries Monitored — Immigration Radar" },
      { name: "description", content: "Browse immigration authorities, visa types and rule tracking across every country covered by Immigration Radar." },
    ],
  }),
  component: CountriesPage,
});

function CountriesPage() {
  const { countries } = Route.useLoaderData();
  return (
    <AppSidebarLayout>
      <main>
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[color:var(--primary)]/90 mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" /> LIVE MONITORING &middot; {countries.length} JURISDICTIONS
            </div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[color:var(--primary)] mb-1 flex items-center gap-2">
              ADMIN &middot; REFERENCE DATA
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Countries</h1>
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
            <span className="text-lg leading-none mt-[-1px] font-normal">+</span> Add country
          </button>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24">
          <div className="rounded-xl border border-border/40 bg-card/20 backdrop-blur-md overflow-hidden shadow-elegant">
            <div className="hidden lg:grid grid-cols-[1.5fr_1.5fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-border/40 text-[10px] font-semibold tracking-[0.1em] text-muted-foreground/90 uppercase">
              <div>Country</div>
              <div>Immigration Authority</div>
              <div>Official Website</div>
              <div>Visa Categories</div>
              <div>Rules Tracked</div>
              <div>Active Changes</div>
            </div>
            <div className="divide-y divide-border/30">
              {countries.map(c => {
                const websiteUrl = c.website ? c.website.replace(/^https?:\/\//, '') : '';
                return (
                  <div key={c.code} className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.5fr_2fr_1fr_1fr_1fr] gap-x-4 gap-y-3 px-6 py-5 items-center hover:bg-white/[0.03] transition">
                    <div className="font-semibold text-sm flex items-center gap-2 text-white">
                      <span className="text-lg leading-none">{c.flag}</span> {c.name}
                    </div>
                    <div className="text-sm text-foreground/90 font-medium">
                      <span className="lg:hidden text-[10px] text-muted-foreground uppercase tracking-widest block mb-1 font-bold">Authority</span>
                      {c.authority}
                    </div>
                    <div>
                      <span className="lg:hidden text-[10px] text-muted-foreground uppercase tracking-widest block mb-1 font-bold">Website</span>
                      <a href={c.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[13px] font-medium text-[color:var(--primary)] hover:opacity-80 transition">
                        {websiteUrl} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="text-sm font-semibold text-white/90">
                      <span className="lg:hidden text-[10px] text-muted-foreground uppercase tracking-widest block mb-1 font-bold">Visa Categories</span>
                      {c.visa_types?.length || 0}
                    </div>
                    <div className="text-sm font-semibold text-white/90">
                      <span className="lg:hidden text-[10px] text-muted-foreground uppercase tracking-widest block mb-1 font-bold">Rules Tracked</span>
                      {c.tracked}
                    </div>
                    <div className="text-sm font-semibold text-white/90">
                      <span className="lg:hidden text-[10px] text-muted-foreground uppercase tracking-widest block mb-1 font-bold">Active Changes</span>
                      {c.updates}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </AppSidebarLayout>
  );
}
