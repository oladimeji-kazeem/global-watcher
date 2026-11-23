import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import "../lib/i18n";

import appCss from "../styles.css?url";
import { PageShell, SiteHeader, SiteFooter } from "../components/site-shell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  const errorMessage =
    error?.message ||
    (typeof error === "string" ? error : "An unexpected error occurred while loading this page.");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
        {errorMessage && (
          <div className="mt-6 text-left border-t border-border/40 pt-4">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-muted-foreground hover:text-foreground transition underline cursor-pointer"
            >
              {showDetails ? "Hide technical details" : "Show technical details"}
            </button>
            {showDetails && (
              <div className="mt-2 p-3 rounded-lg bg-card border border-border text-left overflow-auto max-h-48 text-xs font-mono text-red-400">
                <div className="font-semibold">{errorMessage}</div>
                {error?.stack && (
                  <pre className="mt-2 text-[11px] text-muted-foreground whitespace-pre-wrap break-all">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Immigration Radar — Live Global Immigration Intelligence" },
      { name: "description", content: "Monitor immigration rule changes across 40+ countries. Salary thresholds, visa updates and deadlines from verified government sources." },
      { property: "og:title", content: "Immigration Radar — Live Global Immigration Intelligence" },
      { property: "og:description", content: "Monitor immigration rule changes across 40+ countries. Salary thresholds, visa updates and deadlines from verified government sources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Immigration Radar — Live Global Immigration Intelligence" },
      { name: "twitter:description", content: "Monitor immigration rule changes across 40+ countries. Salary thresholds, visa updates and deadlines from verified government sources." },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:image", content: "/logo.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "alternate", type: "application/rss+xml", title: "Immigration Radar Updates RSS Feed", href: "/api/rss" },
    ],
    scripts: [
      { src: "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit", async: true },
      { children: `function googleTranslateElementInit() { new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element'); }` }
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { AnalyticsTracker } from "@/components/AnalyticsTracker";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsTracker />
      <PageShell>
        <SiteHeader />
        <Outlet />
        <SiteFooter />
      </PageShell>
    </QueryClientProvider>
  );
}
