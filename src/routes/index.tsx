import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Globe2,
  ArrowUpRight,
  Search,
  ShieldCheck,
  Bell,
  Scale,
  Calculator,
  BrainCircuit,
  History,
  Sparkles,
  ArrowRight,
  Building2,
  Calendar,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  fetchChanges,
  fetchCountries,
  type ImmigrationChange,
  type Country,
} from "@/lib/data-service";
import { ChangeCard } from "@/components/change-card";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [changes, countries] = await Promise.all([
      fetchChanges(),
      fetchCountries(),
    ]);
    return { changes, countries };
  },
  head: () => ({
    meta: [
      { title: "Immigration Radar — Live Global Immigration Intelligence & Policy Tracking" },
      {
        name: "description",
        content:
          "Monitor global immigration rule changes, salary thresholds, visa categories, and legal deadlines across 40+ countries directly from verified official sources.",
      },
      { property: "og:title", content: "Immigration Radar — Live Global Immigration Intelligence" },
      {
        property: "og:description",
        content:
          "Track immigration policy changes, salary thresholds, and visa rules across 40+ countries.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const loaderData = Route.useLoaderData();
  const changes = Array.isArray(loaderData?.changes) ? loaderData.changes : [];
  const countries = Array.isArray(loaderData?.countries) ? loaderData.countries : [];
  const latestChanges = changes.slice(0, 4);
  const urgentCount = changes.filter((c) => c?.status === "urgent").length;

  return (
    <main className="space-y-20 pb-24">
      {/* 1. Hero Section */}
      <HeroSection countries={countries} urgentCount={urgentCount} totalChanges={changes.length} />

      <div className="mx-auto max-w-7xl px-6 space-y-24">
        {/* 2. Live Intelligence / Recent Changes Feed */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--primary)] font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Live Policy Wire
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold mt-1.5 text-foreground">
                Recent Immigration Rule Changes
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Verified amendments to minimum salary thresholds, dependants, category draws, and post-study rights.
              </p>
            </div>
            <Link
              to="/updates"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--primary)] hover:underline"
            >
              Explore all {changes.length} updates <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {latestChanges.map((change) => (
              <ChangeCard key={change.id} change={change} />
            ))}
            {latestChanges.length === 0 && (
              <div className="py-16 text-center text-muted-foreground rounded-2xl border border-border bg-card/40">
                No immigration policy changes logged yet.
              </div>
            )}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/updates"
              className="inline-flex items-center gap-2 rounded-xl bg-card border border-border/80 px-6 py-3 text-sm font-medium hover:border-[color:var(--primary)]/50 hover:bg-white/[0.02] transition shadow-sm"
            >
              Browse Full Policy Database & Archive <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* 3. Global Jurisdictions / Country Portals */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--accent)] font-semibold flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5" />
                Global Coverage
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold mt-1.5 text-foreground">
                Monitored Country Portals
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Official immigration authorities, key visa categories, and legislative updates tracked per jurisdiction.
              </p>
            </div>
            <Link
              to="/countries"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--primary)] hover:underline"
            >
              View all jurisdictions <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {countries.map((country) => (
              <CountryPortalCard key={country.code} country={country} />
            ))}
          </div>
        </section>

        {/* 4. Strategic Immigration Intelligence Tools */}
        <section className="space-y-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[color:var(--primary)] font-semibold flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Strategic Tools
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mt-1.5 text-foreground">
              Interactive Immigration Intelligence
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Quantitative modeling, eligibility calculations, and cross-border policy comparisons.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard
              to="/calculator"
              icon={<Calculator className="h-6 w-6 text-cyan-400" />}
              title="Global Cost Simulator"
              description="Calculate total visa application fees, NHS/health surcharges, and proof-of-funds requirements across major destinations."
              badge="Financial Modeling"
            />
            <ToolCard
              to="/eligibility"
              icon={<BrainCircuit className="h-6 w-6 text-purple-400" />}
              title="Eligibility Predictor"
              description="Benchmark your age, language skills, and occupation against national shortage lists and point tests."
              badge="Viability Score"
            />
            <ToolCard
              to="/compare"
              icon={<Scale className="h-6 w-6 text-amber-400" />}
              title="Policy Comparison"
              description="Side-by-side comparative matrix of salary thresholds, settlement timelines, and dependant rights."
              badge="Comparative Matrix"
            />
            <ToolCard
              to="/timeline"
              icon={<History className="h-6 w-6 text-emerald-400" />}
              title="Historical Timeline"
              description="Chronological ledger of legislative shifts and reform trajectories over recent immigration cycles."
              badge="Legislative Archive"
            />
          </div>
        </section>

        {/* 5. Watchlist & Email Alerts CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card/80 via-card/40 to-background p-8 md:p-12 shadow-elegant">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[color:var(--primary)]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 px-3 py-1 text-xs font-medium text-[color:var(--primary)]">
              <Bell className="h-3.5 w-3.5" /> Real-Time Regulatory Alerts
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
              Never get caught off-guard by a sudden rule change.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Create a personalized immigration watchlist. Specify the countries, visa routes, and threshold categories that matter to your casework or relocation plans, and receive verified alerts the moment changes are gazetted.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/watchlist"
                className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-black glow-cyan hover:opacity-90 transition"
              >
                Configure My Watchlist <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/updates"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-card transition"
              >
                Search Database First
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function HeroSection({
  countries,
  urgentCount,
  totalChanges,
}: {
  countries: Country[];
  urgentCount: number;
  totalChanges: number;
}) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/updates",
      search: {
        q: keyword,
        country: selectedCountry || "all",
        visa: "all",
        status: "all",
        from: "",
        to: "",
        sort: "date_desc",
        page: 1,
      },
    });
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 border-b border-border/40 bg-radial-gradient">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[color:var(--primary)]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-4xl px-6 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 backdrop-blur-md px-3.5 py-1.5 text-xs text-muted-foreground shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
          <span>Active Intelligence Feed</span>
          <span className="text-border">|</span>
          <span className="text-foreground font-medium">{countries.length} Jurisdictions</span>
          <span className="text-border">|</span>
          <span className="text-red-400 font-medium">{urgentCount} Urgent Alerts</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground">
          Global Immigration Intelligence,{" "}
          <span className="text-gradient">Tracked in Real Time</span>.
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Monitor visa policy amendments, minimum salary thresholds, quota changes, and official deadlines directly from verified government gazettes and authorities.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 rounded-2xl bg-hero-gradient opacity-20 blur transition group-hover:opacity-35" />
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-card border border-border/80 rounded-2xl shadow-elegant overflow-hidden p-2 gap-2">
            <div className="flex items-center flex-1 px-3">
              <Search className="h-5 w-5 text-muted-foreground mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search rule changes, salary limits, NOC codes..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-2 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="h-6 w-px bg-border/60 hidden sm:block" />

            <div className="flex items-center px-3 sm:w-56">
              <Globe2 className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-2 text-sm text-foreground cursor-pointer"
              >
                <option value="" className="bg-background text-foreground">
                  All Countries
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name} className="bg-background text-foreground">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-[color:var(--primary)] text-black font-semibold px-6 py-2.5 rounded-xl glow-cyan hover:opacity-90 transition whitespace-nowrap text-sm"
            >
              Search Intelligence
            </button>
          </div>
        </form>

        {/* Badges / Value Props */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[color:var(--primary)]" /> Verified Government Sources
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-purple-400" /> Home Office, IRCC, USCIS, BAMF
          </div>
          <div className="flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-emerald-400" /> Salary & Points Benchmarks
          </div>
        </div>
      </div>
    </section>
  );
}

