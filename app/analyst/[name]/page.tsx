import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
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
    title: `${decoded} — BottomUP Analyst`,
    description: `Performance, recent trades and referral code for ${decoded} on BottomUP.`,
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
  if (n == null || n === 0) return "text-zinc-500";
  return n > 0 ? "text-emerald-400" : "text-rose-400";
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
  tone?: "neutral" | "good" | "bad";
}) {
  const colorClass =
    tone === "good"
      ? "text-emerald-400"
      : tone === "bad"
        ? "text-rose-400"
        : "text-white";
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className={`mt-1 text-xl font-bold ${colorClass} sm:text-2xl`}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
      {children}
    </h2>
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
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-10">
      <Link
        href="/analyst"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        All analysts
      </Link>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6 text-sm text-rose-200">
          Failed to load data: {error}
        </div>
      )}

      {detail && (
        <>
          {/* Hero header */}
          <header className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:gap-8 md:p-8">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-white/10 md:h-28 md:w-28">
                {detail.trader.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={detail.trader.image}
                    alt={displayName(detail.trader)}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-2xl font-bold text-zinc-500">
                    {displayName(detail.trader)[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {displayName(detail.trader)}
                </h1>
                {detail.trader.bio && (
                  <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-zinc-400">
                    {detail.trader.bio}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span className="font-medium text-zinc-100">
                      {detail.trader.followers.toLocaleString("en-US")}
                    </span>
                    followers
                  </span>
                  <a
                    href={`https://bottomup.app/together/profile/${detail.trader.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-300 hover:text-white hover:underline"
                  >
                    Open on bottomup.app
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Referral CTA strip */}
            {detail.trader.referral_code && (
              <div className="border-t border-white/10 bg-gradient-to-r from-emerald-500/10 via-zinc-900/0 to-emerald-500/10 px-6 py-5 md:px-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/90">
                      Follow {displayName(detail.trader)}
                    </div>
                    <p className="mt-0.5 text-sm text-zinc-300">
                      Use this referral code at signup on the{" "}
                      <a
                        href="https://bottomup.app"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-white underline-offset-2 hover:underline"
                      >
                        BottomUP app
                      </a>{" "}
                      to follow them on day one.
                    </p>
                  </div>
                  <CopyCodeButton
                    code={detail.trader.referral_code}
                    variant="cta"
                    label="Referral code"
                  />
                </div>
              </div>
            )}
          </header>

          {/* 30-day stats */}
          <section className="mb-8">
            <SectionHeading>Last 30 days</SectionHeading>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

          {/* All-time + equity curve */}
          <section className="mb-8 grid gap-6 lg:grid-cols-2">
            <div>
              <SectionHeading>All-time</SectionHeading>
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
              <SectionHeading>Equity curve (30d)</SectionHeading>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                <EquityArea data={detail.equity_curve} height={220} />
              </div>
            </div>
          </section>

          {/* Monthly chart */}
          <section className="mb-8">
            <SectionHeading>Monthly net R (last 12 months)</SectionHeading>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
              <MonthlyBars data={detail.monthly} height={240} />
            </div>
          </section>

          {/* Long vs Short */}
          <section className="mb-8">
            <SectionHeading>Long vs Short</SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["long", "short"] as const).map((side) => {
                const s = detail.long_short[side];
                const wr =
                  s.trades > 0 ? Math.round((s.wins / s.trades) * 100) : null;
                return (
                  <div
                    key={side}
                    className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${
                            side === "long"
                              ? "bg-emerald-400/15 text-emerald-300"
                              : "bg-rose-400/15 text-rose-300"
                          }`}
                        >
                          {side === "long" ? "L" : "S"}
                        </span>
                        <span className="font-semibold capitalize text-white">
                          {side}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {s.trades} trades · {wr == null ? "—" : `${wr}% WR`}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Net PnL
                        </div>
                        <div
                          className={`mt-0.5 text-base font-bold ${pnlColor(s.net_pnl)}`}
                        >
                          {fmtUsd(s.net_pnl)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Net R
                        </div>
                        <div
                          className={`mt-0.5 text-base font-bold ${pnlColor(s.net_r)}`}
                        >
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
            <section className="mb-8">
              <SectionHeading>Most traded coins</SectionHeading>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/60">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Coin</th>
                      <th className="px-4 py-3 text-right font-semibold">Trades</th>
                      <th className="px-4 py-3 text-right font-semibold">WR</th>
                      <th className="px-4 py-3 text-right font-semibold">Net R</th>
                      <th className="px-4 py-3 text-right font-semibold">Net PnL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {detail.coins.map((c) => (
                      <tr key={c.coin}>
                        <td className="px-4 py-3 font-medium text-white">{c.coin}</td>
                        <td className="px-4 py-3 text-right text-zinc-400">{c.trades}</td>
                        <td className="px-4 py-3 text-right text-zinc-400">{c.win_rate}%</td>
                        <td className={`px-4 py-3 text-right font-medium ${pnlColor(c.net_r)}`}>
                          {fmtR(c.net_r)}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${pnlColor(c.net_pnl)}`}>
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
              <SectionHeading>Recent trades</SectionHeading>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/60">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Date</th>
                      <th className="px-4 py-3 text-left font-semibold">Coin</th>
                      <th className="px-4 py-3 text-left font-semibold">Side</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">PnL</th>
                      <th className="px-4 py-3 text-right font-semibold">R</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {detail.recent.map((t) => (
                      <tr key={t.id}>
                        <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                          {fmtDate(t.close_date)}
                        </td>
                        <td className="px-4 py-3 font-medium text-white">{t.coin}</td>
                        <td className="px-4 py-3">
                          {t.position == null ? (
                            "—"
                          ) : (
                            <span
                              className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                                t.position === "long"
                                  ? "bg-emerald-400/15 text-emerald-300"
                                  : "bg-rose-400/15 text-rose-300"
                              }`}
                            >
                              {t.position}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 capitalize text-zinc-400">
                          {t.status}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${pnlColor(t.pnl)}`}>
                          {fmtUsd(t.pnl)}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${pnlColor(t.r)}`}>
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
