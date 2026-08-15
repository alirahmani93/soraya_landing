export const UMAMI_SRC = "https://stats.copybit.org/script.js";
export const UMAMI_WEBSITE_ID = "b5f37753-a59d-427e-96ba-af3b08840487";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

export function track(event: string, data?: Record<string, unknown>) {
  window.umami?.track(event, data);
}
