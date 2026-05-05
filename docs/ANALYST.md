# BottomUP Analyst — lab → prod taşıma + runbook

`bottomup.app/analyst` ve `bottomup.app/analyst/{trader_name}` sayfaları. Trader directory + her trader için detay (KPI, equity curve, monthly bar, coins, recent trades) ve **prominent referans kodu**.

> **Hot path:** UI [`app/analyst/`](../app/analyst/) · Data [`lib/bottomup-api.ts`](../lib/bottomup-api.ts) · Style guide [`docs/DESIGN.md`](DESIGN.md) · Cloudflare worker [`cloudflare/analyst-worker.js`](../cloudflare/analyst-worker.js).

## Mimari (zincir)

```
bottomup.app/analyst*  ──CF Worker──▶  work.bupcore.ai/analyst*  ──fetch──▶  bottomupapi-production.up.railway.app/public/analysts
bottomup.app/_next*    ──CF Worker──▶  work.bupcore.ai/_next*                                        /public/trader/:name
bottomup.app/*         ──CF Worker──▶  301 → www.bottomup.app/{path}
```

- **`bottomup.app/analyst*`** ve **`/_next*`** → Cloudflare Worker `bottomup-analyst-proxy` → bu Studio app'i (`work.bupcore.ai`) reverse-proxy.
- **Studio (Next.js)** → server component `app/analyst/page.tsx` ve `app/analyst/[name]/page.tsx`, `lib/bottomup-api.ts` üzerinden `BOTTOMUP_API_BASE` (default `https://bottomupapi-production.up.railway.app`) çağırır.
- **Backend** (3.0 monorepo, `denizbottomup/bottomup` `main` branch) `apps/api/src/public/public.{controller,service}.ts` içinde:
  - `GET /public/analysts?limit=&order_by=` — trader directory (name, image, referral_code, stats)
  - `GET /public/trader/:name` — full detail (case-insensitive, referral_code dahil)

## Backend kontratı

Studio sadece bu iki public endpoint'i çağırır. Her ikisi de **auth-free**.

### `GET /public/analysts?limit=20&order_by=monthly_pnl`

```ts
type Analyst = {
  trader_id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  referral_code: string | null;
  followers: number;
  stats: {
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
  };
};
```

Sortable keys whitelist (server-side ORDER BY injection guard): `monthly_pnl`, `monthly_pnl_rate`, `monthly_roi`, `monthly_win_rate`, `pnl`, `win_rate`, `rate`, `followers`, `name`. Default `monthly_pnl` DESC. `limit` clamp `[1, 100]`.

### `GET /public/trader/:name`

Case-insensitive name match (server-side `LOWER(u.name) = LOWER($1)` — paylaşılan link kullanıcı tarafından her case ile yazılabilir).

```ts
type TraderDetail = {
  trader: {
    id: string;
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    image: string | null;
    bio: string | null;
    followers: number;
    referral_code: string | null;     // ← prominent CTA, dolu olduğunda emerald strip render
  };
  stats: TraderWindowStats;            // 30-day rolling
  all_time: TraderWindowStats;
  equity_curve: Array<{ t: number; balance: number }>;  // sampled, max ~180 points
  monthly: Array<{ month: string; net_r: number; trades: number }>;  // last 12
  coins: TraderCoinStat[];             // top 8 by net_r
  long_short: { long: { trades, wins, net_r, net_pnl }, short: { … } };
  recent: TraderRecentTrade[];         // 8 most recent closed
};
```

## Live data (WebSocket)

Headline trader stats (followers + monthly_pnl + win_rate + ALL pnl) tick live on both list and detail pages. The deeper detail panels (PerfMatrix, equity curve, monthly bars, recent trades) stay on `revalidate=60` ISR — those derive from raw trades on the API side and would need a separate watcher.

