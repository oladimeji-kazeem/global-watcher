import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((input: { path: string; referrer: string }) => 
    z.object({ path: z.string(), referrer: z.string().optional().default("") }).parse(input)
  )
  .handler(async ({ data }) => {
    // We dynamically import the admin client because this runs on the server
    // and we want to bypass RLS to insert into analytics_page_views
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Non-blocking insert
    supabaseAdmin.from("analytics_page_views").insert({
      path: data.path,
      referrer: data.referrer
    }).then(({ error }) => {
      if (error) console.error("[Analytics] Failed to track page view:", error.message);
    });
    
    return { success: true };
  });

export const getAnalyticsStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Fetch last 30 days of page views
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: views, error } = await supabaseAdmin
      .from("analytics_page_views")
      .select("path, referrer, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString());
      
    if (error || !views) {
      console.error("[Analytics] Error fetching stats:", error?.message);
      return { totalViews: 0, topPages: [], topReferrers: [], history: [] };
    }
    
    const totalViews = views.length;
    
    // Aggregate by path
    const pathCounts = views.reduce((acc: Record<string, number>, v: any) => {
      acc[v.path] = (acc[v.path] || 0) + 1;
      return acc;
    }, {});
    const topPages = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
      
    // Aggregate by referrer
    const refCounts = views.reduce((acc: Record<string, number>, v: any) => {
      const r = v.referrer || "Direct";
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {});
    const topReferrers = Object.entries(refCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
      
    // Aggregate by day for time-series chart
    const dailyCounts = views.reduce((acc: Record<string, number>, v: any) => {
      const day = new Date(v.created_at).toISOString().split("T")[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    
    // Fill in missing days for the last 30 days
    const dailyViews = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];
      const shortDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyViews.push({ name: shortDay, views: dailyCounts[dayStr] || 0 });
    }
      
    return { totalViews, topPages, topReferrers, dailyViews };
  });
