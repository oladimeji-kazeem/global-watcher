import { useState } from "react";
import { type CountryPage } from "@/lib/data-service";
import { Loader2 } from "lucide-react";

interface PageFormProps {
  initialData?: Partial<CountryPage>;
  onSave: (data: Partial<CountryPage>) => Promise<void>;
  onCancel: () => void;
}

export function PageForm({ initialData, onSave, onCancel }: PageFormProps) {
  const [formData, setFormData] = useState<Partial<CountryPage>>(initialData || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error(err);
      alert("Failed to save page.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Page Title</label>
          <input
            type="text"
            required
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. LMIA Guide"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">URL Slug</label>
          <input
            type="text"
            required
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            value={formData.slug || ""}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g. lmia-guide"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Markdown Content</label>
        <textarea
          required
          rows={15}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono"
          value={formData.content_markdown || ""}
          onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
          placeholder="# Markdown Content Here"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            className="rounded border-border text-primary focus:ring-primary"
            checked={formData.is_published || false}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
          />
          Publish Page
        </label>
      </div>

      <div className="flex items-center gap-3 justify-end pt-4 border-t border-border mt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Page"}
        </button>
      </div>
    </form>
  );
}
