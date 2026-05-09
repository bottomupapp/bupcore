import Link from "next/link";
import type { TraderDetail } from "@/lib/bottomup-api";
import { equityPaths } from "./equity-path";
import { fmtPct, fmtR, fmtUsd, fmtJoinedMonth, tradesIdHex } from "./format";
import { CopyCode } from "./copy-code";
import { ArrowLeft } from "./icons";
import { tFor, type Locale } from "./i18n";

function displayName(tr: TraderDetail["trader"]): string {
  if (tr.name) return tr.name;
  return [tr.first_name, tr.last_name].filter(Boolean).join(" ").trim() || "—";
}

export function Hero({
  detail,
  locale = "en",
}: {
  detail: TraderDetail;
  locale?: Locale;
}) {
  const t = tFor(locale);
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
            <stop offset="0%" stopColor="var(--pos)" stopOpacity=".30" />
            <stop offset="100%" stopColor="var(--pos)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={eq.area} fill="url(#heroEqFill)" />
        <path
          d={eq.line}
          fill="none"
          stroke="var(--pos)"
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

      <div className="detail-hero-shell">
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
          <ArrowLeft /> {t("analystsTitle")}
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
            {trader.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={trader.image}
                alt={name}
                className="hero-avatar"
                style={{
                  width: 112,
                  height: 112,
                  border: "1px solid var(--line-2)",
                  display: "block",
                  marginBottom: 20,
                  objectFit: "cover",
                }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span
                className="hero-avatar"
                style={{
                  width: 112,
                  height: 112,
                  border: "1px solid var(--line-2)",
                  background: "var(--bg-2)",
                  color: "var(--ink-3)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 56,
                  marginBottom: 20,
                }}
              >
                {name[0]?.toUpperCase() ?? "?"}
              </span>
            )}
            <div className="eyebrow" style={{ marginBottom: 16, color: "var(--ink-3)" }}>
              ANALYST_ID <span style={{ color: "var(--ink-2)" }}>// {id}</span>
            </div>
            <h1
              className="display hero-headline"
              style={{ margin: 0, fontSize: 168, color: "var(--ink)" }}
            >
              {handle}
            </h1>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 500 }}>
                {(() => {
                  const realName = [trader.first_name, trader.last_name]
                    .filter(Boolean)
                    .join(" ")
                    .trim();
                  const parts: string[] = [];
                  if (realName) parts.push(realName);
                  if (trader.bio) parts.push(trader.bio);
                  parts.push(
                    `${t("allPnl")} ${fmtUsd(all_time.total_pnl, { sign: true, compact: true })}`,
                  );
                  return parts.join(" · ");
                })()}
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
                {fmtPct(all_time.virtual_return_pct)} {t("heroAllReturn")}
              </div>
            </div>
          </div>

          {/* 30D NET PNL block */}
          <div className="hero-pnl-card">
            <div className="eyebrow" style={{ color: "var(--acid)" }}>
              <span className="blink">▮</span> {t("thirtyDNetPnlEyebrow")}
            </div>
            <div
              className="display num hero-pnl"
              style={{
                fontSize: 88,
                color: stats.total_pnl >= 0 ? "var(--pos)" : "var(--neg)",
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
                label={t("return")}
                value={fmtPct(stats.virtual_return_pct)}
                tone={stats.virtual_return_pct >= 0 ? "pos" : "neg"}
              />
              <HeroSubStat
                label={t("netR")}
                value={fmtR(stats.total_r)}
                tone={stats.total_r >= 0 ? "pos" : "neg"}
              />
              <HeroSubStat
                label={t("winRateShort")}
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
          <div style={{ marginTop: 48 }}>
            <div
              className="referral-strip"
              style={{
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
                <div className="eyebrow" style={{ color: "var(--ink-3)" }}>{t("step01")}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{t("installBottomup")}</div>
              </div>
              <CopyCode code={trader.referral_code} variant="step" locale={locale} />
              <div
                style={{
                  padding: "16px 22px",
                  borderLeft: "1px solid var(--line-2)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  background: "var(--acid)",
                  color: "var(--bg)",
                }}
              >
                <div
                  className="eyebrow"
                  style={{ color: "var(--bg)", opacity: 0.75 }}
                >
                  {t("step03")} · {t("discountBadge")}
                </div>
                <div style={{ fontSize: 13, marginTop: 4, fontWeight: 700 }}>
                  {t("step03Discount", { name })}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "var(--ink-2)",
                lineHeight: 1.5,
              }}
            >
              {t("discountTagline")}
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
  tone: "pos" | "neg" | "ink";
}) {
  const color =
    tone === "pos" ? "var(--pos)" : tone === "neg" ? "var(--neg)" : "var(--ink)";
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
