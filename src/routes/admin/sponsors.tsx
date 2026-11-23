import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, FileEdit, Trash2, Globe } from "lucide-react";
import { fetchSponsors, type SponsorOrganization } from "@/lib/data-service";
import { deleteSponsor } from "@/lib/admin.functions";
import { SponsorForm } from "@/components/admin/SponsorForm";

export const Route = createFileRoute("/admin/sponsors")({
    loader: async () => {
        const sponsors = await fetchSponsors();
        return { sponsors };
    },
    component: AdminSponsorsManager
});

function AdminSponsorsManager() {
    const router = useRouter();
    const { sponsors: initialSponsors } = Route.useLoaderData();
    const [sponsors, setSponsors] = useState<SponsorOrganization[]>(initialSponsors);
    const [search, setSearch] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<SponsorOrganization | null>(null);

    const filtered = sponsors.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.country_code.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this sponsor? This will also delete all associated jobs.")) return;
        setIsDeleting(id);
        try {
            await deleteSponsor({ data: { id } });
            setSponsors(prev => prev.filter(s => s.id !== id));
            router.invalidate();
        } catch (e: any) {
            alert("Failed to delete record: " + e.message);
        }
        setIsDeleting(null);
    };

    const handleFormSuccess = (saved: SponsorOrganization) => {
        if (editingSponsor) {
            setSponsors(prev => prev.map(s => s.id === saved.id ? saved : s));
        } else {
            setSponsors(prev => [saved, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
        }
        router.invalidate();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {isFormOpen && (
                <SponsorForm 
                    initialData={editingSponsor} 
                    onClose={() => setIsFormOpen(false)} 
                    onSuccess={handleFormSuccess} 
                />
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Sponsors Manager</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">Manage organizations that offer visa sponsorships globally.</p>
                </div>
                <button onClick={() => { setEditingSponsor(null); setIsFormOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500/30">
                    <Plus className="h-4 w-4" /> Add Sponsor
                </button>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
                <div className="p-4 border-b border-border/40 flex flex-wrap items-center gap-4 justify-between bg-black/20">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search sponsors by name or country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-border/50 bg-background/50 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none transition"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/[0.02] text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                            <tr>
                                <th className="px-6 py-4 border-b border-border/40">Organization</th>
                                <th className="px-6 py-4 border-b border-border/40">Country</th>
                                <th className="px-6 py-4 border-b border-border/40">Status</th>
                                <th className="px-6 py-4 border-b border-border/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20 text-foreground/90 font-medium">
                            {filtered.map(s => (
                                <tr key={s.id} className="hover:bg-white/[0.02] transition group">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-semibold">{s.name}</div>
                                        {s.industry && <div className="text-xs text-muted-foreground">{s.industry}</div>}
                                    </td>
                                    <td className="px-6 py-4">{s.country_code}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${s.sponsor_status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {s.sponsor_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {s.website_url && (
                                                <a href={s.website_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white transition">
                                                    <Globe className="h-4 w-4" />
                                                </a>
                                            )}
                                            <button onClick={() => { setEditingSponsor(s); setIsFormOpen(true); }} className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white transition">
                                                <FileEdit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(s.id)} disabled={isDeleting === s.id} className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition disabled:opacity-50">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
