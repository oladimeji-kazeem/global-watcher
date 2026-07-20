import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity, Bell, Globe2, Radar, ShieldCheck, Search, ArrowUpRight,
  Calendar, ExternalLink, Building2, Users, TrendingUp, AlertTriangle,
  CheckCircle2, Filter, Sparkles,
} from "lucide-react";
import { changes, countries, timeline, statusStyles, type ImmigrationChange } from "@/lib/immigration-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Immigration Radar — Live Global Immigration Intelligence" },
      { name: "description", content: "Monitor immigration rule changes across 40+ countries. Salary thresholds, visa updates, deadlines — from verified government sources." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "urgent" | "approved" | "warning">("all");
  const [watchlist, setWatchlist] = useState<string[]>(["UK", "CA"]);

  const filtered = useMemo(() => {
    return changes.filter((c) => {
      const q = query.toLowerCase();
      const matchQ = !q || c.title.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.visaType.toLowerCase().includes(q);
      const matchF = filter === "all" || c.status === filter;
      return matchQ && matchF;
    });
  }, [query, filter]);

  const toggleWatch = (code: string) =>
    setWatchlist((w) => (w.includes(code) ? w.filter((c) => c !== code) : [...w, code]));

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 bg-radar opacity-70" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[color:var(--primary)]/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-[color:var(--accent)]/20 blur-3xl animate-float-slow" />

      <div className="relative">
        <Header />
        <Hero />
        <main className="mx-auto max-w-7xl px-6 pb-24 space-y-16">
          <StatsRow />
          <LatestUpdates
            filtered={filtered} query={query} setQuery={setQuery}
            filter={filter} setFilter={setFilter}
          />
          <CountriesGrid watchlist={watchlist} toggleWatch={toggleWatch} />
          <TimelineSection />
          <WatchlistCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/40">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-xl bg-hero-gradient grid place-items-center glow-cyan">
            <Radar className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold tracking-tight">Immigration Radar</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Global Intelligence</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a className="hover:text-foreground transition" href="#updates">Updates</a>
          <a className="hover:text-foreground transition" href="#countries">Countries</a>
          <a className="hover:text-foreground transition" href="#timeline">Timeline</a>
          <a className="hover:text-foreground transition" href="#watchlist">Watchlist</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition px-3 py-1.5">Sign in</button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-hero-gradient text-white text-sm font-medium px-4 py-2 glow-cyan hover:opacity-90 transition">
            Get alerts <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-75 animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--success)]" />
            </span>
            Live — monitoring 47 official sources
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter leading-[1.02]">
            The <span className="text-gradient">Bloomberg Terminal</span> for immigration intelligence.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Track visa rule changes, salary thresholds and policy shifts across 40+ countries — verified against official government sources, delivered before decisions are made.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-5 py-3 glow-cyan hover:opacity-95 transition">
              <Sparkles className="h-4 w-4" /> Start monitoring
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 backdrop-blur px-5 py-3 hover:bg-card transition">
              View dashboard
            </button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[color:var(--success)]" /> Verified sources</div>
            <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-[color:var(--primary)]" /> Real-time alerts</div>
            <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[color:var(--accent)]" /> 40+ countries</div>
          </div>
        </div>
        <RadarVisual />
      </div>
    </section>
  );
}

