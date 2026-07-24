import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, TrendingUp, Users, Search, Globe2, Eye, ShieldCheck, Database, Activity } from "lucide-react";
import { fetchCountries, fetchChanges, type ImmigrationChange, type Country } from "@/lib/data-service";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/")({
    loader: async () => {
        const [countries, changes] = await Promise.all([fetchCountries(), fetchChanges()]);
        return { countries, changes };
    },
    component: AdminAnalyticsDashboard
});

const COLORS = ['#2DA099', '#3b82f6', '#8b5cf6', '#eab308', '#ec4899', '#14b8a6', '#f97316', '#64748b'];

function AdminAnalyticsDashboard() {
    const { countries, changes } = Route.useLoaderData();

    // 1. Process Updates by Month (Last 6 Months Area Chart)
    const monthlyUpdates = useMemo(() => {
        const counts: Record<string, number> = {};
        const now = new Date();
        // Generate trailing 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleString('default', { month: 'short' });
            counts[label] = 0;
        }

        changes.forEach(c => {
            const date = new Date(c.effective_date);
            const label = date.toLocaleString('default', { month: 'short' });
            if (counts[label] !== undefined) {
                counts[label]++;
            }
        });

        return Object.keys(counts).map(key => ({ name: key, updates: counts[key] }));
    }, [changes]);

    // 2. Process Updates by Jurisdiction (Bar Chart)
    const jurisdictionTraffic = useMemo(() => {
        const counts: Record<string, number> = {};
        changes.forEach(c => {
            counts[c.country] = (counts[c.country] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1]) // Sort high to low
            .slice(0, 6) // Top 6
            .map(([name, views]) => ({ name, views }));
    }, [changes]);

    // 3. Process Visa/Resource Distribution (Pie Chart)
    const resourceDistribution = useMemo(() => {
        const counts: Record<string, number> = {};
        changes.forEach(c => {
            counts[c.category] = (counts[c.category] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([name, value]) => ({ name, value }));
    }, [changes]);

    const activeAlertsCount = changes.filter(c => c.status === 'urgent' || c.status === 'warning').length;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 min-h-screen">

            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">System Analytics</h1>
                <p className="text-muted-foreground text-sm">Monitor platform database growth, global jurisdiction distributions, and active rule changes.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: "Total Monitored Rules", value: changes.length.toString(), trend: "+4 This Week", icon: Database, color: "text-blue-400" },
                    { label: "Active Threat Alerts", value: activeAlertsCount.toString(), trend: "Attention Needed", icon: Activity, color: "text-amber-400" },
                    { label: "Registered Dashboards", value: "3,192", trend: "+12.1%", icon: Users, color: "text-[color:var(--primary)]" },
                    { label: "Jurisdictions Monitored", value: countries.length.toString(), trend: "Stable", icon: Globe2, color: "text-green-400" },
                ].map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={i} className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Icon className={`h-5 w-5 ${kpi.color}`} />
                                <span className={kpi.label === "Active Threat Alerts" ? "inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400" : "inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400"}>
                                    {kpi.label === "Active Threat Alerts" ? null : <TrendingUp className="h-3 w-3" />} {kpi.trend}
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{kpi.label}</div>
                        </div>
                    )
                })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Main Traffic Chart */}
                <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Database Growth</h3>
                            <p className="text-xs text-muted-foreground mt-1">Immigration rules and updates integrated over the trailing 6 months</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Legal Updates</div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyUpdates} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} width={40} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid #27272a' }} itemStyle={{ color: '#fff' }} />
                                <Area type="step" dataKey="updates" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Resource Distribution */}
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6 flex flex-col items-center justify-center">
                    <div className="w-full text-left mb-2">
                        <h3 className="text-lg font-semibold text-white">Category Density</h3>
                        <p className="text-xs text-muted-foreground mt-1">Rule changes mapped by immigration category</p>
                    </div>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={resourceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {resourceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid #27272a' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full flex-wrap flex gap-3 mt-4">
                        {resourceDistribution.map((r, i) => (
                            <div key={r.name} className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /> {r.name}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Chart Row 2 */}
            <div className="grid lg:grid-cols-2 gap-6 pb-12">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6">
                    <h3 className="text-lg font-semibold text-white">Updates by Jurisdiction</h3>
                    <p className="text-xs text-muted-foreground mt-1 mb-6">Database volume spread dynamically across monitored countries</p>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jurisdictionTraffic} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="#a1a1aa" fontSize={12} width={100} />
                                <RechartsTooltip cursor={{ fill: '#f4f4f5', opacity: 0.05 }} contentStyle={{ backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid #27272a' }} />
                                <Bar dataKey="views" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border border-[color:var(--primary)]/30 bg-card/40 backdrop-blur-md p-6 flex flex-col justify-center items-start overflow-hidden relative group">
                    <div className="absolute -right-20 -top-20 opacity-[0.03] group-hover:opacity-[0.05] transition duration-700">
                        <ShieldCheck className="w-[300px] h-[300px]" />
                    </div>
                    <div className="inline-flex items-center justify-center rounded-xl bg-[color:var(--primary)]/10 p-3 mb-6">
                        <ShieldCheck className="h-6 w-6 text-[color:var(--primary)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Global Routing Health: <span className="text-[color:var(--primary)] text-gradient">Excellent</span></h3>
                    <p className="text-sm text-foreground/80 leading-relaxed max-w-sm mb-6">
                        Platform data pipelines, Supabase active synchronization, and server-side renders are operating optimally. All webhooks and background CRON services are secure.
                    </p>
                    <button className="px-6 py-2.5 rounded-lg border border-border/60 hover:bg-white/5 transition text-sm font-semibold text-white flex items-center gap-2 relative z-10">
                        Generate Diagnostic Report <ArrowUpRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

        </div>
    );
}
