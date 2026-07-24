import { Link, useNavigate } from "@tanstack/react-router";
import { Radar, ArrowUpRight, Bell, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/updates", label: "Database" },
  { to: "/countries", label: "Countries" },
  { to: "/timeline", label: "Timeline" },
  { to: "/watchlist", label: "Watchlist" },
] as const;

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-sm z-50 rounded-2xl ring-gradient bg-card-gradient p-5 shadow-elegant flex flex-col gap-3">
      <div className="text-sm font-medium">Data Privacy & Cookies</div>
      <div className="text-xs text-muted-foreground leading-relaxed">
        We use essential cookies to provide our services and optional analytics cookies to understand how visitors use our platform.
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button onClick={() => { localStorage.setItem("cookie_consent", "all"); setVisible(false); }} className="px-4 py-2 rounded-xl bg-[color:var(--primary)] text-white text-xs font-semibold glow-cyan transition">Accept</button>
        <button onClick={() => { localStorage.setItem("cookie_consent", "essential"); setVisible(false); }} className="px-4 py-2 rounded-xl bg-background/50 border border-border text-xs font-medium hover:bg-background/80 transition">Essential Only</button>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setEmail(session?.user.email ?? null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/40">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 overflow-hidden">
            <img src="/logo.png" alt="Immigration Radar Logo" className="h-full w-full object-contain" />
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
          {ready && email ? (
            <>
              <Link to="/watchlist" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-hero-gradient text-white text-sm font-medium px-4 py-2 glow-cyan hover:opacity-90 transition">
                <Bell className="h-3.5 w-3.5" /> Alerts
              </Link>
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
                <UserIcon className="h-3.5 w-3.5" /> {email}
              </div>
              <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 text-sm px-3 py-2 hover:bg-background/70 transition">
                <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-lg bg-hero-gradient text-white text-sm font-medium px-4 py-2 glow-cyan hover:opacity-90 transition">
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </Link>
          )}
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
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-display font-semibold text-lg">Immigration Radar</span>
          </div>
          <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
            This is just information sourced from various countries' sites and portals. We are neither immigration consultants nor an immigration law firm. All information provided is for general guidance only and should not be taken as legal advice.
          </p>
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
      <CookieBanner />
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
