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
  return n > 0 ? "text-emerald-600" : "text-rose-600";
}

function winRateBadge(n: number | null): string {
  if (n == null) return "border-zinc-200 bg-zinc-50 text-zinc-500";
  if (n >= 60) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (n >= 40) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
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
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
          The App Store of Smart Money
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          BottomUP Analysts
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
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
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          Failed to load data: {error}
        </div>
      ) : analysts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
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
                className="group flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md sm:p-6"
              >
                {/* Header */}
                <header className="flex items-start gap-3">
                  <Link
                    href={traderHref}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200"
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
                      <div className="grid h-full w-full place-items-center text-base font-semibold text-zinc-400">
                        {name[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-zinc-900">
                      <Link
                        href={traderHref}
                        className="hover:text-zinc-700"
                      >
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
                    <dd className="mt-0.5 text-base font-bold text-zinc-900">
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
                  <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
                    No referral code yet
                  </div>
                )}

                {/* Footer link */}
                <Link
                  href={traderHref}
                  className="-mb-1 inline-flex items-center gap-1 self-start text-xs font-medium text-zinc-600 hover:text-zinc-900"
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
