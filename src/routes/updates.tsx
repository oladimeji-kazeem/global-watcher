import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Filter, X, Calendar, ArrowUpRight, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
  statusStyles, formatDate, type ChangeStatus,
  fetchChanges, getFilterOptions,
} from "@/lib/data-service";
import { PageHeader } from "@/components/site-shell";

const PAGE_SIZE = 10;
const SEVERITY_RANK: Record<ChangeStatus, number> = { urgent: 3, warning: 2, info: 1, approved: 0 };

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  country: fallback(z.string(), "all").default("all"),
  visa: fallback(z.string(), "all").default("all"),
  status: fallback(z.string(), "all").default("all"),
  from: fallback(z.string(), "").default(""),
  to: fallback(z.string(), "").default(""),
  sort: fallback(z.string(), "date_desc").default("date_desc"),
  page: fallback(z.number().int(), 1).default(1),
});

type Search = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/updates")({
  validateSearch: zodValidator(searchSchema),
  loader: async () => {
    const [changes, options] = await Promise.all([fetchChanges(), getFilterOptions()]);
    return { changes, options };
  },
  head: () => ({
    meta: [
      { title: "Immigration Changes Database — Immigration Radar" },
      { name: "description", content: "Search, filter and sort immigration rule changes by country, visa type, effective date and severity. Every entry linked to its official source." },
    ],
  }),
  component: UpdatesDatabase,
});

const SORT_OPTIONS: [Search["sort"], string][] = [
  ["date_desc", "Effective date · newest"],
  ["date_asc", "Effective date · oldest"],
  ["severity_desc", "Severity · highest"],
  ["severity_asc", "Severity · lowest"],
];

function UpdatesDatabase() {
  const { changes, options: { countries: allCountries, visaTypes: allVisaTypes, statuses: allStatuses } } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [localQ, setLocalQ] = useState(search.q);

  // Any filter/search/sort change resets page to 1; page changes preserve everything else.
  const update = (patch: Partial<Search>) =>
    navigate({ search: (prev: any) => ({ ...prev, ...patch, page: "page" in patch ? patch.page : 1 }) });

  const filtered = useMemo(() => {
    const q = search.q.toLowerCase();
    const rows = changes.filter((c) => {
      if (q && !(c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.visaType.toLowerCase().includes(q))) return false;
      if (search.country !== "all" && c.country !== search.country) return false;
      if (search.visa !== "all" && c.visaType !== search.visa) return false;
      if (search.status !== "all" && c.status !== search.status) return false;
      if (search.from && new Date(c.effectiveDate) < new Date(search.from)) return false;
      if (search.to && new Date(c.effectiveDate) > new Date(search.to)) return false;
      return true;
    });
    const sorted = [...rows];
    switch (search.sort) {
      case "date_asc": sorted.sort((a, b) => +new Date(a.effectiveDate) - +new Date(b.effectiveDate)); break;
      case "severity_desc": sorted.sort((a, b) => SEVERITY_RANK[b.status] - SEVERITY_RANK[a.status] || +new Date(b.effectiveDate) - +new Date(a.effectiveDate)); break;
      case "severity_asc": sorted.sort((a, b) => SEVERITY_RANK[a.status] - SEVERITY_RANK[b.status] || +new Date(a.effectiveDate) - +new Date(b.effectiveDate)); break;
      case "date_desc":
      default: sorted.sort((a, b) => +new Date(b.effectiveDate) - +new Date(a.effectiveDate));
    }
    return sorted;
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, search.page), totalPages);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // If URL page overshoots after filtering, clamp back to a valid page.
  useEffect(() => {
    if (search.page !== page) navigate({ search: (prev: any) => ({ ...prev, page }) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search.page]);

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
        description="Search, sort and filter every tracked immigration change. Click any row to open the full previous vs new rule comparison and official source."
      />

      <div className="mx-auto max-w-7xl px-6 pb-24 space-y-6">
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

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <FilterSelect label="Country" value={search.country} onChange={(v) => update({ country: v })} options={[["all", "All countries"], ...allCountries.map((c) => [c, c] as const)]} />
            <FilterSelect label="Visa type" value={search.visa} onChange={(v) => update({ visa: v })} options={[["all", "All visas"], ...allVisaTypes.map((v) => [v, v] as const)]} />
            <FilterSelect label="Status" value={search.status} onChange={(v) => update({ status: v })} options={[["all", "All statuses"], ...allStatuses.map((s) => [s, statusStyles[s as ChangeStatus].label] as const)]} />
            <DateInput label="Effective from" value={search.from} onChange={(v) => update({ from: v })} />
            <DateInput label="Effective to" value={search.to} onChange={(v) => update({ to: v })} />
            <FilterSelect label="Sort by" value={search.sort} icon={<ArrowUpDown className="h-3 w-3" />} onChange={(v) => update({ sort: v })} options={SORT_OPTIONS.map(([v, l]) => [v, l] as const)} />
          </div>

          {(activeFilters > 0 || search.q) && (
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                {filtered.length} of {changes.length} changes shown
                {activeFilters > 0 && <span>· {activeFilters} filter{activeFilters === 1 ? "" : "s"} active</span>}
              </div>
              <button
                onClick={() => { setLocalQ(""); navigate({ search: () => ({ q: "", country: "all", visa: "all", status: "all", from: "", to: "", sort: "date_desc", page: 1 }) }); }}
                className="inline-flex items-center gap-1 hover:text-foreground">
                <X className="h-3 w-3" /> Reset
              </button>
            </div>
          )}
        </div>

        <div className="rounded-2xl ring-gradient bg-card-gradient overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.6fr_1.2fr_0.9fr_0.9fr_0.6fr_auto] gap-4 px-5 py-3 border-b border-border/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div>Change</div><div>Country / Visa</div><div>Category</div><div>Effective</div><div>Status</div><div />
          </div>
          <div className="divide-y divide-border/40">
            {paged.map((c) => {
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
            {paged.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <Filter className="h-6 w-6 mx-auto mb-2 opacity-60" />
                No changes match your filters.
              </div>
            )}
          </div>

          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs">
              <div className="text-muted-foreground">
                Showing <span className="text-foreground">{(page - 1) * PAGE_SIZE + 1}</span>–
                <span className="text-foreground">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{" "}
                <span className="text-foreground">{filtered.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate({ search: (p: any) => ({ ...p, page: Math.max(1, page - 1) }) })}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <div className="text-muted-foreground">Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span></div>
                <button
                  onClick={() => navigate({ search: (p: any) => ({ ...p, page: Math.min(totalPages, page + 1) }) })}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition">
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function FilterSelect({ label, value, onChange, options, icon }: { label: string; value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[]; icon?: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">{icon}{label}</div>
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