function CountryPortalCard({ country }: { country: Country }) {
  if (!country) return null;
  const slug = country.slug || country.code?.toLowerCase() || "";
  const flag = country.flag || "🌐";
  const name = country.name || "Jurisdiction";
  const authority = country.authority || "Immigration Authority";
  const tracked = country.tracked ?? 0;
  const updates = country.updates ?? 0;
  const visaTypesCount = Array.isArray(country.visa_types) ? country.visa_types.length : 0;

  return (
    <Link
      to="/$countrySlug"
      params={{ countrySlug: slug }}
      className="group block h-full"
    >
      <div className="relative rounded-2xl border border-border/80 bg-card-gradient p-6 h-full flex flex-col hover:border-[color:var(--primary)]/40 hover:shadow-elegant transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-background/80 border border-border grid place-items-center text-2xl shadow-sm">
              {flag}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-[color:var(--primary)] transition-colors">
                {name}
              </h3>
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3" /> {authority}
              </div>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-[color:var(--primary)] transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40 my-auto text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Rules Monitored</div>
            <div className="text-base font-bold text-foreground mt-0.5">{tracked}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Active Changes</div>
            <div className="text-base font-bold text-[color:var(--primary)] mt-0.5">{updates}</div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{visaTypesCount} Visa Categories</span>
          <span className="text-[color:var(--primary)] font-medium group-hover:underline">Explore Portal &rarr;</span>
        </div>
      </div>
    </Link>
  );
}

function ToolCard({
  to,
  icon,
  title,
  description,
  badge,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <Link to={to} className="group block h-full">
      <div className="rounded-2xl border border-border/80 bg-card-gradient p-6 h-full flex flex-col hover:border-[color:var(--primary)]/40 hover:shadow-elegant transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-xl bg-background/80 border border-border grid place-items-center">
            {icon}
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-background border border-border text-muted-foreground">
            {badge}
          </span>
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-[color:var(--primary)] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-[color:var(--primary)]">
          <span>Launch Tool</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
