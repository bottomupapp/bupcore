import Link from "next/link";
import type { TraderDetail } from "@/lib/bottomup-api";
import { equityPaths } from "./equity-path";
import { fmtPct, fmtR, fmtUsd, fmtJoinedMonth, tradesIdHex } from "./format";
import { CopyCode } from "./copy-code";
import { ArrowLeft } from "./icons";

function displayName(t: TraderDetail["trader"]): string {
  if (t.name) return t.name;
  return [t.first_name, t.last_name].filter(Boolean).join(" ").trim() || "—";
}

export function Hero({ detail }: { detail: TraderDetail }) {
  const { trader, stats, all_time, equity_curve } = detail;
  const name = displayName(trader);
  const handle = (trader.referral_code ?? name).toUpperCase();
  const id = tradesIdHex(trader.id);

  // V2 hero shows equity as full-bleed background.
  const eq = equityPaths(equity_curve ?? []);

  return (
    <section
      style={{
        position: "relative",
        borderBottom: "1px solid var(--line-2)",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <svg
        viewBox="0 0 720 220"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.55,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <defs>
          <linearGradient id="heroEqFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--acid)" stopOpacity=".30" />
            <stop offset="100%" stopColor="var(--acid)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={eq.area} fill="url(#heroEqFill)" />
        <path
          d={eq.line}
          fill="none"
          stroke="var(--acid)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.25,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <defs>
          <pattern id="heroGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--line-2)" strokeWidth={1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1440,
          margin: "0 auto",
          padding: "64px 32px 48px",
        }}
      >
        <Link
          href="/analyst"
          className="lnk eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--ink-3)",
            borderBottom: "none",
          }}
        >
          <ArrowLeft /> ALL ANALYSTS
        </Link>

        <div
          className="hero-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 32,
            marginTop: 32,
            alignItems: "end",
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 16, color: "var(--ink-3)" }}>
              ANALYST_ID <span style={{ color: "var(--ink-2)" }}>// {id}</span>
              {" · "}
              {trader.followers.toLocaleString("en-US")} FOLLOWERS
            </div>
            <h1
              className="display hero-headline"
              style={{ margin: 0, fontSize: 168, color: "var(--ink)" }}
            >
              {handle}
            </h1>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 14,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {trader.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={trader.image}
                  alt={name}
                  style={{ width: 44, height: 44, border: "1px solid var(--line-2)" }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span
                  style={{
                    width: 44,
                    height: 44,
                    border: "1px solid var(--line-2)",
                    background: "var(--bg-2)",
                    color: "var(--ink-3)",
                    display: "inline-grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {name[0]?.toUpperCase() ?? "?"}
                </span>
              )}
              <div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 500 }}>
                  {trader.bio ?? "—"}
                  {trader.bio ? " · " : null}
                  ALL_TIME PNL {fmtUsd(all_time.total_pnl, { sign: true, compact: true })}
                </div>
                <div
                  className="num"
                  style={{
                    fontSize: 11,
                    color: "var(--ink-3)",
                    letterSpacing: ".06em",
                    marginTop: 2,
                  }}
                >
                  VIRTUAL_BALANCE: {fmtUsd(stats.virtual_balance_usd, { compact: false })} ·
                  TRADES_ALL: {all_time.trades.toLocaleString("en-US")}
                </div>
              </div>
            </div>
          </div>

          {/* 30D NET PNL block */}
          <div
            style={{
              border: "1px solid var(--acid)",
              background: "rgba(10,10,10,.72)",
              backdropFilter: "blur(8px)",
              padding: "24px 28px",
              minWidth: 320,
            }}
          >
            <div className="eyebrow" style={{ color: "var(--acid)" }}>
              <span className="blink">▮</span> 30D NET PNL
            </div>
            <div
              className="display num hero-pnl"
              style={{
                fontSize: 88,
                color: stats.total_pnl >= 0 ? "var(--acid)" : "var(--warn)",
                marginTop: 8,
                letterSpacing: "-0.04em",
              }}
            >
              {fmtUsd(stats.total_pnl, { sign: true })}
            </div>
            <div
              style={{
                display: "flex",
                gap: 20,
                fontSize: 12,
                color: "var(--ink-2)",
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid var(--line-2)",
              }}
            >
              <HeroSubStat
                label="RETURN"
                value={fmtPct(stats.virtual_return_pct)}
                tone={stats.virtual_return_pct >= 0 ? "acid" : "warn"}
              />
              <HeroSubStat
                label="NET R"
                value={fmtR(stats.total_r)}
                tone={stats.total_r >= 0 ? "acid" : "warn"}
              />
              <HeroSubStat
                label="WR"
                value={
                  stats.win_rate == null
                    ? "—"
                    : `${Math.round(stats.win_rate * 100)}%`
                }
                tone="ink"
              />
            </div>
          </div>
        </div>

        {/* Referral CTA strip */}
        {trader.referral_code ? (
          <div
            className="referral-strip"
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "stretch",
              border: "1px solid var(--acid)",
              background: "var(--bg)",
            }}
          >
            <div
              style={{
                padding: "16px 22px",
                borderRight: "1px solid var(--line-2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="eyebrow" style={{ color: "var(--ink-3)" }}>STEP 01</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Install BottomUP</div>
            </div>
            <CopyCode code={trader.referral_code} variant="step" />
            <div
              style={{
                padding: "16px 22px",
                borderLeft: "1px solid var(--line-2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="eyebrow" style={{ color: "var(--ink-3)" }}>STEP 03</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Auto-follow {name}</div>
            </div>
          </div>
        ) : null}
      </div>

      {fmtJoinedMonth(null) /* keeps tree-shaker happy if joined date is added later */}
    </section>
  );
}

function HeroSubStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "acid" | "warn" | "ink";
}) {
  const color =
    tone === "acid" ? "var(--acid)" : tone === "warn" ? "var(--warn)" : "var(--ink)";
  return (
    <div style={{ minWidth: 0, flex: 1 }}>
      <div className="eyebrow" style={{ whiteSpace: "nowrap" }}>
        {label}
      </div>
      <div
        className="num"
        style={{
          fontSize: 16,
          fontWeight: 600,
          color,
          marginTop: 2,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}
