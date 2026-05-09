/**
 * Server-side client for the Bottomup 3.0 backend's public REST surface.
 * Defaults to the Railway lab API so the page works out-of-the-box on a
 * fresh clone; set BOTTOMUP_API_BASE to swap (e.g. api.bottomup.app once
 * the endpoint promotes to the FastAPI prod cluster).
 */
const BUP_API_BASE =
  process.env.BOTTOMUP_API_BASE ??
  "https://bottomupapi-production.up.railway.app";

export interface AnalystStats {
  win_rate: number | null;
  monthly_win_rate: number | null;
  pnl: number | null;
  pnl_rate: number | null;
  monthly_pnl: number | null;
  monthly_pnl_rate: number | null;
  monthly_r: number | null;
  monthly_roi: number | null;
  rate: number | null;
  risk_score: number | null;
  stat_at: string | null;
}

export interface Analyst {
  trader_id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  referral_code: string | null;
  followers: number;
  stats: AnalystStats;
}

export type AnalystOrder =
  | "monthly_pnl"
  | "monthly_pnl_rate"
  | "monthly_roi"
  | "monthly_win_rate"
  | "pnl"
  | "win_rate"
  | "rate"
  | "name";

export async function fetchAnalysts(
  limit = 50,
  orderBy: AnalystOrder = "monthly_pnl",
  activeWithinDays?: number,
): Promise<Analyst[]> {
  const url = new URL("/public/analysts", BUP_API_BASE);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("order_by", orderBy);
  if (activeWithinDays && activeWithinDays > 0) {
    url.searchParams.set("active_within_days", String(activeWithinDays));
  }

  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(
      `Bottomup /public/analysts ${res.status} ${res.statusText}`,
    );
  }
  return (await res.json()) as Analyst[];
}

export interface TraderWindowStats {
  trades: number;
  wins: number;
  losses: number;
  win_rate: number | null;
  total_pnl: number;
  total_r: number;
  best_trade_pnl?: number;
  worst_trade_pnl?: number;
  virtual_balance_usd: number;
  virtual_return_pct: number;
}

export interface TraderCoinStat {
  coin: string;
  trades: number;
  wins: number;
  win_rate: number;
  net_r: number;
  net_pnl: number;
}

export interface TraderRecentTrade {
  id: string;
  coin: string;
  position: "long" | "short" | null;
  status: string;
  close_date: string | null;
  pnl: number;
  r: number;
  index: number;
  is_locked: boolean;
}

export interface TraderDetail {
  trader: {
    id: string;
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    image: string | null;
    bio: string | null;
    followers: number;
    referral_code: string | null;
  };
  stats: TraderWindowStats;
  all_time: TraderWindowStats;
  equity_curve: Array<{ t: number; balance: number }>;
  monthly: Array<{ month: string; net_r: number; trades: number }>;
  coins: TraderCoinStat[];
  long_short: {
    long: { trades: number; wins: number; net_r: number; net_pnl: number };
    short: { trades: number; wins: number; net_r: number; net_pnl: number };
  };
  recent: TraderRecentTrade[];
}

export async function fetchTraderDetail(
  name: string,
): Promise<TraderDetail | null> {
  const url = new URL(
    `/public/trader/${encodeURIComponent(name)}`,
    BUP_API_BASE,
  );
  // 5-second ISR window matches the detail page's revalidate setting.
  // The ws `analyst:<trader_id>` channel triggers `router.refresh()` on
  // closed trades; at the next revalidate tick (≤5s) the cache is
  // refreshed. Tighter than 5s isn't worth it given client-perceived
  // latency, and avoids the per-request re-fetch storm that
  // cache: 'no-store' caused.
  const res = await fetch(url, {
    next: { revalidate: 5 },
    headers: { accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `Bottomup /public/trader/${name} ${res.status} ${res.statusText}`,
    );
  }
  return (await res.json()) as TraderDetail;
}
