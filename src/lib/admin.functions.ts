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
  .inputValidator((input: any) => input)
  .handler(async ({ data, context }) => {
    const { error, data: inserted } = await context.supabase
      .from("immigration_changes")
      .insert(data)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    // Automatically trigger watchlist notifications for new changes
    if (inserted?.id) {
       // We can trigger this in background or await it
       notifyWatchlistMatches({ data: { changeId: inserted.id } }).catch(e => console.error("Notify error:", e));
    }
    
    return inserted;
  });

export const updateChange = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((input: any) => input)
  .handler(async ({ data, context }) => {
    const { id, ...updates } = data;
    const { error, data: updated } = await context.supabase
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
  .inputValidator((input: { id: string }) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("immigration_changes")
      .delete()
      .eq("id", data.id);
      
    if (error) throw new Error(error.message);
    return true;
  });
