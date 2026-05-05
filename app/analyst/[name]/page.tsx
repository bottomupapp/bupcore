import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { fetchTraderDetail, type TraderDetail } from "@/lib/bottomup-api";
import { CopyCodeButton } from "../copy-code-button";
import { EquityArea, MonthlyBars } from "./charts";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return {
    title: `${decoded} — Bottomup Analyst`,
    description: `Performance, recent trades and referral code for ${decoded} on Bottomup.`,
  };
}

function fmtUsd(n: number | null | undefined, frac = 2): string {
  if (n == null) return "—";
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (abs >= 1000)
    return `${sign}$${(abs / 1000).toFixed(abs >= 10000 ? 1 : 2)}k`;
  return `${sign}$${abs.toFixed(frac)}`;
}

function fmtPct(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function fmtR(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}R`;
}

function pnlColor(n: number | null | undefined): string {
  if (n == null || n === 0) return "text-muted";
  return n > 0 ? "text-emerald-600" : "text-rose-600";
}

function fmtDate(s: string | null): string {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function displayName(t: TraderDetail["trader"]): string {
  if (t.name) return t.name;
  return [t.first_name, t.last_name].filter(Boolean).join(" ").trim() || "—";
}

function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "good" | "bad" | "auto";
  toneValue?: number;
}) {
  const colorClass =
    tone === "good"
      ? "text-emerald-600"
      : tone === "bad"
        ? "text-rose-600"
        : "text-fg";
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${colorClass}`}>{value}</div>
      {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
    </div>
  );
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/analyst"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All analysts
      </Link>

      {error && (
        <div className="card p-6 text-sm text-rose-600 mb-6">
          Failed to load data: {error}
        </div>
      )}

      {detail && (
        <>
          {/* Header */}
          <header className="card p-6 flex flex-col sm:flex-row gap-5 items-start mb-8">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-border/40">
              {detail.trader.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={detail.trader.image}
                  alt={displayName(detail.trader)}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-xl font-semibold text-muted">
                  {displayName(detail.trader)[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight">
                {displayName(detail.trader)}
              </h1>
              {detail.trader.bio && (
                <p className="mt-2 text-sm text-muted whitespace-pre-line">
                  {detail.trader.bio}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {detail.trader.followers.toLocaleString("en-US")} followers
                </span>
                <a
                  href={`https://bottomup.app/together/profile/${detail.trader.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  Open on bottomup.app →
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="label">Referral code</span>
              {detail.trader.referral_code ? (
                <CopyCodeButton code={detail.trader.referral_code} />
              ) : (
                <span className="text-xs text-muted">—</span>
              )}
            </div>
          </header>

          {/* 30-day stats */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
              Last 30 days
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Virtual Balance"
                value={fmtUsd(detail.stats.virtual_balance_usd)}
                sub={`${fmtPct(detail.stats.virtual_return_pct)} return`}
                tone={detail.stats.virtual_return_pct >= 0 ? "good" : "bad"}
              />
              <StatCard
                label="Net PnL"
                value={fmtUsd(detail.stats.total_pnl)}
                sub={fmtR(detail.stats.total_r)}
                tone={detail.stats.total_pnl >= 0 ? "good" : "bad"}
              />
              <StatCard
                label="Win Rate"
                value={
                  detail.stats.win_rate == null
                    ? "—"
                    : `${Math.round(detail.stats.win_rate * 100)}%`
                }
                sub={`${detail.stats.wins}W / ${detail.stats.losses}L`}
              />
              <StatCard
                label="Trades"
                value={String(detail.stats.trades)}
                sub={
                  detail.stats.best_trade_pnl != null
                    ? `Best ${fmtUsd(detail.stats.best_trade_pnl)}`
                    : undefined
                }
              />
            </div>
          </section>

          {/* All time + equity curve */}
          <section className="mb-10 grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                All-time
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Virtual Balance"
                  value={fmtUsd(detail.all_time.virtual_balance_usd)}
                  sub={`${fmtPct(detail.all_time.virtual_return_pct)} return`}
                  tone={
                    detail.all_time.virtual_return_pct >= 0 ? "good" : "bad"
                  }
                />
                <StatCard
                  label="Net PnL"
                  value={fmtUsd(detail.all_time.total_pnl)}
                  sub={fmtR(detail.all_time.total_r)}
                  tone={detail.all_time.total_pnl >= 0 ? "good" : "bad"}
                />
                <StatCard
                  label="Win Rate"
                  value={
                    detail.all_time.win_rate == null
                      ? "—"
                      : `${Math.round(detail.all_time.win_rate * 100)}%`
                  }
                  sub={`${detail.all_time.wins}W / ${detail.all_time.losses}L`}
                />
                <StatCard
                  label="Total Trades"
                  value={String(detail.all_time.trades)}
                />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                Equity curve (30d)
              </h2>
              <div className="card p-3">
                <EquityArea data={detail.equity_curve} height={200} />
              </div>
            </div>
          </section>

          {/* Monthly chart */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
              Monthly net R (last 12 months)
            </h2>
            <div className="card p-3">
              <MonthlyBars data={detail.monthly} height={220} />
            </div>
          </section>

          {/* Long vs Short */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
              Long vs Short
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(["long", "short"] as const).map((side) => {
                const s = detail.long_short[side];
                const wr = s.trades > 0 ? Math.round((s.wins / s.trades) * 100) : null;
                return (
                  <div key={side} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold capitalize">
                        {side === "long" ? "Long" : "Short"}
                      </div>
                      <div className="text-xs text-muted">
                        {s.trades} trades · {wr == null ? "—" : `${wr}% WR`}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="label">Net PnL</div>
                        <div className={`font-semibold ${pnlColor(s.net_pnl)}`}>
                          {fmtUsd(s.net_pnl)}
                        </div>
                      </div>
                      <div>
                        <div className="label">Net R</div>
                        <div className={`font-semibold ${pnlColor(s.net_r)}`}>
                          {fmtR(s.net_r)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Coin breakdown */}
          {detail.coins.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                Most traded coins
              </h2>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted uppercase">
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2 font-medium">Coin</th>
                      <th className="text-right px-4 py-2 font-medium">Trades</th>
                      <th className="text-right px-4 py-2 font-medium">WR</th>
                      <th className="text-right px-4 py-2 font-medium">Net R</th>
                      <th className="text-right px-4 py-2 font-medium">Net PnL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.coins.map((c) => (
                      <tr key={c.coin} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-2 font-medium">{c.coin}</td>
                        <td className="px-4 py-2 text-right">{c.trades}</td>
                        <td className="px-4 py-2 text-right">{c.win_rate}%</td>
                        <td className={`px-4 py-2 text-right ${pnlColor(c.net_r)}`}>
                          {fmtR(c.net_r)}
                        </td>
                        <td className={`px-4 py-2 text-right ${pnlColor(c.net_pnl)}`}>
                          {fmtUsd(c.net_pnl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Recent trades */}
          {detail.recent.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                Recent trades
              </h2>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted uppercase">
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2 font-medium">Date</th>
                      <th className="text-left px-4 py-2 font-medium">Coin</th>
                      <th className="text-left px-4 py-2 font-medium">Side</th>
                      <th className="text-left px-4 py-2 font-medium">Status</th>
                      <th className="text-right px-4 py-2 font-medium">PnL</th>
                      <th className="text-right px-4 py-2 font-medium">R</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.recent.map((t) => (
                      <tr key={t.id} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-2 text-muted">{fmtDate(t.close_date)}</td>
                        <td className="px-4 py-2 font-medium">{t.coin}</td>
                        <td className="px-4 py-2">
                          {t.position == null ? (
                            "—"
                          ) : (
                            <span
                              className={`text-xs rounded px-1.5 py-0.5 font-medium ${
                                t.position === "long"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {t.position}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-muted capitalize">{t.status}</td>
                        <td className={`px-4 py-2 text-right ${pnlColor(t.pnl)}`}>
                          {fmtUsd(t.pnl)}
                        </td>
                        <td className={`px-4 py-2 text-right ${pnlColor(t.r)}`}>
                          {fmtR(t.r)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
