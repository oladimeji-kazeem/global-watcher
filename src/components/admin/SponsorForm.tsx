import { useState } from "react";
import { type SponsorOrganization, fetchCountries } from "@/lib/data-service";
import { createSponsor, updateSponsor } from "@/lib/admin.functions";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function SponsorForm({ 
    initialData, 
    onClose, 
    onSuccess 
}: { 
    initialData: SponsorOrganization | null, 
    onClose: () => void, 
    onSuccess: (data: SponsorOrganization) => void 
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: countries = [] } = useQuery({
        queryKey: ["countries"],
        queryFn: fetchCountries
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const updates = {
            name: formData.get("name") as string,
            country_code: formData.get("country_code") as string,
            website_url: formData.get("website_url") as string,
            industry: formData.get("industry") as string,
            sponsor_status: formData.get("sponsor_status") as string,
            notes: formData.get("notes") as string,
        };

        try {
            if (initialData?.id) {
                const updated = await updateSponsor({ data: { id: initialData.id, ...updates } });
                onSuccess(updated as SponsorOrganization);
            } else {
                const inserted = await createSponsor({ data: updates });
                onSuccess(inserted as SponsorOrganization);
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
                <h2 className="text-xl font-semibold mb-6">{initialData ? 'Edit Sponsor' : 'Add New Sponsor'}</h2>
                
                {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Organization Name</label>
                            <input required name="name" defaultValue={initialData?.name} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Country</label>
                            <select required name="country_code" defaultValue={initialData?.country_code} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                                <option value="">Select Country...</option>
                                {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Website URL</label>
                            <input name="website_url" type="url" defaultValue={initialData?.website_url || ""} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Industry</label>
                            <input name="industry" defaultValue={initialData?.industry || ""} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select required name="sponsor_status" defaultValue={initialData?.sponsor_status || 'active'} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                            <option value="active">Active (Currently Sponsoring)</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Internal Notes</label>
                        <textarea name="notes" defaultValue={initialData?.notes || ""} rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-white/5 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium bg-[color:var(--primary)] text-black rounded-lg hover:opacity-90 transition disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Sponsor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
