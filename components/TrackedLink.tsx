"use client";

import { track } from "@/lib/analytics";

export default function TrackedLink({
  event,
  data,
  ...props
}: { event: string; data?: Record<string, unknown> } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} onClick={() => track(event, data)} />;
}
