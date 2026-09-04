import posthog from "posthog-js";

export const POSTHOG_API_KEY =
  "phc_BYGmpmrDUKFPSXnDZzvGbupuF2VCHMeR8G4mrQTFKhPe";
export const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || initialized) return;
  if (!POSTHOG_API_KEY) return;

  posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    person_profiles: "identified_only",
  });
  initialized = true;
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  initPostHog();
  posthog.capture(event, properties);
}
