import { createServerFn } from "@tanstack/react-start";
import { requireAdminAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { notifyWatchlistMatches } from "./notify.functions";

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    return true;
  });

export const createChange = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: inserted } = await (supabaseAdmin as any)
      .from("immigration_changes")
      .insert(data)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    // Automatically trigger watchlist notifications for new changes
    if (inserted?.id) {
       notifyWatchlistMatches({ data: { changeId: inserted.id } }).catch(e => console.error("Notify error:", e));
    }
    
    return inserted;
  });

export const updateChange = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const { id, ...updates } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: updated } = await (supabaseAdmin as any)
      .from("immigration_changes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return updated;
  });

export const deleteChange = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: { id: string }) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("immigration_changes")
      .delete()
      .eq("id", data.id);
      
    if (error) throw new Error(error.message);
    return true;
  });

/* =========================================================================
   Sponsor Organizations Server Functions
   ========================================================================= */

export const createSponsor = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const slug =
      data.slug ||
      (data.name ? data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : `sponsor-${Date.now()}`);
    
    const { error, data: inserted } = await (supabaseAdmin as any)
      .from("sponsor_organizations")
      .insert({ ...data, slug })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  });

export const updateSponsor = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const { id, ...updates } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: updated } = await (supabaseAdmin as any)
      .from("sponsor_organizations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

export const deleteSponsor = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: { id: string }) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("sponsor_organizations")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return true;
  });

/* =========================================================================
   Sponsored Jobs Server Functions
   ========================================================================= */

export const createJob = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: inserted } = await (supabaseAdmin as any)
      .from("sponsored_jobs")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  });

export const updateJob = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const { id, ...updates } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: updated } = await (supabaseAdmin as any)
      .from("sponsored_jobs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

export const deleteJob = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator((input: { id: string }) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("sponsored_jobs")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return true;
  });
