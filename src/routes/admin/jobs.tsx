import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, FileEdit, Trash2, ExternalLink } from "lucide-react";
import { fetchJobs, type SponsoredJob } from "@/lib/data-service";
import { deleteJob } from "@/lib/admin.functions";
import { JobForm } from "@/components/admin/JobForm";

export const Route = createFileRoute("/admin/jobs")({
    loader: async () => {
        const jobs = await fetchJobs();
        return { jobs };
    },
    component: AdminJobsManager
});

function AdminJobsManager() {
    const router = useRouter();
    const { jobs: initialJobs } = Route.useLoaderData();
    const [jobs, setJobs] = useState<SponsoredJob[]>(initialJobs);
    const [search, setSearch] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<SponsoredJob | null>(null);

    const filtered = jobs.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.sponsor?.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return;
        setIsDeleting(id);
        try {
            await deleteJob({ data: { id } });
            setJobs(prev => prev.filter(j => j.id !== id));
            router.invalidate();
        } catch (e: any) {
            alert("Failed to delete record: " + e.message);
        }
        setIsDeleting(null);
    };

    const handleFormSuccess = (saved: SponsoredJob) => {
        // Optimistic update requires refetch to get sponsor relation populated correctly
        // Instead of complex client state, we invalidate router to reload the jobs
        router.invalidate();
        setIsFormOpen(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {isFormOpen && (
                <JobForm 
                    initialData={editingJob} 
                    onClose={() => setIsFormOpen(false)} 
                    onSuccess={handleFormSuccess} 
                />
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Jobs Manager</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">Manage job postings from verified visa sponsors.</p>
                </div>
                <button onClick={() => { setEditingJob(null); setIsFormOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 px-5 py-2.5 text-sm font-semibold transition hover:bg-green-500/30">
                    <Plus className="h-4 w-4" /> Add Job Listing
                </button>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
                <div className="p-4 border-b border-border/40 flex flex-wrap items-center gap-4 justify-between bg-black/20">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search jobs by title or sponsor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-border/50 bg-background/50 pl-10 pr-4 py-2 text-sm focus:border-green-500 focus:outline-none transition"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/[0.02] text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                            <tr>
                                <th className="px-6 py-4 border-b border-border/40">Job Title</th>
                                <th className="px-6 py-4 border-b border-border/40">Sponsor</th>
                                <th className="px-6 py-4 border-b border-border/40">Status</th>
                                <th className="px-6 py-4 border-b border-border/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20 text-foreground/90 font-medium">
                            {filtered.map(j => (
                                <tr key={j.id} className="hover:bg-white/[0.02] transition group">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-semibold">{j.title}</div>
                                        <div className="text-xs text-muted-foreground">{j.location_city} &bull; {j.job_type}</div>
                                    </td>
                                    <td className="px-6 py-4">{j.sponsor?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${j.status === 'open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {j.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {j.source_url && (
                                                <a href={j.source_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white transition">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                            <button onClick={() => { setEditingJob(j); setIsFormOpen(true); }} className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-white transition">
                                                <FileEdit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(j.id)} disabled={isDeleting === j.id} className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition disabled:opacity-50">
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
