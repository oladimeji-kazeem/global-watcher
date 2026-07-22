import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const prefsSchema = z.object({
  email: z.string().email().or(z.literal("")),
  countries: z.array(z.string()).default([]),
  visa_types: z.array(z.string()).default([]),
  statuses: z.array(z.string()).default([]),
  frequency: z.enum(["instant", "daily", "weekly"]).default("instant"),
  enabled: z.boolean().default(true),
});

export type WatchlistPrefs = z.infer<typeof prefsSchema>;

export const getMyWatchlist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("watchlists" as any)
      .select("email, countries, visa_types, statuses, frequency, enabled")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as WatchlistPrefs | null) ?? null;
  });

export const saveMyWatchlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => prefsSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("watchlists" as any)
      .upsert({ user_id: context.userId, ...data }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
