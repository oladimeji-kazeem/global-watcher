import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { statusStyles, formatDate, fetchChangeById } from "@/lib/data-service";

export const notifyWatchlistMatches = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { changeId: string }) => z.object({ changeId: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const change = await fetchChangeById(data.changeId);
    if (!change) throw new Error("Change not found");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("watchlists" as any)
      .select("user_id, email, countries, visa_types, statuses, enabled");
    if (error) throw new Error(error.message);

    const matches = ((rows as any[]) ?? []).filter((r) => {
      if (!r.enabled || !r.email) return false;
      if (r.countries?.length && !r.countries.includes(change.country)) return false;
      if (r.visa_types?.length && !r.visa_types.includes(change.visa_type)) return false;
      if (r.statuses?.length && !r.statuses.includes(change.status)) return false;
      return true;
    });

    if (matches.length === 0) return { sent: 0, skipped: 0, matched: 0 };

    const { render } = await import("@react-email/render");
    const { default: Email } = await import("@/lib/email-templates/watchlist-alert");
    const { createElement } = await import("react");

    const origin = process.env.APP_ORIGIN ?? "https://project--993eaaef-56b6-485c-848e-0335005a9156.lovable.app";
    const detailUrl = `${origin}/updates/${change.id}`;
    const templateData = {
      title: change.title,
      country: change.country,
      visaType: change.visa_type,
      status: statusStyles[change.status].label,
      effectiveDate: formatDate(change.effective_date),
      previousRule: change.previous_rule,
      newRule: change.new_rule,
      sourceName: change.source_name,
      sourceUrl: change.source_url,
      detailUrl,
    };
    const subject = `New immigration change: ${change.title}`;
    const html = await render(createElement(Email, templateData));
    const text = `${change.title}\n${change.country} · ${change.visa_type} · Effective ${formatDate(change.effective_date)}\n\nPrevious rule: ${change.previous_rule}\nNew rule: ${change.new_rule}\n\nOfficial source (${change.source_name}): ${change.source_url}\nDetails: ${detailUrl}`;

    const { supabase } = await import("@/integrations/supabase/client");

    let sent = 0, skipped = 0;
    for (const m of matches) {
      try {
        const { data: res, error } = await supabase.functions.invoke('send-watchlist-alert', {
          body: {
            email: m.email,
            country: change.country,
            updateTitle: change.title,
            updateDate: formatDate(change.effective_date)
          }
        });

        if (error) throw new Error(error.message);
        if (res) sent++;
      } catch (e) {
        console.error("[notify] Edge Function execution failed:", (e as Error).message);
        skipped++;
      }
    }
    return { sent, skipped, matched: matches.length };
  });
