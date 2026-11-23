import { useState } from "react";
import { fetchSponsors, type SponsoredJob, type SponsorOrganization } from "@/lib/data-service";
import { createJob, updateJob } from "@/lib/admin.functions";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function JobForm({ 
    initialData, 
    onClose, 
    onSuccess 
}: { 
    initialData: SponsoredJob | null, 
    onClose: () => void, 
    onSuccess: (data: SponsoredJob) => void 
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: sponsors = [] } = useQuery({
        queryKey: ["sponsors"],
        queryFn: () => fetchSponsors()
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const updates = {
            title: formData.get("title") as string,
            sponsor_id: formData.get("sponsor_id") as string,
            location_city: formData.get("location_city") as string,
            job_type: formData.get("job_type") as string,
            source_url: formData.get("source_url") as string,
            status: formData.get("status") as string,
            requirements: formData.get("requirements") as string,
        };

        try {
            if (initialData?.id) {
                const updated = await updateJob({ data: { id: initialData.id, ...updates } });
                onSuccess(updated as SponsoredJob);
            } else {
                const inserted = await createJob({ data: updates });
                onSuccess(inserted as SponsoredJob);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition">
                    <X className="h-5 w-5 text-muted-foreground" />
                </button>
                <h2 className="text-xl font-semibold mb-6">{initialData ? 'Edit Job' : 'Add New Job'}</h2>
                
                {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Job Title</label>
                            <input required name="title" defaultValue={initialData?.title} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sponsor Organization</label>
                            <select required name="sponsor_id" defaultValue={initialData?.sponsor_id} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                                <option value="">Select Sponsor...</option>
                                {(sponsors as SponsorOrganization[]).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">City Location</label>
                            <input name="location_city" defaultValue={initialData?.location_city || ""} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Job Type</label>
                            <select name="job_type" defaultValue={initialData?.job_type || "Full-time"} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                                <option value="Full-time">Full-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Part-time">Part-time</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Source URL (Apply Link)</label>
                            <input required name="source_url" type="url" defaultValue={initialData?.source_url || ""} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select required name="status" defaultValue={initialData?.status || 'open'} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Requirements / Description</label>
                        <textarea name="requirements" defaultValue={initialData?.requirements || ""} rows={4} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-white/5 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium bg-[color:var(--primary)] text-black rounded-lg hover:opacity-90 transition disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
