import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity, Bell, Globe2, Radar, ShieldCheck, ArrowUpRight,
  Users, AlertTriangle, CheckCircle2, Sparkles, Database,
} from "lucide-react";
import { fetchChanges, statusStyles, formatDate, type ImmigrationChange } from "@/lib/data-service";
import { ChangeCard } from "@/components/change-card";

export const Route = createFileRoute("/")({
  loader: async () => {
    const changes = await fetchChanges();
    return { changes };
  },
  head: () => ({
    meta: [
      { title: "Immigration Radar — Live Global Immigration Intelligence" },
      { name: "description", content: "Monitor immigration rule changes across 40+ countries. Salary thresholds, visa updates and deadlines from verified government sources." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { changes } = Route.useLoaderData();
  const latest = changes.slice(0, 3);
  return (
    <main>
      <Hero />
      <div className="mx-auto max-w-7xl px-6 pb-16 space-y-16">
        <StatsRow />
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--primary)]">Live feed</div>
              <h2 className="text-3xl md:text-4xl font-semibold mt-1">Latest immigration updates</h2>
            </div>
            <Link to="/updates" className="hidden md:inline-flex items-center gap-1 text-sm text-[color:var(--primary)] hover:underline">
              Open full database <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4">
            {latest.map((c) => <ChangeCard key={c.id} change={c} />)}
          </div>
        </section>
        <WatchlistCTA changes={changes} />
      </div>
    </main>
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
            The World's <span className="text-gradient">Immigration Intelligence Platform</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Track visa rule changes, salary thresholds and policy shifts across 40+ countries — verified against official government sources, delivered before decisions are made.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/updates" className="inline-flex items-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-5 py-3 glow-cyan hover:opacity-95 transition">
              <Database className="h-4 w-4" /> Explore database
            </Link>
            <Link to="/watchlist" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 backdrop-blur px-5 py-3 hover:bg-card transition">
              <Sparkles className="h-4 w-4" /> Build your watchlist
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-muted-foreground">
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
        {[0.9, 0.7, 0.5, 0.3].map((s, i) => (
          <div key={i} className="absolute inset-0 rounded-full border border-[color:var(--primary)]/20" style={{ transform: `scale(${s})` }} />
        ))}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-[color:var(--primary)]/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[color:var(--primary)]/10" />
        <div className="absolute inset-0 animate-radar-sweep origin-center">
          <div className="absolute top-1/2 left-1/2 h-1/2 w-1/2 origin-top-left"
            style={{ background: "conic-gradient(from 0deg, transparent 0deg, oklch(0.72 0.18 200 / 0.55) 45deg, transparent 90deg)" }} />
        </div>
        {[
          { x: "22%", y: "28%", label: "🇬🇧", color: "var(--danger)" },
          { x: "72%", y: "35%", label: "🇨🇦", color: "var(--success)" },
          { x: "58%", y: "70%", label: "🇦🇺", color: "var(--warning)" },
          { x: "32%", y: "72%", label: "🇩🇪", color: "var(--success)" },
          { x: "80%", y: "60%", label: "🇺🇸", color: "var(--warning)" },
        ].map((b, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: b.x, top: b.y }}>
            <div className="relative">
              <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: `color-mix(in oklab, ${b.color} 60%, transparent)` }} />
              <div className="relative h-8 w-8 rounded-full bg-background border border-border grid place-items-center text-sm shadow-elegant">{b.label}</div>
            </div>
          </div>
        ))}
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

function WatchlistCTA({ changes }: { changes: ImmigrationChange[] }) {
  return (
    <section className="relative overflow-hidden rounded-3xl ring-gradient bg-card-gradient p-10 md:p-14">
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
            Build a personal watchlist by country and visa type. Get email alerts the moment official sources publish a change.
          </p>
          <Link to="/watchlist" className="inline-flex items-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-5 py-3 glow-cyan hover:opacity-95 transition">
            <Bell className="h-4 w-4" /> Configure alerts
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-background/50 p-5 backdrop-blur">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">My Immigration Watch</div>
          <div className="space-y-3">
            {changes.slice(0, 3).map((c) => {
              const s = statusStyles[c.status];
              return (
                <Link to="/updates/$id" params={{ id: c.id }} key={c.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3 hover:bg-card transition">
                  <div className="text-xl">{c.flag}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.visa_type} · {formatDate(c.effective_date)}</div>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
