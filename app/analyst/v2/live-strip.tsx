"use client";

import type { Analyst } from "@/lib/bottomup-api";
import { useAnalystLive } from "@/lib/use-analyst-live";
import { LiveBadge } from "./live-table";
import { fmtPct, fmtUsd } from "./format";

/**
 * Detail-page live strip. Subscribes to `analyst:<name>` and surfaces
 * the precomputed `trader_stats` fields (followers + 30D PNL + win
 * rate + ROI). These are different from PerfMatrix — that block
 * recomputes from raw trades (heavier, daily-cron backed). This strip
 * is the one that actually moves between cron runs (followers is a
 * live count, monthly_pnl_rate updates as fresh setups close).
 */
export function LiveStrip({
  name,
  initial,
}: {
  name: string;
  initial: { followers: number; referral_code: string | null } | null;
}) {
  const handle = (name ?? "").toLowerCase();
  const { rows, lastUpdateAt, connected } = useAnalystLive(handle);
  const live = rows.get(handle) as Analyst | undefined;

  const followers = live?.followers ?? initial?.followers ?? 0;
  const monthlyPnl = live?.stats.monthly_pnl ?? null;
  const monthlyRoi = live?.stats.monthly_roi ?? null;
  const monthlyWr = live?.stats.monthly_win_rate ?? null;
  const allPnl = live?.stats.pnl ?? null;
  const allWr = live?.stats.win_rate ?? null;

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
        <span>// LIVE_STREAM · TRADER_STATS</span>
        <LiveBadge connected={connected} lastUpdateAt={lastUpdateAt} />
      </div>
      <div
        className="stat-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          border: "1px solid var(--line-2)",
          background: "var(--bg-2)",
        }}
      >
        <Tile label="FOLLOWERS" value={followers.toLocaleString("en-US")} />
        <Tile
          label="30D PNL"
          value={
            monthlyPnl == null
              ? "—"
              : fmtUsd(monthlyPnl, { sign: true, compact: true })
          }
          tone={monthlyPnl == null ? "neutral" : monthlyPnl >= 0 ? "up" : "down"}
        />
        <Tile
          label="30D ROI"
          value={fmtPct(monthlyRoi)}
          tone={monthlyRoi == null ? "neutral" : monthlyRoi >= 0 ? "up" : "down"}
        />
        <Tile
          label="30D WR"
          value={monthlyWr == null ? "—" : `${Math.round(monthlyWr)}%`}
        />
        <Tile
          label="ALL PNL"
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
