"use client";

import { useRouter } from "next/navigation";
import { useAnalystInvalidate } from "@/lib/use-analyst-live";

/**
 * Mounts on the analyst detail page. When the replicator publishes a
 * `trades-changed` notification for this trader (a setup of theirs
 * transitioned to closed), call router.refresh() so the server
 * components re-run and the deep panels (PerfMatrix, equity curve,
 * monthly bars, recent trades) re-render with fresh stats.
 *
 * router.refresh() respects the data cache, so the detail page's
 * `fetchTraderDetail` must use `cache: 'no-store'` for this to
 * actually pull fresh numbers — see lib/bottomup-api.ts.
 */
export function AnalystAutoRefresh({ traderId }: { traderId: string }) {
  const router = useRouter();
  useAnalystInvalidate(traderId, () => router.refresh());
  return null;
}
