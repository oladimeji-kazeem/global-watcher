import { createFileRoute } from "@tanstack/react-router";
import { timeline, changes, statusStyles, formatDate } from "@/lib/immigration-data";
import { PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Immigration Timeline — Immigration Radar" },
      { name: "description", content: "See how immigration rules have evolved over time. Historical policy changes preserved in a clear timeline." },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  // Merge structured yearly timeline with sorted DB entries
  const sorted = [...changes].sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  return (
    <main>
      <PageHeader
        eyebrow="Rule history"
        title={<>How immigration rules <span className="text-gradient">evolved</span></>}
        description="Every policy change preserved so you can see the direction of travel across countries and visa categories."
      />
      <div className="mx-auto max-w-5xl px-6 pb-24 space-y-14">
        {/* Featured UK Skilled Worker timeline */}
        <section className="rounded-2xl ring-gradient bg-card-gradient p-8">
          <div className="text-xs uppercase tracking-widest text-[color:var(--primary)] mb-3">Featured · UK Skilled Worker Visa</div>
          <div className="relative">
            <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-[color:var(--primary)]/40 via-[color:var(--accent)]/40 to-[color:var(--primary)]/40" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
              {timeline.map((t, i) => (
                <div key={t.year}>
                  <div className={`h-4 w-4 rounded-full mx-auto ${i === timeline.length - 1 ? "bg-hero-gradient glow-cyan" : "bg-[color:var(--primary)]/60"} ring-4 ring-background`} />
                  <div className="mt-6 text-center space-y-1">
                    <div className="text-[11px] uppercase tracking-widest text-[color:var(--primary)]">{t.year}</div>
                    <div className="text-sm font-semibold">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full chronological feed */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Every tracked change</h2>
          <div className="relative pl-8 border-l border-border/60 space-y-6">
            {sorted.map((c) => {
              const s = statusStyles[c.status];
              return (
                <div key={c.id} className="relative">
                  <div className="absolute -left-[42px] top-2 h-4 w-4 rounded-full bg-background ring-4 ring-background">
                    <div className={`h-4 w-4 rounded-full ${s.dot}`} />
                  </div>
                  <div className="rounded-2xl ring-gradient bg-card-gradient p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(c.effectiveDate)}</span>
                      <span>·</span>
                      <span>{c.flag} {c.country}</span>
                      <span>·</span>
                      <span>{c.visaType}</span>
                    </div>
                    <div className="mt-2 font-semibold">{c.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{c.description}</div>
                    <div className="grid sm:grid-cols-2 gap-2 mt-3">
                      <div className="rounded-lg bg-background/50 border border-border p-2.5 text-xs">
                        <span className="uppercase tracking-widest text-[10px] text-muted-foreground">Was</span>
                        <div className="line-through decoration-[color:var(--danger)]/60">{c.previousRule}</div>
                      </div>
                      <div className="rounded-lg bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/25 p-2.5 text-xs">
                        <span className="uppercase tracking-widest text-[10px] text-[color:var(--primary)]">Now</span>
                        <div className="font-medium">{c.newRule}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
