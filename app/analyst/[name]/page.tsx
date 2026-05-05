import { notFound } from "next/navigation";
import { fetchTraderDetail, type TraderDetail } from "@/lib/bottomup-api";
import { TopBar, TickerTape } from "../v2/top-bar";
import { Hero } from "../v2/hero";
import { PerfMatrix } from "../v2/perf-matrix";
import { EquityCard } from "../v2/equity-card";
import { MonthlyBars } from "../v2/monthly-bars";
import { LongShort } from "../v2/long-short";
import { TopCoins } from "../v2/top-coins";
import { RecentTrades } from "../v2/recent-trades";
import { StickyFoot } from "../v2/sticky-foot";
import { LiveStrip } from "../v2/live-strip";
import { AnalystAutoRefresh } from "../v2/auto-refresh";
import { ShareButton } from "../v2/share-button";
import { fmtPct, fmtR } from "../v2/format";

// Short ISR window. The detail page also gets `router.refresh()`
// pinged by the ws `analyst:<trader_id>` channel on every closed
// setup — between revalidate ticks, that path triggers fresh server
// component evaluation. force-dynamic was tried briefly but produced
// React #418 hydration errors with the streamed RSC payload.
export const revalidate = 5;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return {
    title: `${decoded.toUpperCase()} / BottomUP Terminal`,
    description: `${decoded} — performance terminal on BottomUP.`,
  };
}

function displayName(t: TraderDetail["trader"]): string {
  if (t.name) return t.name;
  return [t.first_name, t.last_name].filter(Boolean).join(" ").trim() || "—";
}

export default async function AnalystDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);

  let detail: TraderDetail | null = null;
  let error: string | null = null;
  try {
    detail = await fetchTraderDetail(decoded);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  if (!detail && !error) notFound();

  if (!detail) {
    // Soft error fallback within the V2 chrome
    return (
      <>
        <TopBar crumb={`/ ANALYST / ${decoded.toUpperCase()}`} />
        <main style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 32px 120px" }}>
          <div
            style={{
              border: "1px solid var(--warn)",
              padding: "32px 28px",
              background: "var(--bg-2)",
              fontSize: 13,
            }}
          >
            <div className="eyebrow" style={{ color: "var(--warn)", marginBottom: 12 }}>
              FETCH ERROR
            </div>
            <div style={{ color: "var(--ink-2)", whiteSpace: "pre-wrap" }}>{error}</div>
          </div>
        </main>
      </>
    );
  }

  const name_ = displayName(detail.trader);
  const handle = (detail.trader.referral_code ?? name_).toUpperCase();

  const tape = [
    {
      k: `${handle} 30D`,
      v: fmtPct(detail.stats.virtual_return_pct),
      up: detail.stats.virtual_return_pct >= 0,
    },
    {
      k: `${handle} WR`,
      v:
        detail.stats.win_rate == null
          ? "—"
          : `${Math.round(detail.stats.win_rate * 100)}%`,
    },
    {
      k: `${handle} ALL`,
      v: fmtR(detail.all_time.total_r),
      up: detail.all_time.total_r >= 0,
    },
    {
      k: "FOLLOWERS",
      v: detail.trader.followers.toLocaleString("en-US") + " ↑",
    },
    detail.coins[0]
      ? {
          k: "TOP COIN",
          v: `${detail.coins[0].coin.replace(/USDT$/i, "")} ${fmtR(
            detail.coins[0].net_r,
          )}`,
          up: detail.coins[0].net_r >= 0,
        }
      : null,
    {
      k: "ALL TRADES",
      v: detail.all_time.trades.toLocaleString("en-US"),
    },
    { k: "BUPCORE.AI", v: "ACTIVE", up: true },
  ].filter((x): x is { k: string; v: string; up?: boolean } => x !== null);

  return (
    <>
      <AnalystAutoRefresh traderId={detail.trader.id} />
      <ShareButton name={name_} />
      <TopBar crumb={`/ ANALYST / ${handle}`} />
      <TickerTape items={tape} />
      <Hero detail={detail} />

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px 120px" }}>
        <LiveStrip
          name={name_}
          initial={{
            followers: detail.trader.followers,
            referral_code: detail.trader.referral_code,
          }}
        />
        <PerfMatrix d30={detail.stats} all={detail.all_time} />

        <section style={{ marginTop: 32 }}>
          <div
            className="grid-mosaic"
            style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}
          >
            <EquityCard detail={detail} />
            <MonthlyBars data={detail.monthly} />
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <div
            className="grid-mosaic"
            style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20 }}
          >
            <div style={{ border: "1px solid var(--line-2)", background: "var(--bg-2)" }}>
              <LongShort data={detail.long_short} />
            </div>
            <TopCoins coins={detail.coins} />
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <RecentTrades trades={detail.recent} totalTrades={detail.all_time.trades} />
        </section>

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

      <StickyFoot
        name={name_}
        avatar={detail.trader.image}
        referralCode={detail.trader.referral_code}
      />
    </>
  );
}
