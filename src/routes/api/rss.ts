import { createAPIFileRoute } from "@tanstack/react-start/api";
import { fetchChanges } from "@/lib/data-service";

export const APIRoute = createAPIFileRoute("/api/rss")({
  GET: async () => {
    // Fetch latest 20 updates for the feed
    const allChanges = await fetchChanges();
    const latestChanges = allChanges.slice(0, 20);

    const siteUrl = "https://immigrationradar.com"; // Change to production URL later

    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Immigration Radar Updates</title>
  <link>${siteUrl}</link>
  <description>The latest global immigration policy changes and alerts.</description>
  <language>en-us</language>
  <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
`;

    for (const change of latestChanges) {
      const itemUrl = `${siteUrl}/updates/${change.id}`;
      // Basic escaping for XML
      const escapeXml = (unsafe: string) =>
        unsafe.replace(/[<>&'"]/g, (c) => {
          switch (c) {
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "&": return "&amp;";
            case "'": return "&apos;";
            case '"': return "&quot;";
            default: return c;
          }
        });

      xml += `  <item>
    <title>${escapeXml(change.country)} - ${escapeXml(change.visa_type)}: ${escapeXml(change.title)}</title>
    <link>${itemUrl}</link>
    <guid isPermaLink="true">${itemUrl}</guid>
    <pubDate>${new Date(change.created_at || change.effective_date).toUTCString()}</pubDate>
    <description>${escapeXml(change.description)}</description>
  </item>\n`;
    }

    xml += `</channel>\n</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  },
});