function RadarVisual() {
  return (
    <div className="relative aspect-square max-w-[520px] mx-auto w-full">
      <div className="absolute inset-0 rounded-full bg-hero-gradient opacity-20 blur-3xl" />
      <div className="relative h-full w-full rounded-full ring-gradient bg-card-gradient shadow-elegant overflow-hidden">
        {/* concentric rings */}
        {[0.9, 0.7, 0.5, 0.3].map((s, i) => (
          <div key={i} className="absolute inset-0 rounded-full border border-[color:var(--primary)]/20"
               style={{ transform: `scale(${s})` }} />
        ))}
        {/* cross lines */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-[color:var(--primary)]/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[color:var(--primary)]/10" />
        {/* sweep */}
        <div className="absolute inset-0 animate-radar-sweep origin-center">
          <div className="absolute top-1/2 left-1/2 h-1/2 w-1/2 origin-top-left"
               style={{ background: "conic-gradient(from 0deg, transparent 0deg, oklch(0.72 0.18 200 / 0.55) 45deg, transparent 90deg)" }} />
        </div>
        {/* blips */}
        {[
          { x: "22%", y: "28%", label: "🇬🇧", color: "var(--danger)" },
          { x: "72%", y: "35%", label: "🇨🇦", color: "var(--success)" },
          { x: "58%", y: "70%", label: "🇦🇺", color: "var(--warning)" },
          { x: "32%", y: "72%", label: "🇩🇪", color: "var(--success)" },
          { x: "80%", y: "60%", label: "🇺🇸", color: "var(--warning)" },
        ].map((b, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: b.x, top: b.y }}>
            <div className="relative">
              <span className="absolute inset-0 rounded-full animate-pulse-ring"
                    style={{ background: `color-mix(in oklab, ${b.color} 60%, transparent)` }} />
              <div className="relative h-8 w-8 rounded-full bg-background border border-border grid place-items-center text-sm shadow-elegant">
                {b.label}
              </div>
            </div>
          </div>
        ))}
        {/* center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-hero-gradient grid place-items-center glow-cyan">
          <Radar className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function StatsRow() {
  const stats = [
    { icon: Activity, label: "Updates this week", value: "128", trend: "+12%" },
    { icon: Globe2, label: "Countries monitored", value: "42", trend: "+3" },
    { icon: AlertTriangle, label: "Urgent alerts", value: "7", trend: "live" },
    { icon: Users, label: "Watchlists active", value: "2,431", trend: "+9%" },
  ];
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="relative rounded-2xl ring-gradient bg-card-gradient p-5 overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-background/60 border border-border grid place-items-center">
              <s.icon className="h-5 w-5 text-[color:var(--primary)]" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[color:var(--success)]">{s.trend}</span>
          </div>
          <div className="mt-6 text-3xl font-semibold font-display">{s.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </div>
      ))}
    </section>
  );
}

function LatestUpdates({
  filtered, query, setQuery, filter, setFilter,
}: {
  filtered: ImmigrationChange[]; query: string; setQuery: (s: string) => void;
  filter: "all" | "urgent" | "approved" | "warning"; setFilter: (f: any) => void;
}) {
  const filters = ["all", "urgent", "warning", "approved"] as const;
  return (
    <section id="updates" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--primary)]">Live feed</div>
          <h2 className="text-3xl md:text-4xl font-semibold mt-1">Latest immigration updates</h2>
          <p className="text-muted-foreground mt-2 max-w-xl">Every entry is linked to its official government source and reviewed before publishing.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country, visa, rule…"
              className="w-full sm:w-72 rounded-xl bg-card/60 backdrop-blur border border-border pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]/60 focus:glow-cyan transition"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card/60 backdrop-blur p-1">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-lg capitalize transition ${
                  filter === f ? "bg-hero-gradient text-white glow-cyan" : "text-muted-foreground hover:text-foreground"
                }`}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((c) => <UpdateCard key={c.id} change={c} />)}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <Filter className="h-6 w-6 mx-auto mb-2 opacity-60" />
            No updates match your search.
          </div>
        )}
      </div>
    </section>
  );
}

function UpdateCard({ change: c }: { change: ImmigrationChange }) {
  const s = statusStyles[c.status];
  return (
    <article className="group relative rounded-2xl ring-gradient bg-card-gradient p-6 hover:shadow-elegant transition-all">
      <div className="grid lg:grid-cols-[auto_1fr_auto] gap-6">
        <div className="flex lg:flex-col items-center lg:items-start gap-3">
          <div className="h-14 w-14 rounded-2xl bg-background/60 border border-border grid place-items-center text-2xl">
            {c.flag}
          </div>
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
            <span className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">
              {c.visaType}
            </span>
            <span className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">
              {c.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold leading-snug">{c.title}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.description}</p>

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
        </div>

        <div className="flex lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-3 lg:min-w-[180px]">
          <div className="lg:text-right">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> Effective
            </div>
            <div className="text-sm font-medium">{formatDate(c.effectiveDate)}</div>
          </div>
          <div className="lg:text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Impact</div>
            <div className="text-xs">{c.impact}</div>
          </div>
          <a href={c.sourceUrl} target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-1 text-xs text-[color:var(--primary)] hover:underline">
            Official source <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

function CountriesGrid({ watchlist, toggleWatch }: { watchlist: string[]; toggleWatch: (c: string) => void }) {
  return (
    <section id="countries" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--accent)]">Coverage</div>
          <h2 className="text-3xl md:text-4xl font-semibold mt-1">Countries monitored</h2>
        </div>
        <div className="text-sm text-muted-foreground hidden md:block">Tap to add to your watchlist</div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((c) => {
          const active = watchlist.includes(c.code);
          return (
            <button key={c.code} onClick={() => toggleWatch(c.code)}
              className={`text-left rounded-2xl ring-gradient bg-card-gradient p-5 transition hover:shadow-elegant ${active ? "glow-cyan" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-background/60 border border-border grid place-items-center text-2xl">{c.flag}</div>
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" />{c.authority}</div>
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border ${
                  active ? "border-[color:var(--primary)]/40 text-[color:var(--primary)] bg-[color:var(--primary)]/10"
                         : "border-border text-muted-foreground"
                }`}>{active ? "Watching" : "Watch"}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-background/40 border border-border p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Visa types</div>
                  <div className="text-lg font-semibold font-display">{c.tracked}</div>
                </div>
                <div className="rounded-lg bg-background/40 border border-border p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Updates</div>
                  <div className="text-lg font-semibold font-display flex items-center gap-1">
                    {c.updates} <TrendingUp className="h-3.5 w-3.5 text-[color:var(--success)]" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section id="timeline" className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-[color:var(--primary)]">Rule history</div>
        <h2 className="text-3xl md:text-4xl font-semibold mt-1">UK Skilled Worker — timeline</h2>
        <p className="text-muted-foreground mt-2 max-w-xl">Every policy change preserved so you can see how rules evolved over time.</p>
      </div>
      <div className="relative rounded-2xl ring-gradient bg-card-gradient p-8">
        <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-[color:var(--primary)]/40 via-[color:var(--accent)]/40 to-[color:var(--primary)]/40" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
          {timeline.map((t, i) => (
            <div key={t.year} className="relative">
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
  );
}

function WatchlistCTA() {
  return (
    <section id="watchlist" className="relative overflow-hidden rounded-3xl ring-gradient bg-card-gradient p-10 md:p-14">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[color:var(--accent)]/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[color:var(--primary)]/30 blur-3xl" />
      <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)]" /> Trusted by advisers, employers & universities
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            Never miss an <span className="text-gradient">immigration rule change</span> that affects you.
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Build a personal watchlist by country and visa type. Get email + dashboard alerts the moment official sources publish a change.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md">
            <input type="email" placeholder="you@example.com"
              className="flex-1 rounded-xl bg-background/60 border border-border px-4 py-3 text-sm outline-none focus:border-[color:var(--primary)]/60 focus:glow-cyan transition" />
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-5 py-3 glow-cyan hover:opacity-95 transition">
              <Bell className="h-4 w-4" /> Enable alerts
            </button>
          </form>
          <p className="text-[11px] text-muted-foreground">For guidance only. Always verify with the official authority before making decisions.</p>
        </div>
        <div className="rounded-2xl border border-border bg-background/50 p-5 backdrop-blur">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">My Immigration Watch</div>
          <div className="space-y-3">
            {changes.slice(0, 3).map((c) => {
              const s = statusStyles[c.status];
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3">
                  <div className="text-xl">{c.flag}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.visaType} · {formatDate(c.effectiveDate)}</div>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border/50 backdrop-blur-xl bg-background/40">
      <div className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-3 gap-6 items-start text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-hero-gradient grid place-items-center"><Radar className="h-4 w-4 text-white" /></div>
            <span className="font-display font-semibold">Immigration Radar</span>
          </div>
          <p className="text-muted-foreground text-xs max-w-xs">Global immigration intelligence powered by verified official sources. Guidance only — not legal advice.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="space-y-1.5">
            <div className="text-foreground font-medium mb-2">Product</div>
            <div>Dashboard</div><div>Watchlist</div><div>Alerts</div><div>Timeline</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-foreground font-medium mb-2">Coverage</div>
            <div>Countries</div><div>Visa types</div><div>Sources</div><div>Methodology</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground md:text-right">
          © {new Date().getFullYear()} Immigration Radar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
