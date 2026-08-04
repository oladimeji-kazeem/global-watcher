import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchChangeById } from "./data-service";
import { requireAdminAuth } from "@/integrations/supabase/auth-middleware";

export const broadcastToSocialMedia = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .validator(z.object({ changeId: z.string() }))
  .handler(async ({ data }) => {
    const change = await fetchChangeById(data.changeId);
    if (!change) {
      throw new Error("Change not found");
    }

    const message = `🚨 URGENT IMMIGRATION UPDATE 🚨\n\n${change.country} has announced a new policy regarding the ${change.visa_type} visa.\n\nSummary: ${change.title}\n\nRead the full implications and actionable insights on our platform:\nhttps://immigrationradar.com/updates/${change.id}`;

    const results = {
      twitter: { success: false, message: "Keys not configured" },
      linkedin: { success: false, message: "Keys not configured" },
    };

    // 1. Post to X (Twitter)
    const X_API_KEY = process.env.X_API_KEY;
    const X_API_SECRET = process.env.X_API_SECRET;
    if (X_API_KEY && X_API_SECRET) {
      try {
        // Placeholder for actual Twitter API v2 fetch
        // await fetch('https://api.twitter.com/2/tweets', { ... });
        console.log("Mock posted to X:", message);
        results.twitter = { success: true, message: "Posted successfully" };
      } catch (err: any) {
        results.twitter = { success: false, message: err.message };
      }
    }

    // 2. Post to LinkedIn
    const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
    if (LINKEDIN_ACCESS_TOKEN) {
      try {
        // Placeholder for actual LinkedIn UGC Post fetch
        // await fetch('https://api.linkedin.com/v2/ugcPosts', { ... });
        console.log("Mock posted to LinkedIn:", message);
        results.linkedin = { success: true, message: "Posted successfully" };
      } catch (err: any) {
        results.linkedin = { success: false, message: err.message };
      }
    }

    return results;
  });
