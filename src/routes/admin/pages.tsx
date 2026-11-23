import { createFileRoute } from "@tanstack/react-router";
import { fetchCountries, fetchCountryPages, type Country, type CountryPage } from "@/lib/data-service";
import { PageForm } from "@/components/admin/PageForm";
import { createServerFn } from "@tanstack/react-start";
import { requireAdminAuth } from "@/integrations/supabase/auth-middleware";
import { useState } from "react";
import { FileText, Plus } from "lucide-react";

export const createPage = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: inserted } = await (supabaseAdmin as any)
      .from("country_pages")
      .insert(data)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return inserted;
  });

export const updatePage = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const { id, ...updates } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: updated } = await (supabaseAdmin as any)
      .from("country_pages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return updated;
  });

export const Route = createFileRoute("/admin/pages")({
  loader: async () => {
    const countries = await fetchCountries();
    return { countries };
  },
  component: PagesManager,
});

function PagesManager() {
  const { countries } = Route.useLoaderData();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(countries[0] || null);
  const [pages, setPages] = useState<CountryPage[]>([]);
  const [editing, setEditing] = useState<CountryPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load pages when country changes
  const loadPages = async (countryCode: string) => {
    setIsLoading(true);
    const fetched = await fetchCountryPages(countryCode);
    setPages(fetched);
    setIsLoading(false);
  };

  // Initial load
  if (selectedCountry && pages.length === 0 && !isLoading) {
      loadPages(selectedCountry.code);
  }

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const country = countries.find(c => c.code === e.target.value) || null;
      setSelectedCountry(country);
      if (country) loadPages(country.code);
  };

  const handleSave = async (page: Partial<CountryPage>) => {
      if (isCreating) {
          await createPage({ data: page });
      } else {
          await updatePage({ data: page });
      }
      setIsCreating(false);
      setEditing(null);
      if (selectedCountry) loadPages(selectedCountry.code);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Country Pages</h1>
          <p className="text-muted-foreground text-sm">Manage dynamic Markdown content for country portals.</p>
        </div>
        <button 
          onClick={() => { setIsCreating(true); setEditing(null); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition"
        >
          <Plus className="h-4 w-4" /> Add Page
        </button>
      </div>

      <div className="flex items-center gap-4 bg-card/40 border border-border p-4 rounded-xl">
          <label className="text-sm font-medium">Select Country:</label>
          <select 
            className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm"
            value={selectedCountry?.code || ""}
            onChange={handleCountrySelect}
          >
              {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
              ))}
          </select>
      </div>

      {(editing || isCreating) ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">{isCreating ? "New Page" : "Edit Page"}</h2>
          <PageForm 
            initialData={editing || { country_code: selectedCountry?.code }} 
            onSave={handleSave} 
            onCancel={() => { setEditing(null); setIsCreating(false); }} 
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-primary/50 transition">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">/{selectedCountry?.slug}/{p.slug}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${p.is_published ? 'border-success/30 text-success bg-success/10' : 'border-warning/30 text-warning bg-warning/10'}`}>
                    {p.is_published ? 'Published' : 'Draft'}
                </span>
                <button 
                  onClick={() => setEditing(p)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          {pages.length === 0 && !isLoading && (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                  No pages found for this country.
              </div>
          )}
        </div>
      )}
    </div>
  );
}
