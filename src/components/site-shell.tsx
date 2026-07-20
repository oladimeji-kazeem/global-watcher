import { Link } from "@tanstack/react-router";
import { Radar, ArrowUpRight, Bell } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/updates", label: "Database" },
  { to: "/countries", label: "Countries" },
  { to: "/timeline", label: "Timeline" },
  { to: "/watchlist", label: "Watchlist" },
] as const;

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/40">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9 rounded-xl bg-hero-gradient grid place-items-center glow-cyan">
            <Radar className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold tracking-tight">Immigration Radar</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Global Intelligence</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card/40 backdrop-blur p-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="px-3.5 py-1.5 text-sm text-muted-foreground rounded-full transition data-[status=active]:bg-hero-gradient data-[status=active]:text-white data-[status=active]:glow-cyan hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/watchlist" className="inline-flex items-center gap-1.5 rounded-lg bg-hero-gradient text-white text-sm font-medium px-4 py-2 glow-cyan hover:opacity-90 transition">
            <Bell className="h-3.5 w-3.5" /> Alerts
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/50 backdrop-blur-xl bg-background/40 mt-24">
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
            <Link to="/" className="block hover:text-foreground">Dashboard</Link>
            <Link to="/updates" className="block hover:text-foreground">Database</Link>
            <Link to="/watchlist" className="block hover:text-foreground">Watchlist</Link>
            <Link to="/timeline" className="block hover:text-foreground">Timeline</Link>
          </div>
          <div className="space-y-1.5">
            <div className="text-foreground font-medium mb-2">Coverage</div>
            <Link to="/countries" className="block hover:text-foreground">Countries</Link>
            <a className="block hover:text-foreground" href="#">Visa types</a>
            <a className="block hover:text-foreground" href="#">Sources</a>
            <a className="block hover:text-foreground" href="#">Methodology</a>
          </div>
        </div>
        <div className="text-xs text-muted-foreground md:text-right">
          © {new Date().getFullYear()} Immigration Radar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-radar opacity-70" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[color:var(--primary)]/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-[color:var(--accent)]/20 blur-3xl animate-float-slow" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description?: string; action?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-[color:var(--primary)]">{eyebrow}</div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter leading-tight">{title}</h1>
          {description && <p className="text-muted-foreground text-lg">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </section>
  );
}

export { ArrowUpRight };
