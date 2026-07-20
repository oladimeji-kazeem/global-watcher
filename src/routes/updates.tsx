import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, X, Calendar, ExternalLink, ArrowUpRight } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
  changes, statusStyles, formatDate,
  allCountries, allVisaTypes, allStatuses, type ChangeStatus,
} from "@/lib/immigration-data";
import { PageHeader } from "@/components/site-shell";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  country: fallback(z.string(), "all").default("all"),
  visa: fallback(z.string(), "all").default("all"),
  status: fallback(z.string(), "all").default("all"),
  from: fallback(z.string(), "").default(""),
  to: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/updates")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Immigration Changes Database — Immigration Radar" },
      { name: "description", content: "Search and filter immigration rule changes by country, visa type, effective date and status. Every entry linked to its official source." },
    ],
  }),
  component: UpdatesDatabase,
});

function UpdatesDatabase() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [localQ, setLocalQ] = useState(search.q);

  const update = (patch: Partial<z.infer<typeof searchSchema>>) => navigate({ search: (prev: any) => ({ ...prev, ...patch }) });

  const filtered = useMemo(() => {
    return changes.filter((c) => {
      const q = search.q.toLowerCase();
      if (q && !(c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.visaType.toLowerCase().includes(q))) return false;
      if (search.country !== "all" && c.country !== search.country) return false;
      if (search.visa !== "all" && c.visaType !== search.visa) return false;
      if (search.status !== "all" && c.status !== search.status) return false;
      if (search.from && new Date(c.effectiveDate) < new Date(search.from)) return false;
      if (search.to && new Date(c.effectiveDate) > new Date(search.to)) return false;
      return true;
    });
  }, [search]);

  const activeFilters =
    (search.country !== "all" ? 1 : 0) +
    (search.visa !== "all" ? 1 : 0) +
    (search.status !== "all" ? 1 : 0) +
    (search.from ? 1 : 0) +
    (search.to ? 1 : 0);

  return (
    <main>
      <PageHeader
        eyebrow="Database"
        title={<>Immigration <span className="text-gradient">changes</span> database</>}
        description="Search and filter every tracked immigration change. Click any row to open the full previous vs new rule comparison and official source."
      />

      <div className="mx-auto max-w-7xl px-6 pb-24 space-y-6">
        {/* Filter bar */}
        <div className="rounded-2xl ring-gradient bg-card-gradient p-5 space-y-4">
          <form
            onSubmit={(e) => { e.preventDefault(); update({ q: localQ }); }}
            className="flex flex-col md:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={localQ} onChange={(e) => setLocalQ(e.target.value)}
                placeholder="Search rule, country or visa type…"
                className="w-full rounded-xl bg-background/60 border border-border pl-10 pr-3 py-3 text-sm outline-none focus:border-[color:var(--primary)]/60 focus:glow-cyan transition"
              />
            </div>
            <button type="submit"
              className="rounded-xl bg-hero-gradient text-white text-sm font-medium px-5 py-3 glow-cyan hover:opacity-95 transition">
              Search
            </button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <FilterSelect label="Country" value={search.country} onChange={(v) => update({ country: v })} options={[["all", "All countries"], ...allCountries.map((c) => [c, c] as const)]} />
            <FilterSelect label="Visa type" value={search.visa} onChange={(v) => update({ visa: v })} options={[["all", "All visas"], ...allVisaTypes.map((v) => [v, v] as const)]} />
            <FilterSelect label="Status" value={search.status} onChange={(v) => update({ status: v })} options={[["all", "All statuses"], ...allStatuses.map((s) => [s, statusStyles[s as ChangeStatus].label] as const)]} />
            <DateInput label="Effective from" value={search.from} onChange={(v) => update({ from: v })} />
            <DateInput label="Effective to" value={search.to} onChange={(v) => update({ to: v })} />
          </div>

          {(activeFilters > 0 || search.q) && (
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                {filtered.length} of {changes.length} changes shown
                {activeFilters > 0 && <span>· {activeFilters} filter{activeFilters === 1 ? "" : "s"} active</span>}
              </div>
              <button
                onClick={() => { setLocalQ(""); navigate({ search: () => ({ q: "", country: "all", visa: "all", status: "all", from: "", to: "" }) }); }}
                className="inline-flex items-center gap-1 hover:text-foreground">
                <X className="h-3 w-3" /> Reset
              </button>
            </div>
          )}
        </div>

        {/* Results table */}
        <div className="rounded-2xl ring-gradient bg-card-gradient overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.6fr_1.2fr_0.9fr_0.9fr_0.6fr_auto] gap-4 px-5 py-3 border-b border-border/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div>Change</div><div>Country / Visa</div><div>Category</div><div>Effective</div><div>Status</div><div />
          </div>
          <div className="divide-y divide-border/40">
            {filtered.map((c) => {
              const s = statusStyles[c.status];
              return (
                <Link key={c.id} to="/updates/$id" params={{ id: c.id }}
                  className="grid grid-cols-1 lg:grid-cols-[1.6fr_1.2fr_0.9fr_0.9fr_0.6fr_auto] gap-3 lg:gap-4 px-5 py-4 items-start lg:items-center hover:bg-background/40 transition">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.description}</div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-lg leading-none">{c.flag}</div>
                    <div className="min-w-0">
                      <div className="text-sm truncate">{c.country}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.visaType}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{c.category}</div>
                  <div className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" />{formatDate(c.effectiveDate)}</div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] ${s.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
                    </span>
                  </div>
                  <div className="text-muted-foreground"><ArrowUpRight className="h-4 w-4" /></div>
                </Link>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <Filter className="h-6 w-6 mx-auto mb-2 opacity-60" />
                No changes match your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[] }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm outline-none focus:border-[color:var(--primary)]/60 transition">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm outline-none focus:border-[color:var(--primary)]/60 transition [color-scheme:dark]" />
    </label>
  );
}
