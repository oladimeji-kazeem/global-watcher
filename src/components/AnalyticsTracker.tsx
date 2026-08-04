import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { trackPageView } from "@/lib/analytics.functions";

export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      trackPageView({
        data: {
          path: location.pathname,
          referrer: document.referrer || "",
        }
      });
    }
  }, [location.pathname]);

  return null;
}
