import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ExternalLink, TrendingUp } from "lucide-react";
import { countries } from "@/lib/immigration-data";
import { PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/countries")({
  head: () => ({
    meta: [
      { title: "Countries Monitored — Immigration Radar" },
      { name: "description", content: "Browse immigration authorities, visa types and rule tracking across every country covered by Immigration Radar." },
    ],
  }),
  component: CountriesPage,
});

function CountriesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Coverage"
        title={<>Countries <span className="text-gradient">monitored</span></>}
        description="Every country tracked by Immigration Radar, with links to the official immigration authority and the visa categories currently in the database."
      />
      <div className="mx-auto max-w-7xl px-6 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((c) => (
          <div key={c.code} className="rounded-2xl ring-gradient bg-card-gradient p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-background/60 border border-border grid place-items-center text-2xl">{c.flag}</div>
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" />{c.authority}</div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[color:var(--primary)]">{c.updates} updates</span>
            </div>

            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Visa types tracked</div>
              <div className="flex flex-wrap gap-1.5">
                {c.visaTypes.map((v) => (
                  <span key={v} className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">{v}</span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-background/40 border border-border p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Visa types</div>
                <div className="text-lg font-semibold font-display">{c.tracked}</div>
              </div>
              <div className="rounded-lg bg-background/40 border border-border p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Updates</div>
                <div className="text-lg font-semibold font-display flex items-center gap-1">{c.updates} <TrendingUp className="h-3.5 w-3.5 text-[color:var(--success)]" /></div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/60">
              <Link to="/updates" search={{ q: "", country: c.name, visa: "all", status: "all", from: "", to: "" }}
                className="text-xs text-[color:var(--primary)] hover:underline">
                View {c.name} changes →
              </Link>
              <a href={c.website} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                Official site <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
