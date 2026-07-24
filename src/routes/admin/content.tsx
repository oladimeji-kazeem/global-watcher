import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Database, FileEdit, Trash2, Plus, Search, Filter, AlertCircle } from "lucide-react";
import { fetchChanges, type ImmigrationChange } from "@/lib/data-service";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/content")({
    loader: async () => {
        const changes = await fetchChanges();
        return { changes };
    },
    component: AdminContentManager
});

function AdminContentManager() {
    const { changes: initialChanges } = Route.useLoaderData();
    const [changes, setChanges] = useState<ImmigrationChange[]>(initialChanges);
    const [search, setSearch] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const filtered = changes.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this record? This action cannot be undone.")) return;

        setIsDeleting(id);
        const { error } = await (supabase as any).from('immigration_changes').delete().eq('id', id);

        if (!error) {
            setChanges(prev => prev.filter(c => c.id !== id));
        } else {
            alert("Failed to delete record. Please try again.");
        }
        setIsDeleting(null);
    };

    const handleEdit = (id: string) => {
        alert(`Edit Action Triggered for Record ID: ${id}\n\nIn a full production environment, this would open a side-drawer or modal with the Supabase connected form to mutate this row.`);
    };

    const handleAdd = () => {
        alert("Add Record Triggered.\n\nIn production, this opens the Supabase mutation form for the immigration_changes table.");
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Content Manager</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">Manage immigration updates, alerts, and country master data. Changes made here securely reflect in the Supabase production database.</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 shadow-elegant glow-cyan">
                    <Plus className="h-4 w-4" /> Create New Update
                </button>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border/40 flex flex-wrap items-center gap-4 justify-between bg-black/20">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search database records by title or country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-border/50 bg-background/50 pl-10 pr-4 py-2 text-sm focus:border-[color:var(--primary)] focus:outline-none transition"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white transition">
                            <Filter className="h-4 w-4" /> Filter Rules
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white transition">
                            <Database className="h-4 w-4" /> Sync DB
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/[0.02] text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                            <tr>
                                <th className="px-6 py-4 border-b border-border/40 font-semibold">Country</th>
                                <th className="px-6 py-4 border-b border-border/40 font-semibold w-full">Update Title (Rule Change)</th>
                                <th className="px-6 py-4 border-b border-border/40 font-semibold">Status</th>
                                <th className="px-6 py-4 border-b border-border/40 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20 text-foreground/90 font-medium">
                            {filtered.map(c => (
                                <tr key={c.id} className="hover:bg-white/[0.02] transition group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg leading-none">{c.flag}</span>
                                            {c.country}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="truncate max-w-md text-white font-semibold">{c.title}</div>
                                        <div className="truncate max-w-md text-xs text-muted-foreground mt-0.5 font-normal">{c.visa_type} &middot; {c.category}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${c.status === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                            c.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                c.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(c.id)}
                                                className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white transition"
                                                title="Edit Record"
                                            >
                                                <FileEdit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                disabled={isDeleting === c.id}
                                                className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition disabled:opacity-50"
                                                title="Delete Record"
                                            >
                                                {isDeleting === c.id ? <AlertCircle className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No database records found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
