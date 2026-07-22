import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { changes, statusStyles, formatDate } from "@/lib/immigration-data";

export const notifyWatchlistMatches = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { changeId: string }) => z.object({ changeId: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const change = changes.find((c) => c.id === data.changeId);
    if (!change) throw new Error("Change not found");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("watchlists" as any)
      .select("user_id, email, countries, visa_types, statuses, enabled");
    if (error) throw new Error(error.message);

    const matches = ((rows as any[]) ?? []).filter((r) => {
      if (!r.enabled || !r.email) return false;
      if (r.countries?.length && !r.countries.includes(change.country)) return false;
      if (r.visa_types?.length && !r.visa_types.includes(change.visaType)) return false;
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
      visaType: change.visaType,
      status: statusStyles[change.status].label,
      effectiveDate: formatDate(change.effectiveDate),
      previousRule: change.previousRule,
      newRule: change.newRule,
      sourceName: change.sourceName,
      sourceUrl: change.sourceUrl,
      detailUrl,
    };
    const subject = `New immigration change: ${change.title}`;
    const html = await render(createElement(Email, templateData));
    const text = `${change.title}\n${change.country} · ${change.visaType} · Effective ${formatDate(change.effectiveDate)}\n\nPrevious rule: ${change.previousRule}\nNew rule: ${change.newRule}\n\nOfficial source (${change.sourceName}): ${change.sourceUrl}\nDetails: ${detailUrl}`;

    const { sendLovableEmail } = await import("@lovable.dev/email-js");
    const apiKey = process.env.LOVABLE_API_KEY;
    const senderDomain = process.env.SENDER_DOMAIN;
    const fromDomain = process.env.FROM_DOMAIN ?? senderDomain;
    if (!apiKey || !senderDomain || !fromDomain) {
      throw new Error("Email sending is not configured yet. An email domain must be set up in Lovable Cloud before alerts can be delivered.");
    }
    const from = `Immigration Radar <alerts@${fromDomain}>`;

    let sent = 0, skipped = 0;
    for (const m of matches) {
      try {
        const res = await sendLovableEmail(
          { to: m.email, from, sender_domain: senderDomain, subject, html, text },
          { apiKey, idempotencyKey: `watchlist-${change.id}-${m.user_id}` },
        );
        if (res.success) sent++; else skipped++;
      } catch (e) {
        console.error("[notify] send failed:", (e as Error).message);
        skipped++;
      }
    }
    return { sent, skipped, matched: matches.length };
  });
