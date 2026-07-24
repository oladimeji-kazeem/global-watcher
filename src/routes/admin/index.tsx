import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, TrendingUp, Users, Search, Globe2, Eye, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/")({
    component: AdminAnalyticsDashboard
});

const monthlyTraffic = [
    { name: 'Feb', visits: 12400, organic: 8200 },
    { name: 'Mar', visits: 18500, organic: 11000 },
    { name: 'Apr', visits: 24800, organic: 16500 },
    { name: 'May', visits: 39600, organic: 28400 },
    { name: 'Jun', visits: 52400, organic: 39100 },
    { name: 'Jul', visits: 81500, organic: 62400 },
];

const jurisdictionTraffic = [
    { name: 'United Kingdom', views: 32400 },
    { name: 'Canada', views: 25100 },
    { name: 'United States', views: 18200 },
    { name: 'Australia', views: 14500 },
    { name: 'Germany', views: 9800 },
];

const resourceDistribution = [
    { name: 'Visa Changes', value: 45 },
    { name: 'Salary Thresholds', value: 30 },
    { name: 'General Rules', value: 15 },
    { name: 'Timeline History', value: 10 },
];

const COLORS = ['#2DA099', '#3b82f6', '#8b5cf6', '#eab308'];

function AdminAnalyticsDashboard() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Web Analytics & SEO</h1>
                <p className="text-muted-foreground text-sm">Monitor platform traffic, accessed resources, and organic search performance across global jurisdictions.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: "Total Pageviews (30d)", value: "142.6K", trend: "+24.5%", icon: Eye, color: "text-blue-400" },
                    { label: "Organic Search SEO", value: "88.2K", trend: "+18.2%", icon: Search, color: "text-[color:var(--primary)]" },
                    { label: "Active Registered Users", value: "3,192", trend: "+12.1%", icon: Users, color: "text-purple-400" },
                    { label: "Jurisdictions Monitored", value: "6", trend: "Stable", icon: Globe2, color: "text-green-400" },
                ].map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={i} className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Icon className={`h-5 w-5 ${kpi.color}`} />
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                                    <TrendingUp className="h-3 w-3" /> {kpi.trend}
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
                            <h3 className="text-lg font-semibold text-white">Traffic Growth</h3>
                            <p className="text-xs text-muted-foreground mt-1">Total visits vs Organic SEO acquisition over 6 months</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Total Visits</div>
                            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" /> Organic SEO</div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2DA099" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2DA099" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid #27272a' }} itemStyle={{ color: '#fff' }} />
                                <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                                <Area type="monotone" dataKey="organic" stroke="#2DA099" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Resource Distribution */}
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6 flex flex-col items-center justify-center">
                    <div className="w-full text-left mb-2">
                        <h3 className="text-lg font-semibold text-white">Accessed Resources</h3>
                        <p className="text-xs text-muted-foreground mt-1">What users are tracking</p>
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
                    <div className="w-full grid grid-cols-2 gap-3 mt-4">
                        {resourceDistribution.map((r, i) => (
                            <div key={r.name} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} /> {r.name}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Chart Row 2 */}
            <div className="grid lg:grid-cols-2 gap-6 pb-12">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-6">
                    <h3 className="text-lg font-semibold text-white">Views by Jurisdiction</h3>
                    <p className="text-xs text-muted-foreground mt-1 mb-6">Traffic segmented by country routes</p>
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
                    <h3 className="text-xl font-semibold text-white mb-2">SEO Health Status: <span className="text-[color:var(--primary)] text-gradient">Excellent</span></h3>
                    <p className="text-sm text-foreground/80 leading-relaxed max-w-sm mb-6">
                        Platform meta-tags, OpenGraph social cards, and semantic HTML routing are fully compliant with search engine guidelines. Organic reach across jurisdictions remains strong.
                    </p>
                    <button className="px-6 py-2.5 rounded-lg border border-border/60 hover:bg-white/5 transition text-sm font-semibold text-white flex items-center gap-2">
                        Generate Report <ArrowUpRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

        </div>
    );
}
