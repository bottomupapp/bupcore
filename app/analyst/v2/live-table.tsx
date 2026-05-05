"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Analyst, AnalystOrder } from "@/lib/bottomup-api";
import { useAnalystLive } from "@/lib/use-analyst-live";
import { CopyCode } from "./copy-code";
import { fmtUsd } from "./format";
import { tFor, type Locale } from "./i18n";

function fullName(a: Analyst): string {
  if (a.name) return a.name;
  return [a.first_name, a.last_name].filter(Boolean).join(" ").trim() || "—";
}

const ORDER_FIELD: Record<AnalystOrder, (a: Analyst) => number | string | null> = {
  monthly_pnl: (a) => a.stats.monthly_pnl,
  monthly_pnl_rate: (a) => a.stats.monthly_pnl_rate,
  monthly_roi: (a) => a.stats.monthly_roi,
  monthly_win_rate: (a) => a.stats.monthly_win_rate,
  pnl: (a) => a.stats.pnl,
  win_rate: (a) => a.stats.win_rate,
  rate: (a) => a.stats.rate,
  followers: (a) => a.followers,
  name: (a) => fullName(a),
};

/**
 * Client-side table that overlays incoming `analyst:*` WS frames on top
 * of the SSR-rendered initial roster. We re-sort on every state change
 * using the same order key the page is requesting from the API, so a
 * trader whose 30D PNL just moved past the next row visibly jumps.
 */
export function LiveAnalystTable({
  initial,
  order,
  locale = "en",
}: {
  initial: Analyst[];
  order: AnalystOrder;
  locale?: Locale;
}) {
  const t = tFor(locale);
  const { rows: live, lastUpdateAt, connected } = useAnalystLive("*");

  const merged = useMemo(() => {
    const map = new Map<string, Analyst>();
    for (const a of initial) {
      const key = (a.name ?? a.trader_id).toLowerCase();
      map.set(key, a);
    }
    for (const [key, a] of live) map.set(key, a);
    const list = Array.from(map.values());
    const fn = ORDER_FIELD[order];
    if (order === "name") {
      list.sort((a, b) => String(fn(a)).localeCompare(String(fn(b))));
    } else {
      list.sort((a, b) => {
        const va = fn(a) as number | null;
        const vb = fn(b) as number | null;
        if (va == null && vb == null) return 0;
        if (va == null) return 1;
        if (vb == null) return -1;
        return vb - va;
      });
    }
    return list;
  }, [initial, live, order]);

  return (
    <>
      <LiveBadge connected={connected} lastUpdateAt={lastUpdateAt} locale={locale} />
      <div
        style={{
          marginTop: 12,
          border: "1px solid var(--line-2)",
          background: "var(--bg-2)",
          overflowX: "auto",
        }}
      >
        <table className="terminal">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("colAnalyst")}</th>
              <th className="ralign">{t("colFollowers")}</th>
              <th className="ralign">{t("colThirtyDPnl")}</th>
              <th className="ralign">{t("colThirtyDWr")}</th>
              <th className="ralign">{t("colAllPnl")}</th>
              <th className="ralign">{t("colAllWr")}</th>
              <th>{t("colRefCode")}</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((a, i) => {
              const name = fullName(a);
              const handle = a.name ?? a.trader_id;
              const href = `/analyst/${encodeURIComponent(handle)}`;
              const monthlyPnlTone =
                (a.stats.monthly_pnl ?? 0) >= 0 ? "var(--pos)" : "var(--neg)";
              const totalPnlTone =
                (a.stats.pnl ?? 0) >= 0 ? "var(--pos)" : "var(--neg)";
              return (
                <tr key={a.trader_id}>
                  <td className="num" style={{ color: "var(--ink-3)" }}>
                    {(i + 1).toString().padStart(2, "0")}
                  </td>
                  <td>
                    <Link
                      href={href}
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {a.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.image}
                          alt=""
                          width={28}
                          height={28}
                          referrerPolicy="no-referrer"
                          style={{
                            width: 28,
                            height: 28,
                            border: "1px solid var(--line-2)",
                            background: "var(--bg-3)",
                            objectFit: "cover",
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            border: "1px solid var(--line-2)",
                            background: "var(--bg-3)",
                            color: "var(--ink-3)",
                            display: "inline-grid",
                            placeItems: "center",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            fontSize: 11,
                          }}
                        >
                          {name[0]?.toUpperCase() ?? "?"}
                        </span>
                      )}
                      <span style={{ fontWeight: 600, fontSize: 13 }} className="lnk">
                        {name}
                      </span>
                    </Link>
                  </td>
                  <td className="ralign num" style={{ color: "var(--ink-2)" }}>
                    {a.followers.toLocaleString("en-US")}
                  </td>
                  <td
                    className="ralign num"
                    style={{ color: monthlyPnlTone, fontWeight: 600 }}
                  >
                    {fmtUsd(a.stats.monthly_pnl, { sign: true, compact: true })}
                  </td>
                  <td className="ralign num" style={{ color: "var(--ink-2)" }}>
                    {a.stats.monthly_win_rate == null
                      ? "—"
                      : `${Math.round(a.stats.monthly_win_rate)}%`}
                  </td>
                  <td
                    className="ralign num"
                    style={{ color: totalPnlTone, fontWeight: 600 }}
                  >
                    {fmtUsd(a.stats.pnl, { sign: true, compact: true })}
                  </td>
                  <td className="ralign num" style={{ color: "var(--ink-2)" }}>
                    {a.stats.win_rate == null
                      ? "—"
                      : `${Math.round(a.stats.win_rate)}%`}
                  </td>
                  <td>
                    {a.referral_code ? (
                      <CopyCode code={a.referral_code} variant="compact" />
                    ) : (
                      <span style={{ color: "var(--ink-3)" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function LiveBadge({
  connected,
  lastUpdateAt,
  locale = "en",
}: {
  connected: boolean;
  lastUpdateAt: number | null;
  locale?: Locale;
}) {
  const t = tFor(locale);
  const label = connected
    ? lastUpdateAt
      ? `${t("live")} · ${t("lastUpdate")} ${formatRelative(lastUpdateAt, t)}`
      : `${t("live")} · ${t("waitingFirstFrame")}`
    : t("reconnecting");
  return (
    <div
      className="eyebrow"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: "var(--ink-3)",
        fontSize: 11,
      }}
    >
      <span
        className={connected ? "blink" : undefined}
        style={{
          color: connected ? "var(--pos)" : "var(--neg)",
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        ●
      </span>
      <span>{label}</span>
    </div>
  );
}

function formatRelative(
  ts: number,
  t: ReturnType<typeof tFor>,
): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 5) return t("justNow");
  if (s < 60) return `${s} ${t("secAgo")}`;
  if (s < 3600) return `${Math.round(s / 60)} ${t("minAgo")}`;
  return `${Math.round(s / 3600)} ${t("hourAgo")}`;
}
