import { createFileRoute } from "@tanstack/react-router";
import { fetchChanges } from "@/lib/data-service";
import { createElement } from "react";

export async function generateRssFeed(): Promise<Response> {
  // Fetch latest 20 updates for the feed
  const allChanges = await fetchChanges();
  const latestChanges = allChanges.slice(0, 20);

  const siteUrl = "https://immigrationradar.com";

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
    <pubDate>${new Date(change.announcement_date || change.effective_date).toUTCString()}</pubDate>
    <description>${escapeXml(change.description)}</description>
  </item>\n`;
  }

  xml += `</channel>\n</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export const Route = createFileRoute("/api/rss")({
  loader: async () => {
    const response = await generateRssFeed();
    const xml = await response.text();
    return { xml };
  },
  component: function RssFeedView() {
    const { xml } = Route.useLoaderData();
    return createElement(
      "div",
      { className: "max-w-4xl mx-auto p-6 font-mono text-xs whitespace-pre-wrap bg-background text-foreground overflow-x-auto" },
      xml
    );
  },
});
