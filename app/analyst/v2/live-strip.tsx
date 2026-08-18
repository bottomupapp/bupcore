"use client";

import type { Analyst } from "@/lib/bottomup-api";
import { useAnalystLive } from "@/lib/use-analyst-live";
import { LiveBadge } from "./live-table";
import { fmtPct, fmtUsd } from "./format";
import { tFor, type Locale } from "./i18n";

export type LiveStripFallback = {
  monthly_pnl: number | null;
  monthly_roi: number | null;
  monthly_win_rate: number | null;
  pnl: number | null;
};

function pickLive(
  rows: Map<string, Analyst>,
  handle: string,
  traderId?: string,
): Analyst | undefined {
  if (traderId) {
    const byId = rows.get(traderId);
    if (byId) return byId;
  }
  const byHandle = rows.get(handle);
  if (byHandle) return byHandle;
  for (const row of rows.values()) {
    if (row.name?.toLowerCase() === handle) return row;
    if (row.referral_code?.toLowerCase() === handle) return row;
    if (traderId && row.trader_id === traderId) return row;
  }
  return undefined;
}

/**
 * Detail-page live strip. Prefers WS `trader_stats`; falls back to the
 * SSR window so RECONNECTING never blanks the headline numbers.
 */
export function LiveStrip({
  name,
  locale = "en",
  traderId,
  fallback,
}: {
  name: string;
  locale?: Locale;
  traderId?: string;
  fallback?: LiveStripFallback;
}) {
  const t = tFor(locale);
  const handle = (name ?? "").toLowerCase();
  const { rows, lastUpdateAt, connected } = useAnalystLive(handle);
  const live = pickLive(rows, handle, traderId);

  const monthlyPnl = live?.stats.monthly_pnl ?? fallback?.monthly_pnl ?? null;
  const monthlyRoi = live?.stats.monthly_roi ?? fallback?.monthly_roi ?? null;
  const monthlyWr =
    live?.stats.monthly_win_rate ?? fallback?.monthly_win_rate ?? null;
  const allPnl = live?.stats.pnl ?? fallback?.pnl ?? null;

  return (
    <section style={{ marginTop: 24 }}>
      <div
        className="eyebrow"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span>// {t("liveStreamTraderStats")}</span>
        <LiveBadge connected={connected} lastUpdateAt={lastUpdateAt} locale={locale} />
      </div>
      <div
        className="stat-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          border: "1px solid var(--line-2)",
          background: "var(--bg-2)",
        }}
      >
        <Tile
          label={t("thirtyDPnl")}
          value={
            monthlyPnl == null
              ? "—"
              : fmtUsd(monthlyPnl, { sign: true, compact: true })
          }
          tone={monthlyPnl == null ? "neutral" : monthlyPnl >= 0 ? "up" : "down"}
        />
        <Tile
          label={t("thirtyDRoi")}
          value={fmtPct(monthlyRoi)}
          tone={monthlyRoi == null ? "neutral" : monthlyRoi >= 0 ? "up" : "down"}
        />
        <Tile
          label={t("thirtyDWr")}
          value={monthlyWr == null ? "—" : `${Math.round(monthlyWr)}%`}
        />
        <Tile
          label={t("allPnl")}
          value={
            allPnl == null ? "—" : fmtUsd(allPnl, { sign: true, compact: true })
          }
          tone={allPnl == null ? "neutral" : allPnl >= 0 ? "up" : "down"}
          last
        />
      </div>
    </section>
  );
}

function Tile({
  label,
  value,
  tone = "neutral",
  last = false,
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
  last?: boolean;
}) {
  const color =
    tone === "up" ? "var(--acid)" : tone === "down" ? "var(--warn)" : "var(--ink)";
  return (
    <div
      style={{
        padding: "18px 20px 16px",
        borderRight: last ? "none" : "1px solid var(--line-2)",
      }}
    >
      <div className="eyebrow" style={{ color: "var(--ink-3)" }}>
        {label}
      </div>
      <div
        className="display num"
        style={{ marginTop: 12, fontSize: 26, color, fontWeight: 600 }}
      >
        {value}
      </div>
    </div>
  );
}
