import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import {
  fetchAnalysts,
  type Analyst,
  type AnalystOrder,
} from "@/lib/bottomup-api";
import { CopyCodeButton } from "./copy-code-button";

export const revalidate = 60;

const ORDER_OPTIONS: Array<{ value: AnalystOrder; label: string }> = [
  { value: "monthly_pnl", label: "Monthly PnL" },
  { value: "monthly_roi", label: "Monthly ROI" },
  { value: "monthly_win_rate", label: "Monthly Win Rate" },
  { value: "win_rate", label: "All-time Win Rate" },
  { value: "pnl", label: "Total PnL" },
  { value: "followers", label: "Followers" },
  { value: "name", label: "Name (A→Z)" },
];

function isOrder(value: string | undefined): value is AnalystOrder {
  return ORDER_OPTIONS.some((o) => o.value === value);
}

function fullName(a: Analyst): string {
  if (a.name) return a.name;
  const fl = [a.first_name, a.last_name].filter(Boolean).join(" ").trim();
  return fl || "—";
}

function fmtUsd(n: number | null): string {
  if (n == null) return "—";
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (abs >= 1000)
    return `${sign}$${(abs / 1000).toFixed(abs >= 10000 ? 1 : 2)}k`;
  return `${sign}$${abs.toFixed(2)}`;
}

function fmtPct(n: number | null): string {
  if (n == null) return "—";
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function pnlColor(n: number | null): string {
  if (n == null || n === 0) return "text-zinc-500";
  return n > 0 ? "text-emerald-400" : "text-rose-400";
}

function winRateBadge(n: number | null): string {
  if (n == null) return "border-zinc-700 bg-zinc-800/60 text-zinc-400";
  if (n >= 60)
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  if (n >= 40) return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  return "border-rose-400/30 bg-rose-400/10 text-rose-300";
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

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      {/* Hero */}
      <section className="mb-10 max-w-3xl">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
          The App Store of Smart Money
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          BottomUP{" "}
          <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-rose-500 bg-clip-text text-transparent">
            Analysts.
          </span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Live performance, follower counts and referral codes for every active
          trader. Use any analyst's code at signup to follow them on day one.
        </p>
      </section>

      {/* Sort chips */}
      <div className="mb-8 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="flex items-center gap-2 whitespace-nowrap pb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Sort
          </span>
          {ORDER_OPTIONS.map((o) => (
            <Link
              key={o.value}
              href={
                o.value === "monthly_pnl" ? "/analyst" : `/analyst?order=${o.value}`
              }
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                order === o.value
                  ? "border-white bg-white text-zinc-950"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-100"
              }`}
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6 text-sm text-rose-200">
          Failed to load data: {error}
        </div>
      ) : analysts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
          No analysts found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {analysts.map((a) => {
            const name = fullName(a);
            const traderHref = `/analyst/${encodeURIComponent(a.name ?? a.trader_id)}`;
            return (
              <article
                key={a.trader_id}
                className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition hover:border-white/20 hover:bg-zinc-900 sm:p-6"
              >
                {/* Header */}
                <header className="flex items-start gap-3">
                  <Link
                    href={traderHref}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/10"
                  >
                    {a.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.image}
                        alt={name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-base font-semibold text-zinc-500">
                        {name[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-white">
                      <Link href={traderHref} className="hover:text-zinc-300">
                        {name}
                      </Link>
                    </h2>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                      <Users className="h-3.5 w-3.5" />
                      {a.followers.toLocaleString("en-US")} followers
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${winRateBadge(
                      a.stats.win_rate,
                    )}`}
                    title="All-time win rate"
                  >
                    {a.stats.win_rate == null
                      ? "—"
                      : `${Math.round(a.stats.win_rate)}% WR`}
                  </span>
                </header>

                {/* KPI grid */}
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Monthly PnL
                    </dt>
                    <dd className={`mt-0.5 text-base font-bold ${pnlColor(a.stats.monthly_pnl)}`}>
                      {fmtUsd(a.stats.monthly_pnl)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Monthly Win Rate
                    </dt>
                    <dd className="mt-0.5 text-base font-bold text-zinc-100">
                      {a.stats.monthly_win_rate == null
                        ? "—"
                        : `${Math.round(a.stats.monthly_win_rate)}%`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Total PnL
                    </dt>
                    <dd className={`mt-0.5 text-base font-bold ${pnlColor(a.stats.pnl)}`}>
                      {fmtUsd(a.stats.pnl)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      PnL Rate
                    </dt>
                    <dd className={`mt-0.5 text-base font-bold ${pnlColor(a.stats.pnl_rate)}`}>
                      {fmtPct(a.stats.pnl_rate)}
                    </dd>
                  </div>
                </dl>

                {/* Referral CTA */}
                {a.referral_code ? (
                  <CopyCodeButton code={a.referral_code} variant="cta" />
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-500">
                    No referral code yet
                  </div>
                )}

                {/* Footer link */}
                <Link
                  href={traderHref}
                  className="-mb-1 inline-flex items-center gap-1 self-start text-xs font-medium text-zinc-400 hover:text-white"
                >
                  View details
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