**Plumbing:**
- Workers: [`apps/workers/src/trader-watcher.ts`](https://github.com/denizbottomup/bottomup/blob/main/apps/workers/src/trader-watcher.ts) polls Railway `trader_stats` (same SQL as `PublicService.analystList`) every 15s and `RealtimeBus.publishAlways('analyst', <name>, row)` for each row. Uses `publishAlways` (not deduped `publish`) so the LIVE badge gets a per-tick proof-of-life frame even when nothing changed — `trader_stats` is daily-cron updated, dedup would otherwise leave new visitors stuck on "WAITING FOR FIRST FRAME".
- Redis pub/sub key: `ws:analyst:<lowercased name>`
- WS gateway ([`apps/ws/src/gateway.ts`](https://github.com/denizbottomup/bottomup/blob/main/apps/ws/src/gateway.ts)): fans each per-id event out to both `analyst:<name>` topic subscribers (detail page) **and** `analyst:*` topic subscribers (directory page). `analyst` channel is in the anonymous-allowed list — no JWT needed.
- `analyst` is in [`packages/events/src/index.ts`](https://github.com/denizbottomup/bottomup/blob/main/packages/events/src/index.ts) `WS_CHANNELS`.
- Frontend hook: [`lib/use-analyst-live.ts`](../lib/use-analyst-live.ts) — native `WebSocket('wss://bottomupws-production.up.railway.app/')`, anonymous bind, exponential reconnect (cap 8s).
- List page wrapper: [`app/analyst/v2/live-table.tsx`](../app/analyst/v2/live-table.tsx) — re-sorts on every frame using the active order key.
- Detail page wrapper: [`app/analyst/v2/live-strip.tsx`](../app/analyst/v2/live-strip.tsx) — 5-tile strip above PerfMatrix.

**WS env knobs (workers):**
- `TRADER_WATCHER_ENABLED` (default `true`)
- `TRADER_WATCHER_INTERVAL_MS` (default `15000`)
- `TRADER_WATCHER_LIMIT` (default `100`)

**Frontend env:** `NEXT_PUBLIC_BOTTOMUP_WS_URL` (default `wss://bottomupws-production.up.railway.app/`).

**Common gotcha:** if you add a second publish for the same channel/id pair (e.g. `publish('analyst', '*', ...)` alongside the per-id call), the gateway's built-in wildcard fanout double-sends to `*` subscribers and the dedup cache thrashes (every row overwrites the same `analyst:*` slot). Always publish per-id only; let the gateway handle wildcard fanout.

## CTA policy — değiştirme

Sadece iki CTA destekleniyor; yeni CTA eklemeden önce bu kuralı sor:

1. **Header**: App Store + Google Play install pills (her sayfada). URL'ler:
   - Apple: `https://apps.apple.com/tr/app/bottomup-sofi-trade-finance/id1661474993`
   - Google: `https://play.google.com/store/apps/details?id=com.bottomup.bottomupapp`
2. **Per-trader**: emerald referral code chip (her kart) + emerald gradient strip (detay hero). Copy-to-clipboard, hiçbir yere navigate etmiyor.

❌ **`bottomup.app/web` ya da `together/profile/...` linki ekleme** — bu sayfaların tek conversion goal'i mobile install + analyst code. Web'e götürmek conversion düşürür.

## Cloudflare Worker pattern

[`cloudflare/analyst-worker.js`](../cloudflare/analyst-worker.js) `bottomup.app` zone'unda 3 route:

| Route | Davranış |
|---|---|
| `bottomup.app/analyst*` | `STUDIO_ORIGIN` (= `https://work.bupcore.ai`) origin'ine path/query'i koruyarak proxy. Studio sayfa render eder. |
| `bottomup.app/_next*` | Aynı proxy. Next.js'in CSS/JS chunks ve `/_next/image?url=...` optimization endpoint'i için **şart** — yoksa sayfa unstyled gelir. |
| `bottomup.app/*` (catch-all) | **301 → `https://www.bottomup.app{path}{query}`**. Apex'te dummy AAAA `100::` proxied olduğu için bu fallback olmasa root + diğer path'ler `522 origin error` döner. |

Apex DNS: `bottomup.app` zone'u CF üzerinden, apex'te dummy proxied AAAA `100::` (Worker route'unun tetiklenmesi için en az bir proxied DNS kaydı şart, IP nereye gittiği önemsiz çünkü Worker yakalar).

Mevcut başka worker route'lar (çakışma yok):
- `bottomup.app/logos/*` ve `bottomup.app/assets/{index.js,index.css}` → `hello-world-proud-bird-cc78` worker (`analysts.bottomup.app` Ghost blog proxy'si). `bottomup.app/analysts` (çoğul) ile karıştırma — bizim route `/analyst*` (tekil).

## Deploy checklist (yeni feature analyst tarafına eklerken)

1. **Backend**: `apps/api/src/public/public.{controller,service}.ts`'e raw SQL query ekle. ORDER BY whitelist + LIMIT cap zorunlu (SQL injection guard).
2. **Frontend types**: [`lib/bottomup-api.ts`](../lib/bottomup-api.ts) içine yeni interface + fetch helper.
3. **Page**: `app/analyst/...` altında server component. ISR `revalidate = 60` (1 dk cache).
4. **Tasarım kontratı**: [`docs/DESIGN.md`](DESIGN.md)'deki dark theme token'larına sadık kal — `bg-zinc-950`, `border-white/10`, `text-emerald-400`/`text-rose-400` PnL renkleri, Inter, max-w-[1400px].
5. **Push**:
   ```bash
   # Backend (denizbottomup/bottomup repo'sundan):
   git push origin lab:main      # api'yi tetikler
   # Frontend (bu repo, bottomupapp/bupcore):
   git push origin HEAD:main     # Studio'yu tetikler
   ```
6. **Test**:
   - `https://bottomupapi-production.up.railway.app/public/<endpoint>` curl
   - `https://bottomup.app/analyst...` browser

## Sıkça yaşanan sorunlar

| Symptom | Sebep | Çözüm |
|---|---|---|
| `bottomup.app/analyst` HTML var ama CSS yok (unstyled) | Worker `/_next*` route'u eksik | CF dashboard → bottomup.app zone → Workers → Routes → `bottomup.app/_next*` → `bottomup-analyst-proxy` ekle |
| `bottomup.app/` 522 origin error | Apex AAAA dummy yok veya catch-all worker route yok | DNS apex'e proxied AAAA `100::` ekle + Worker'ın `/*` route'u `bottomup-analyst-proxy`'e bağlı olsun (worker fallback'te 301 → www) |
| `/analyst/awerte` 404 ama `/analyst/Awerte` 200 | Backend SQL `WHERE u.name = $1` case-sensitive | `LOWER(u.name) = LOWER($1)` (zaten yapıldı, regression check için) |
| Avatar bazı kartlarda boş | Firebase Storage URL'i auth gerektiriyor veya CORS | `<img referrerPolicy="no-referrer">` zaten set; bazı eski avatar URL'leri public değil — backend'de `image` null dönüyorsa fallback letter render edilir |
| Sayfa cache eski içerik | Next.js `revalidate=60` + CF edge cache | Cache-buster `?_=<timestamp>` ile zorla yenile; ISR 60s sonra otomatik refresh |

## Cross-repo bağlantı

Analyst sayfası **iki repo'ya bağımlı**:
- Bu repo (`bottomupapp/bupcore`, Studio) — UI + CF worker
- `denizbottomup/bottomup` `main` branch — backend public endpoint'leri

Backend değişikliği isterken oradaki [`docs/RAILWAY.md`](https://github.com/denizbottomup/bottomup/blob/main/docs/RAILWAY.md) ve `apps/api/src/public/` klasörüne bak.
