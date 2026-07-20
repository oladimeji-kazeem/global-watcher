import { Link } from "@tanstack/react-router";
import { Calendar, ExternalLink, ArrowUpRight } from "lucide-react";
import { statusStyles, formatDate, type ImmigrationChange } from "@/lib/immigration-data";

export function ChangeCard({ change: c, compact = false }: { change: ImmigrationChange; compact?: boolean }) {
  const s = statusStyles[c.status];
  return (
    <article className="group relative rounded-2xl ring-gradient bg-card-gradient p-6 hover:shadow-elegant transition-all">
      <div className={`grid gap-6 ${compact ? "lg:grid-cols-[auto_1fr_auto]" : "lg:grid-cols-[auto_1fr_auto]"}`}>
        <div className="flex lg:flex-col items-center lg:items-start gap-3">
          <div className="h-14 w-14 rounded-2xl bg-background/60 border border-border grid place-items-center text-2xl">{c.flag}</div>
          <div className="lg:mt-1">
            <div className="text-sm font-semibold">{c.country}</div>
            <div className="text-xs text-muted-foreground">{c.sourceName}</div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
            </span>
            <span className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">{c.visaType}</span>
            <span className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">{c.category}</span>
          </div>
          <Link to="/updates/$id" params={{ id: c.id }} className="block group/link">
            <h3 className="text-lg font-semibold leading-snug group-hover/link:text-[color:var(--primary)] transition">{c.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.description}</p>

          {!compact && (
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-background/50 border border-border p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Previous</div>
                <div className="text-sm line-through decoration-[color:var(--danger)]/60">{c.previousRule}</div>
              </div>
              <div className="rounded-xl bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/25 p-3">
                <div className="text-[10px] uppercase tracking-widest text-[color:var(--primary)] mb-1">New</div>
                <div className="text-sm font-medium">{c.newRule}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-3 lg:min-w-[180px]">
          <div className="lg:text-right">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Effective</div>
            <div className="text-sm font-medium">{formatDate(c.effectiveDate)}</div>
          </div>
          <div className="lg:text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Impact</div>
            <div className="text-xs">{c.impact}</div>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <Link to="/updates/$id" params={{ id: c.id }}
              className="inline-flex items-center gap-1 text-xs text-[color:var(--primary)] hover:underline">
              View details <ArrowUpRight className="h-3 w-3" />
            </Link>
            <a href={c.sourceUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              Official source <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
