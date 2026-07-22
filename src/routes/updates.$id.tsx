import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Calendar, CheckCircle2, ExternalLink, ShieldCheck, Users, Send, Loader2 } from "lucide-react";
import { changes, statusStyles, formatDate, type ImmigrationChange } from "@/lib/immigration-data";
import { notifyWatchlistMatches } from "@/lib/notify.functions";

export const Route = createFileRoute("/updates/$id")({
  loader: ({ params }): { change: ImmigrationChange } => {
    const change = changes.find((c) => c.id === params.id);
    if (!change) throw notFound();
    return { change };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Change not found — Immigration Radar" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.change;
    return {
      meta: [
        { title: `${c.title} — ${c.country} ${c.visaType} | Immigration Radar` },
        { name: "description", content: c.description },
        { property: "og:title", content: `${c.title} — ${c.country} ${c.visaType}` },
        { property: "og:description", content: c.description },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-6 pt-24 pb-24 text-center">
      <h1 className="text-3xl font-semibold">Change not found</h1>
      <p className="text-muted-foreground mt-2">This immigration change is no longer in the database.</p>
      <Link to="/updates" className="inline-flex items-center gap-2 mt-6 rounded-xl bg-hero-gradient text-white px-5 py-3 glow-cyan">Back to database</Link>
    </main>
  ),
  component: ChangeDetail,
});

function ChangeDetail() {
  const { change } = Route.useLoaderData() as { change: ImmigrationChange };
  const c = change;
  const s = statusStyles[c.status];
  const related = changes.filter((x) => x.country === c.country && x.id !== c.id).slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl px-6 pt-12 pb-24">
      <Link to="/updates" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to database
      </Link>

      <header className="rounded-3xl ring-gradient bg-card-gradient p-8 md:p-10 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
          </span>
          <span className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">{c.visaType}</span>
          <span className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">{c.category}</span>
        </div>
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 rounded-2xl bg-background/60 border border-border grid place-items-center text-3xl shrink-0">{c.flag}</div>
          <div>
            <div className="text-xs text-muted-foreground">{c.country}</div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mt-1">{c.title}</h1>
            <p className="text-muted-foreground mt-3 text-lg">{c.description}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-4">
          <MetaCard icon={Calendar} label="Effective date" value={formatDate(c.effectiveDate)} />
          <MetaCard icon={Calendar} label="Announced" value={formatDate(c.announcementDate)} />
          <MetaCard icon={Users} label="Impact" value={c.impact} />
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl bg-background/60 border border-border p-6">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Previous rule</div>
          <div className="text-base leading-relaxed line-through decoration-[color:var(--danger)]/60 decoration-2">{c.previousRule}</div>
        </div>
        <div className="rounded-2xl bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/25 p-6 glow-cyan">
          <div className="text-[10px] uppercase tracking-widest text-[color:var(--primary)] mb-2">New rule</div>
          <div className="text-base leading-relaxed font-medium">{c.newRule}</div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl ring-gradient bg-card-gradient p-6 md:p-8 space-y-4">
        <h2 className="text-xl font-semibold">Full details</h2>
        <p className="text-muted-foreground leading-relaxed">{c.longDescription}</p>
        <div className="pt-2">
          <div className="text-sm font-medium mb-2">Key points</div>
          <ul className="space-y-2">
            {c.keyPoints.map((k, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-[color:var(--success)] mt-0.5 shrink-0" />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-background/50 p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[color:var(--success)]/15 border border-[color:var(--success)]/30 grid place-items-center">
            <ShieldCheck className="h-5 w-5 text-[color:var(--success)]" />
          </div>
          <div>
            <div className="text-sm font-medium">Verified against official source</div>
            <div className="text-xs text-muted-foreground">{c.sourceName} · reviewed by {c.reviewedBy}</div>
          </div>
        </div>
        <a href={c.sourceUrl} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-hero-gradient text-white text-sm font-medium px-4 py-2.5 glow-cyan hover:opacity-95">
          Open official source <ExternalLink className="h-4 w-4" />
        </a>
      </section>

      <AdminNotifyPanel changeId={c.id} />


      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">More from {c.country}</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {related.map((r) => {
              const rs = statusStyles[r.status];
              return (
                <Link key={r.id} to="/updates/$id" params={{ id: r.id }}
                  className="rounded-2xl ring-gradient bg-card-gradient p-4 hover:shadow-elegant transition block">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-2 w-2 rounded-full ${rs.dot}`} />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.visaType}</span>
                  </div>
                  <div className="font-medium text-sm leading-snug">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{formatDate(r.effectiveDate)}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <p className="text-[11px] text-muted-foreground mt-10 text-center">
        For guidance only. Always verify with the official authority before making immigration decisions.
      </p>
    </main>
  );
}

function MetaCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/50 border border-border p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
