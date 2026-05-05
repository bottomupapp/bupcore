import Link from "next/link";
import {
  fetchAnalysts,
  type Analyst,
  type AnalystOrder,
} from "@/lib/bottomup-api";
import { TopBar, TickerTape } from "./v2/top-bar";
import { CopyCode } from "./v2/copy-code";
import { fmtPct, fmtR, fmtUsd } from "./v2/format";

export const revalidate = 60;

const ORDER_OPTIONS: Array<{ value: AnalystOrder; label: string }> = [
  { value: "monthly_pnl", label: "30D_PNL" },
  { value: "monthly_roi", label: "30D_ROI" },
  { value: "monthly_win_rate", label: "30D_WR" },
  { value: "win_rate", label: "ALL_WR" },
  { value: "pnl", label: "ALL_PNL" },
  { value: "followers", label: "FOLLOWERS" },
  { value: "name", label: "NAME" },
];

function isOrder(value: string | undefined): value is AnalystOrder {
  return ORDER_OPTIONS.some((o) => o.value === value);
}

function fullName(a: Analyst): string {
  if (a.name) return a.name;
  return [a.first_name, a.last_name].filter(Boolean).join(" ").trim() || "—";
}

export default async function AnalystListPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const sp = await searchParams;
  const order: AnalystOrder = isOrder(sp.order) ? sp.order : "monthly_pnl";

  let analysts: Analyst[] = [];
  let error: string | null = null;
  try {
    analysts = await fetchAnalysts(60, order);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  const tape = [
    { k: "ANALYSTS", v: analysts.length.toString(), up: true },
    {
      k: "TOP",
      v: analysts[0]
        ? `${fullName(analysts[0])} ${fmtUsd(analysts[0].stats.monthly_pnl, { sign: true, compact: true })}`
        : "—",
      up: true,
    },
    { k: "BUPCORE.AI", v: "ACTIVE", up: true },
    { k: "SOURCE", v: "REAL_TIME · 60S CACHE" },
  ];

  return (
    <>
      <TopBar crumb="/ ANALYSTS" />
      <TickerTape items={tape} />

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 32px 120px" }}>
        <section style={{ maxWidth: 900 }}>
          <div className="eyebrow" style={{ color: "var(--ink-3)" }}>
            // BOTTOMUP_TERMINAL · ANALYST_INDEX
          </div>
          <h1
            className="display"
            style={{
              fontSize: 96,
              margin: "16px 0 12px",
              color: "var(--ink)",
            }}
          >
            ANALYSTS
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-2)",
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            Live performance, follower counts and referral codes for every
            active analyst on BottomUP. Use any code at signup to follow them
            from day one.
          </p>
        </section>

        {/* sort row */}
        <section style={{ marginTop: 32 }}>
          <div
            className="eyebrow"
            style={{
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <span>// SORT_BY</span>
            <span style={{ color: "var(--ink-4)" }}>
              {analysts.length} ROWS · DESC
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 0,
              border: "1px solid var(--line-2)",
              flexWrap: "wrap",
            }}
          >
            {ORDER_OPTIONS.map((o, i) => {
              const active = o.value === order;
              return (
                <Link
                  key={o.value}
                  href={
                    o.value === "monthly_pnl"
                      ? "/analyst"
                      : `/analyst?order=${o.value}`
                  }
                  style={{
                    padding: "10px 16px",
                    background: active ? "var(--acid)" : "transparent",
                    color: active ? "var(--bg)" : "var(--ink-3)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    borderRight:
                      i < ORDER_OPTIONS.length - 1 ? "1px solid var(--line-2)" : "none",
                  }}
                >
                  {o.label}
                </Link>
              );
            })}
          </div>
        </section>

        {error ? (
          <div
            style={{
              marginTop: 24,
              border: "1px solid var(--warn)",
              padding: "20px 24px",
              background: "var(--bg-2)",
              fontSize: 13,
              color: "var(--ink-2)",
            }}
          >
            <div className="eyebrow" style={{ color: "var(--warn)", marginBottom: 8 }}>
              FETCH ERROR
            </div>
            {error}
          </div>
        ) : analysts.length === 0 ? (
          <div
            style={{
              marginTop: 24,
              padding: 32,
              border: "1px solid var(--line-2)",
              background: "var(--bg-2)",
              color: "var(--ink-3)",
              fontSize: 12,
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            no analysts found
          </div>
        ) : (
          <div
            style={{
              marginTop: 24,
              border: "1px solid var(--line-2)",
              background: "var(--bg-2)",
              overflowX: "auto",
            }}
          >
            <table className="terminal">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ANALYST</th>
                  <th className="ralign">FOLLOWERS</th>
                  <th className="ralign">30D PNL</th>
                  <th className="ralign">30D WR</th>
                  <th className="ralign">ALL PNL</th>
                  <th className="ralign">ALL WR</th>
                  <th>REF_CODE</th>
                </tr>
              </thead>
              <tbody>
                {analysts.map((a, i) => {
                  const name = fullName(a);
                  const handle = (a.name ?? a.trader_id);
                  const href = `/analyst/${encodeURIComponent(handle)}`;
                  const monthlyPnlTone =
                    (a.stats.monthly_pnl ?? 0) >= 0 ? "var(--acid)" : "var(--warn)";
                  const totalPnlTone =
                    (a.stats.pnl ?? 0) >= 0 ? "var(--acid)" : "var(--warn)";
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
                          <span
                            style={{ fontWeight: 600, fontSize: 13 }}
                            className="lnk"
                          >
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
        )}

        <footer
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid var(--line-2)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 11,
            color: "var(--ink-3)",
            letterSpacing: ".06em",
          }}
        >
          <div>© {new Date().getFullYear()} BOTTOMUP.LAB · BUPCORE.AI</div>
          <div style={{ maxWidth: 600, textAlign: "right" }}>
            VIRTUAL_TRACK_RECORD · NOT_FINANCIAL_ADVICE · PAST_PERFORMANCE_≠_FUTURE_RESULTS
          </div>
        </footer>
      </main>
    </>
  );
}
