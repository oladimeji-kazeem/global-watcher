import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bell, Check, Info, Mail, Radar, Sparkles } from "lucide-react";
import { statusStyles, formatDate, type ChangeStatus, fetchChanges, getFilterOptions } from "@/lib/data-service";
import { PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/_authenticated/watchlist")({
  loader: async () => {
    const [changes, options] = await Promise.all([fetchChanges(), getFilterOptions()]);
    return { changes, options };
  },
  head: () => ({
    meta: [
      { title: "My Watchlist — Immigration Radar" },
      { name: "description", content: "Build a personal immigration watchlist by country and visa type. Get email alerts when official sources publish matching changes." },
    ],
  }),
  component: WatchlistPage,
});

interface Preferences {
  email: string;
  countries: string[];
  visaTypes: string[];
  statuses: ChangeStatus[];
  frequency: "instant" | "daily" | "weekly";
  enabled: boolean;
}

const DEFAULTS: Preferences = {
  email: "",
  countries: ["United Kingdom", "Canada"],
  visaTypes: [],
  statuses: ["urgent", "warning"],
  frequency: "instant",
  enabled: true,
};

function loadPrefs(): Preferences {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem("ir:prefs");
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch { return DEFAULTS; }
}

function WatchlistPage() {
  const { changes, options: { countries, visaTypes: allVisaTypes, statuses: allStatuses } } = Route.useLoaderData();
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setPrefs(loadPrefs()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("ir:prefs", JSON.stringify(prefs)); }, [prefs, hydrated]);

  const toggle = <K extends keyof Preferences>(key: K, value: string) =>
    setPrefs((p) => {
      const arr = p[key] as unknown as string[];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...p, [key]: next } as Preferences;
    });

  const matches = useMemo(() => {
    return changes.filter((c) => {
      if (prefs.countries.length && !prefs.countries.includes(c.country)) return false;
      if (prefs.visaTypes.length && !prefs.visaTypes.includes(c.visa_type)) return false;
      if (prefs.statuses.length && !prefs.statuses.includes(c.status)) return false;
      return true;
    });
  }, [prefs, changes]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main>
      <PageHeader
        eyebrow="My watchlist"
        title={<>Get alerted the moment <span className="text-gradient">your rules change</span></>}
        description="Pick the countries, visa types and severity levels you care about. Radar will only email you when a published change matches — every alert includes the official source link."
      />

      <div className="mx-auto max-w-7xl px-6 pb-24 grid lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Preferences form */}
        <form onSubmit={save} className="rounded-2xl ring-gradient bg-card-gradient p-6 md:p-8 space-y-8">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-[color:var(--primary)]" /> Email address</label>
            <input
              type="email" required value={prefs.email}
              onChange={(e) => setPrefs({ ...prefs, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm outline-none focus:border-[color:var(--primary)]/60 focus:glow-cyan transition"
            />
            <p className="text-xs text-muted-foreground">Alerts go to this address whenever a published change matches your criteria.</p>
          </div>

          {/* Countries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Countries</label>
              <button type="button" onClick={() => setPrefs({ ...prefs, countries: [] })} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => {
                const on = prefs.countries.includes(c.name);
                return (
                  <button key={c.code} type="button" onClick={() => toggle("countries", c.name)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${on ? "border-[color:var(--primary)]/50 bg-[color:var(--primary)]/10 text-foreground glow-cyan" : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                      }`}>
                    <span>{c.flag}</span>{c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visa types */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Visa types</label>
              <button type="button" onClick={() => setPrefs({ ...prefs, visaTypes: [] })} className="text-xs text-muted-foreground hover:text-foreground">All types</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allVisaTypes.map((v) => {
                const on = prefs.visaTypes.includes(v);
                return (
                  <button key={v} type="button" onClick={() => toggle("visaTypes", v)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${on ? "border-[color:var(--accent)]/50 bg-[color:var(--accent)]/10 text-foreground" : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                      }`}>{v}</button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Leave empty to receive alerts for every visa type in your selected countries.</p>
          </div>

          {/* Severity */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Severity</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allStatuses.map((s) => {
                const style = statusStyles[s];
                const on = prefs.statuses.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggle("statuses", s)}
                    className={`rounded-xl border px-3 py-2.5 text-xs flex items-center justify-between transition ${on ? style.badge : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                      }`}>
                    <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />{style.label}</span>
                    {on && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Alert frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {(["instant", "daily", "weekly"] as const).map((f) => {
                const on = prefs.frequency === f;
                return (
                  <button key={f} type="button" onClick={() => setPrefs({ ...prefs, frequency: f })}
                    className={`rounded-xl border px-3 py-2.5 text-xs capitalize transition ${on ? "border-[color:var(--primary)]/50 bg-[color:var(--primary)]/10 glow-cyan" : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                      }`}>{f}</button>
                );
              })}
            </div>
          </div>

          {/* Toggle + save */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="relative inline-flex h-6 w-11 shrink-0">
                <input type="checkbox" className="peer sr-only"
                  checked={prefs.enabled}
                  onChange={(e) => setPrefs({ ...prefs, enabled: e.target.checked })} />
                <span className="absolute inset-0 rounded-full bg-muted peer-checked:bg-hero-gradient transition" />
                <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
              </span>
              <span className="text-sm">Email alerts {prefs.enabled ? "enabled" : "paused"}</span>
            </label>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-hero-gradient text-white font-medium px-5 py-3 glow-cyan hover:opacity-95 transition">
              <Sparkles className="h-4 w-4" /> Save preferences
            </button>
          </div>

          {saved && (
            <div className="rounded-xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)] px-4 py-3 text-sm flex items-center gap-2">
              <Check className="h-4 w-4" /> Preferences saved to this browser. Live email delivery activates once your workspace enables notifications.
            </div>
          )}

          <div className="rounded-xl border border-border bg-background/40 p-4 text-xs text-muted-foreground flex gap-3">
            <Info className="h-4 w-4 text-[color:var(--info)] mt-0.5 shrink-0" />
            <p>
              Live email dispatch requires the platform admin to enable the notification backend and verify a sender domain.
              Until then, your matches are shown live below and your preferences are saved locally.
            </p>
          </div>
        </form>

        {/* Live matches preview */}
        <aside className="space-y-4">
          <div className="rounded-2xl ring-gradient bg-card-gradient p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-hero-gradient grid place-items-center glow-cyan"><Bell className="h-4 w-4 text-white" /></div>
              <div>
                <div className="text-sm font-semibold">Preview: matching alerts</div>
                <div className="text-xs text-muted-foreground">{matches.length} of {changes.length} tracked changes match your criteria</div>
              </div>
            </div>
            <div className="space-y-3">
              {matches.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No changes match yet. Add more countries or lower the severity filter.
                </div>
              )}
              {matches.map((c) => {
                const s = statusStyles[c.status];
                return (
                  <Link key={c.id} to="/updates/$id" params={{ id: c.id }}
                    className="block rounded-xl border border-border bg-background/50 p-4 hover:bg-background/80 transition">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${s.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{c.flag} {c.country} · {c.visa_type}</span>
                    </div>
                    <div className="text-sm font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">Effective {formatDate(c.effective_date)} · Source: {c.source_name}</div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 mb-2 text-foreground text-sm font-medium">
              <Radar className="h-4 w-4 text-[color:var(--primary)]" /> How your alerts work
            </div>
            <ol className="space-y-1.5 list-decimal list-inside">
              <li>Radar monitors official immigration sources continuously.</li>
              <li>New changes are reviewed by our editorial team before publishing.</li>
              <li>Published changes are matched against your saved criteria.</li>
              <li>Matching changes are emailed to you with the official source link.</li>
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}
