import React, { useState } from "react";
import { type ImmigrationChange, type ChangeStatus } from "@/lib/data-service";
import { createChange, updateChange } from "@/lib/admin.functions";
import { broadcastToSocialMedia } from "@/lib/social.functions";

export function ChangeForm({
  initialData,
  onClose,
  onSuccess
}: {
  initialData?: ImmigrationChange | null;
  onClose: () => void;
  onSuccess: (change: ImmigrationChange) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [broadcastSocial, setBroadcastSocial] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(fd.entries());
    
    // Convert key points string to array
    if (data.key_points && typeof data.key_points === "string") {
      data.key_points = data.key_points.split("\n").filter((l: string) => l.trim().length > 0);
    } else {
      data.key_points = [];
    }

    try {
      let result;
      if (initialData) {
        result = await updateChange({ data: { id: initialData.id, ...data } });
      } else {
        // Generate a random ID if none provided
        data.id = data.id || `change-${Date.now()}`;
        result = await createChange({ data });
      }

      if (broadcastSocial && (result?.id || initialData?.id)) {
        try {
          await broadcastToSocialMedia({ data: { changeId: (result as any)?.id || initialData!.id } });
        } catch (e) {
          console.error("Social broadcast failed:", e);
        }
      }

      onSuccess(result as ImmigrationChange);
      onClose();
    } catch (err: any) {
      alert("Error saving record: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-3xl rounded-2xl border border-border p-6 shadow-xl relative my-8">
        <h2 className="text-xl font-semibold mb-6">{initialData ? "Edit Update" : "Create New Update"}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Title</span>
              <input name="title" required defaultValue={initialData?.title} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <select name="status" required defaultValue={initialData?.status || "info"} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm">
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="urgent">Urgent</option>
                <option value="approved">Approved</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Country</span>
              <input name="country" required defaultValue={initialData?.country} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Country Code</span>
              <input name="country_code" required defaultValue={initialData?.country_code} placeholder="e.g. US" className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Flag (Emoji)</span>
              <input name="flag" required defaultValue={initialData?.flag} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Visa Type</span>
              <input name="visa_type" required defaultValue={initialData?.visa_type} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Category</span>
              <input name="category" required defaultValue={initialData?.category} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Impact</span>
              <input name="impact" required defaultValue={initialData?.impact} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Effective Date</span>
              <input name="effective_date" type="date" required defaultValue={initialData?.effective_date} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Announcement Date</span>
              <input name="announcement_date" type="date" required defaultValue={initialData?.announcement_date} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Source Name</span>
              <input name="source_name" required defaultValue={initialData?.source_name} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Source URL</span>
              <input name="source_url" required defaultValue={initialData?.source_url} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground">Reviewed By</span>
              <input name="reviewed_by" required defaultValue={initialData?.reviewed_by || "Admin"} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
            </label>
          </div>
          
          <label className="block">
            <span className="text-sm font-medium text-muted-foreground">Description (Short)</span>
            <input name="description" required defaultValue={initialData?.description} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-muted-foreground">Long Description</span>
            <textarea name="long_description" required rows={3} defaultValue={initialData?.long_description} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-muted-foreground">Previous Rule</span>
            <textarea name="previous_rule" required rows={2} defaultValue={initialData?.previous_rule} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-muted-foreground">New Rule</span>
            <textarea name="new_rule" required rows={2} defaultValue={initialData?.new_rule} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-muted-foreground">Key Points (One per line)</span>
            <textarea name="key_points" rows={3} defaultValue={initialData?.key_points?.join('\n')} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
          </label>
          
          <div className="pt-4 mt-6 border-t border-border">
            <h3 className="text-lg font-medium mb-4">Analytics & Insights</h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--info)]">Descriptive Analytics (What happened?)</span>
                <textarea name="analytic_descriptive" rows={2} defaultValue={initialData?.analytic_descriptive} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--warning)]">Diagnostic Analytics (Why did it happen?)</span>
                <textarea name="analytic_diagnostic" rows={2} defaultValue={initialData?.analytic_diagnostic} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--success)]">Predictive Analytics (What will happen next?)</span>
                <textarea name="analytic_predictive" rows={2} defaultValue={initialData?.analytic_predictive} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--primary)]">Prescriptive Analytics (What should I do?)</span>
                <textarea name="analytic_prescriptive" rows={2} defaultValue={initialData?.analytic_prescriptive} className="mt-1 block w-full rounded-md border border-border bg-background p-2 text-sm" />
              </label>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-border flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-white transition">
              <input 
                type="checkbox" 
                checked={broadcastSocial} 
                onChange={(e) => setBroadcastSocial(e.target.checked)}
                className="rounded bg-background/50 border-border text-[color:var(--primary)] focus:ring-[color:var(--primary)] focus:ring-offset-background"
              />
              Broadcast to Social Media (X, LinkedIn) on save
            </label>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-border hover:bg-white/5 transition">Cancel</button>
            <button type="submit" disabled={busy} className="px-4 py-2 text-sm rounded-md bg-[color:var(--primary)] text-black font-semibold hover:opacity-90 transition disabled:opacity-50">
              {busy ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
