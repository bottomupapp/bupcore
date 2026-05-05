import type { TraderWindowStats } from "@/lib/bottomup-api";
import { fmtPct, fmtR, fmtUsd } from "./format";
import { tFor, type Locale } from "./i18n";

export function PerfMatrix({
  d30,
  all,
  locale = "en",
}: {
  d30: TraderWindowStats;
  all: TraderWindowStats;
  locale?: Locale;
}) {
  const t = tFor(locale);
  return (
    <section style={{ marginTop: 32 }}>
      <div
        className="eyebrow"
        style={{ marginBottom: 14, display: "flex", justifyContent: "space-between" }}
      >
        <span>// {t("performanceMatrix")}</span>
        <span style={{ color: "var(--ink-4)" }}>{t("sourceBottomup")}</span>
      </div>
      <div
        style={{
          display: "grid",
          gap: 0,
          border: "1px solid var(--line-2)",
          background: "var(--bg-2)",
        }}
      >
        <PerfRow data={d30} primary="30d" t={t} />
        <div style={{ height: 1, background: "var(--line-2)" }} />
        <PerfRow data={all} primary="all" t={t} />
      </div>
    </section>
  );
}

function PerfRow({
  data,
  primary,
  t,
}: {
  data: TraderWindowStats;
  primary: "30d" | "all";
  t: ReturnType<typeof tFor>;
}) {
  const isUp = data.virtual_return_pct >= 0;
  const winRatePct = data.win_rate == null ? null : Math.round(data.win_rate * 100);
  const headLabel = primary === "30d" ? t("last30d") : t("allTime");
  return (
    <div className="stat-grid perf-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
      <PerfCell
        head={headLabel}
        sub={t("window")}
        big={
          <span className="display" style={{ fontSize: 28, color: "var(--ink)" }}>
            {headLabel.replace(/-/g, "‑")}
          </span>
        }
      />
      <PerfCell
        head={t("return")}
        sub={`${t("pnl")} ${fmtUsd(data.total_pnl, { sign: true, compact: true })} · ${t("netR")} ${fmtR(data.total_r)}`}
        big={
          <span
            className="display num"
            style={{ fontSize: 40, color: isUp ? "var(--acid)" : "var(--warn)" }}
          >
            {fmtPct(data.virtual_return_pct)}
          </span>
        }
      />
      <PerfCell
        head={t("winRate")}
        sub={
          <>
            <span style={{ color: "var(--acid)" }}>{data.wins}W</span> ·{" "}
            <span style={{ color: "var(--warn)" }}>{data.losses}L</span>
          </>
        }
        big={
          <span className="display num" style={{ fontSize: 40, color: "var(--ink)" }}>
            {winRatePct == null ? "—" : `${winRatePct}%`}
          </span>
        }
      />
      <PerfCell
        head={primary === "30d" ? t("bestTrade") : t("totalTrades")}
        sub={primary === "30d" ? t("thirtyDayPeak") : t("career")}
        big={
          primary === "30d"
            ? data.best_trade_pnl != null
              ? (
                <span className="display num" style={{ fontSize: 36, color: "var(--acid)" }}>
                  {fmtUsd(data.best_trade_pnl, { sign: true, compact: true })}
                </span>
              )
              : <span className="display" style={{ fontSize: 28, color: "var(--ink-3)" }}>—</span>
            : (
              <span className="display num" style={{ fontSize: 40, color: "var(--ink)" }}>
                {data.trades.toLocaleString("en-US")}
              </span>
            )
        }
        noBorder
      />
    </div>
  );
}

function PerfCell({
  head,
  sub,
  big,
  noBorder = false,
}: {
  head: string;
  sub: React.ReactNode;
  big: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div
      className="pad"
      style={{
        padding: "24px 24px 20px",
        borderRight: noBorder ? "none" : "1px solid var(--line-2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 140,
      }}
    >
      <div className="eyebrow">{head}</div>
      <div style={{ marginTop: 16, marginBottom: 8 }}>{big}</div>
      <div className="num" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".06em" }}>
        {sub}
      </div>
    </div>
  );
}
