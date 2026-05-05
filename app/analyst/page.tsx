import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
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
  if (n == null || n === 0) return "text-muted";
  return n > 0 ? "text-emerald-600" : "text-rose-600";
}

function winRateBadge(n: number | null): string {
  if (n == null) return "bg-border/40 text-muted";
  if (n >= 60) return "bg-emerald-100 text-emerald-700";
  if (n >= 40) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
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
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Bottomup Analysts
        </h1>
        <p className="text-muted">
          Live performance, follower counts and referral codes for every active
          trader.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Sort:</span>
        {ORDER_OPTIONS.map((o) => (
          <Link
            key={o.value}
            href={o.value === "monthly_pnl" ? "/analyst" : `/analyst?order=${o.value}`}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              order === o.value
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface text-muted hover:text-fg"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>

      {error ? (
        <div className="card p-6 text-sm text-rose-600">
          Failed to load data: {error}
        </div>
      ) : analysts.length === 0 ? (
        <div className="card p-6 text-sm text-muted">
          No analysts found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analysts.map((a) => {
            const name = fullName(a);
            return (
              <article key={a.trader_id} className="card p-5 flex flex-col gap-4">
                <header className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-border/40">
                    {a.image ? (
                      // Image host'ları next.config.mjs'te whitelistli
                      // değilse fallback olarak <img> kullanıyoruz.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.image}
                        alt={name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-sm font-semibold text-muted">
                        {name[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold truncate">
                      <Link
                        href={`/analyst/${encodeURIComponent(a.name ?? a.trader_id)}`}
                        className="hover:text-accent"
                      >
                        {name}
                      </Link>
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                      <Users className="h-3.5 w-3.5" />
                      {a.followers.toLocaleString("en-US")} followers
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${winRateBadge(
                      a.stats.win_rate,
                    )}`}
                    title="All-time win rate"
                  >
                    {a.stats.win_rate == null ? "—" : `${Math.round(a.stats.win_rate)}%`}
                  </span>
                </header>

                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <div>
                    <dt className="label">Monthly PnL</dt>
                    <dd className={`font-semibold ${pnlColor(a.stats.monthly_pnl)}`}>
                      {fmtUsd(a.stats.monthly_pnl)}
                    </dd>
                  </div>
                  <div>
                    <dt className="label">Monthly Win Rate</dt>
                    <dd className="font-semibold">
                      {a.stats.monthly_win_rate == null
                        ? "—"
                        : `${Math.round(a.stats.monthly_win_rate)}%`}
                    </dd>
                  </div>
                  <div>
                    <dt className="label">Total PnL</dt>
                    <dd className={`font-semibold ${pnlColor(a.stats.pnl)}`}>
                      {fmtUsd(a.stats.pnl)}
                    </dd>
                  </div>
                  <div>
                    <dt className="label">PnL Rate</dt>
                    <dd className={`font-semibold ${pnlColor(a.stats.pnl_rate)}`}>
                      {fmtPct(a.stats.pnl_rate)}
                    </dd>
                  </div>
                </dl>

                <footer className="flex items-center justify-between gap-2 border-t border-border pt-4">
                  <div className="flex flex-col">
                    <span className="label">Referral code</span>
                    {a.referral_code ? (
                      <CopyCodeButton code={a.referral_code} />
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </div>
                  <Link
                    href={`/analyst/${encodeURIComponent(a.name ?? a.trader_id)}`}
                    className="text-xs text-accent hover:underline"
                  >
                    View details →
                  </Link>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
