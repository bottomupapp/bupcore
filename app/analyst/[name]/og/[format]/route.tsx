import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { fetchTraderDetail, type TraderDetail } from "@/lib/bottomup-api";
import { resolveLocale, tFor, type Locale } from "../../../v2/i18n";

/**
 * Social-share PNG generator for analyst pages. Three platform-tuned
 * formats; each is a single PNG response with Cache-Control set so
 * downstream CDNs (Cloudflare) can cache the asset for the brief
 * window between trade closes.
 *
 *   GET /analyst/<name>/og/twitter  → 1200×675  (X / LinkedIn / FB)
 *   GET /analyst/<name>/og/square   → 1080×1080 (Instagram feed)
 *   GET /analyst/<name>/og/story    → 1080×1920 (Stories / TikTok)
 *
 * Hero stat is auto-picked: whichever metric makes the trader look
 * best (high WR, high return, high PnL — see pickHero).
 */

// Node runtime + manual satori → native Resvg pipeline.
//
// We can't use `next/og`'s `ImageResponse` here. Its bundled
// resvg-wasm has a known "memory access out of bounds" failure mode
// after a Node process has rendered ~N images (the wasm heap gets
// corrupted and never recovers). On our self-hosted Railway box
// this manifested as: deploy → first ~5 min OK → 100% of fresh
// renders 500. Switching to native `@resvg/resvg-js` (a Rust addon,
// not wasm) sidesteps that bug entirely.
//
// `dynamic = "force-dynamic"` instead of `revalidate`: rely on
// Cloudflare edge cache via the response's `s-maxage` header.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORMATS = {
  twitter: { width: 1200, height: 675 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
} as const;

type Format = keyof typeof FORMATS;

const TOKENS = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#181818",
  ink: "#F5F5F0",
  ink2: "#B8B8B0",
  ink3: "#6E6E68",
  line: "#1F1F1F",
  line2: "#262626",
  // Logo palette adopted from the brand sampling. acid keeps the
  // referral-CTA orange; pos/neg drive trader gain/loss colors.
  acid: "#FF6B1A",
  pos: "#1FC16B",
  neg: "#FF5577",
  // Backwards-compat alias — the hero stat tone math used to flip
  // between acid (gain) and warn (loss); keep `warn` pointing at the
  // new neg so existing references stay valid until they're cleaned
  // up below.
  warn: "#FF5577",
} as const;

type HeroLabelKey =
  | "hero7dReturn"
  | "hero30dReturn"
  | "heroAllReturn"
  | "hero7dNetPnl"
  | "hero30dNetPnl"
  | "heroAllNetPnl"
  | "hero7dWinRate"
  | "hero30dWinRate"
  | "heroAllWinRate";

interface Hero {
  /** i18n key for the eyebrow/label above the value */
  labelKey: HeroLabelKey;
  /** Pre-formatted hero value (numbers, % — already locale-safe) */
  value: string;
  /**
   * Sub line. `kind: "wl"` → `${wins}W · ${losses}L` rendered locally.
   * `kind: "amount"` → just an already-formatted string (e.g. `+$2,983`).
   * `kind: "returnPct"` → `+X.XX% RETURN` joined with translated suffix.
   */
  sub:
    | { kind: "wl"; wins: number; losses: number }
    | { kind: "amount"; text: string }
    | { kind: "returnPct"; pct: number };
  tone: "up" | "down";
}

function fullName(t: TraderDetail["trader"]): string {
  if (t.name) return t.name;
  return [t.first_name, t.last_name].filter(Boolean).join(" ").trim() || "—";
}

function fmtUsd(n: number, sign = false): string {
  const abs = Math.abs(n);
  let body: string;
  if (abs >= 1000)
    body = "$" + abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  else body = "$" + abs.toFixed(2);
  if (n < 0) return "−" + body;
  if (sign && n > 0) return "+" + body;
  return body;
}

function compute7d(detail: TraderDetail): {
  wins: number;
  losses: number;
  pnl: number;
  returnPct: number;
  winRate: number | null;
} {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let wins = 0;
  let losses = 0;
  let pnl = 0;
  for (const t of detail.recent) {
    if (!t.close_date) continue;
    if (new Date(t.close_date).getTime() < cutoff) continue;
    if (t.status === "success") wins += 1;
    else if (t.status === "stopped") losses += 1;
    pnl += t.pnl;
  }
  const decided = wins + losses;
  const winRate = decided > 0 ? (wins / decided) * 100 : null;
  // Same $10k starting balance assumption used elsewhere in the app.
  const returnPct = (pnl / 10000) * 100;
  return { wins, losses, pnl, returnPct, winRate };
}

/**
 * Pick the trader's most marketable metric across windows. Prefers
 * fresher signals (7D > 30D > all-time) when they're strong; falls
 * back to all-time return when nothing meets the "wow" thresholds.
 *
 * Sub text never references trade count — focus is on the headline
 * value and one supporting performance number.
 */
function pickHero(detail: TraderDetail): Hero {
  const all = detail.all_time;
  const m30 = detail.stats;
  const w7 = compute7d(detail);

  const wrAll = (all.win_rate ?? 0) * 100;
  const wr30 = (m30.win_rate ?? 0) * 100;
  const wr7 = w7.winRate ?? 0;
  const retAll = all.virtual_return_pct;
  const ret30 = m30.virtual_return_pct;
  const ret7 = w7.returnPct;
  const pnlAll = all.total_pnl;
  const pnl30 = m30.total_pnl;
  const pnl7 = w7.pnl;
  const W7 = 1.4;
  const W30 = 1.15;
  const WALL = 1.0;

  type C = Hero & { score: number };
  const candidates: C[] = [];

  if (ret7 >= 8) {
    candidates.push({
      score: Math.min(ret7, 200) * W7,
      labelKey: "hero7dReturn",
      value: `+${ret7.toFixed(2)}%`,
      sub: { kind: "amount", text: fmtUsd(pnl7, true) },
      tone: "up",
    });
  }
  if (ret30 >= 15) {
    candidates.push({
      score: Math.min(ret30, 200) * W30,
      labelKey: "hero30dReturn",
      value: `+${ret30.toFixed(2)}%`,
      sub: { kind: "amount", text: fmtUsd(pnl30, true) },
      tone: "up",
    });
  }
  if (retAll >= 15) {
    candidates.push({
      score: Math.min(retAll, 200) * WALL,
      labelKey: "heroAllReturn",
      value: `+${retAll.toFixed(2)}%`,
      sub: { kind: "amount", text: fmtUsd(pnlAll, true) },
      tone: "up",
    });
  }

  if (pnl7 >= 1000) {
    candidates.push({
      score: (60 + Math.log10(pnl7) * 5) * W7,
      labelKey: "hero7dNetPnl",
      value: fmtUsd(pnl7, true),
      sub: { kind: "returnPct", pct: ret7 },
      tone: "up",
    });
  }
  if (pnl30 >= 3000) {
    candidates.push({
      score: (60 + Math.log10(pnl30) * 5) * W30,
      labelKey: "hero30dNetPnl",
      value: fmtUsd(pnl30, true),
      sub: { kind: "returnPct", pct: ret30 },
      tone: "up",
    });
  }
  if (pnlAll >= 3000) {
    candidates.push({
      score: (55 + Math.log10(pnlAll) * 5) * WALL,
      labelKey: "heroAllNetPnl",
      value: fmtUsd(pnlAll, true),
      sub: { kind: "returnPct", pct: retAll },
      tone: "up",
    });
  }

  if (wr7 >= 70 && w7.wins + w7.losses >= 3) {
    candidates.push({
      score: wr7 * W7,
      labelKey: "hero7dWinRate",
      value: `${Math.round(wr7)}%`,
      sub: { kind: "wl", wins: w7.wins, losses: w7.losses },
      tone: "up",
    });
  }
  if (wr30 >= 65 && m30.trades >= 5) {
    candidates.push({
      score: wr30 * W30,
      labelKey: "hero30dWinRate",
      value: `${Math.round(wr30)}%`,
      sub: { kind: "wl", wins: m30.wins, losses: m30.losses },
      tone: "up",
    });
  }
  if (wrAll >= 60 && all.wins + all.losses >= 8) {
    candidates.push({
      score: wrAll * WALL,
      labelKey: "heroAllWinRate",
      value: `${Math.round(wrAll)}%`,
      sub: { kind: "wl", wins: all.wins, losses: all.losses },
      tone: "up",
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  if (candidates.length > 0) {
    const { score, ...rest } = candidates[0]!;
    void score;
    return rest;
  }

  return {
    labelKey: "heroAllReturn",
    value:
      retAll >= 0
        ? `+${retAll.toFixed(2)}%`
        : `−${Math.abs(retAll).toFixed(2)}%`,
    sub: { kind: "amount", text: fmtUsd(pnlAll, true) },
    tone: retAll >= 0 ? "up" : "down",
  };
}

function renderHeroSub(
  hero: Hero,
  t: ReturnType<typeof tFor>,
): string {
  if (hero.sub.kind === "amount") return hero.sub.text;
  if (hero.sub.kind === "wl") return `${hero.sub.wins}W · ${hero.sub.losses}L`;
  // returnPct
  const pct = hero.sub.pct;
  const sign = pct >= 0 ? "+" : "−";
  return `${sign}${Math.abs(pct).toFixed(2)}%${t("subOfReturn")}`;
}

// Static TTF URLs. satori (next/og) cannot parse WOFF2 (no brotli
// decoder bundled), and Google Fonts CSS2 serves WOFF2 to modern
// user-agents. Pulling raw TTFs from upstream repos is the simplest
// reliable path. Cached aggressively by Next's fetch.
//
// Latin fonts cover EN/TR/ES/PT/RU/VI/ID. CJK glyphs fall through to
// satori's built-in Noto Sans CJK fallback (works for ZH/KO out of
// the box). Arabic needs an explicit font — JetBrains Mono and the
// satori fallback both lack Arabic glyphs and the route 502s without
// it. We lazy-load Arabic only for `lang=ar` to avoid pulling ~400KB
// for every render.
const FONT_URLS = {
  archivo:
    "https://github.com/google/fonts/raw/main/ofl/archivoblack/ArchivoBlack-Regular.ttf",
  monoBold:
    "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Bold.ttf",
  monoMedium:
    "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Medium.ttf",
  // Tajawal — static-instance Arabic + Latin font. Variable Noto
  // Arabic (with [wght] axis) was rejected by satori with
  // "Cannot read properties of undefined (reading '256')" — the
  // opentype.js parser doesn't handle the variable-font tables.
  arabicDisplay:
    "https://github.com/google/fonts/raw/main/ofl/tajawal/Tajawal-Black.ttf",
  arabicBody:
    "https://github.com/google/fonts/raw/main/ofl/tajawal/Tajawal-Bold.ttf",
} as const;

async function loadFont(url: string): Promise<ArrayBuffer> {
  // Long-lived cache — font binaries are immutable per URL. Without
  // this, every render hits GitHub's raw-content servers and the route
  // becomes hostage to their tail-latency / occasional 5xx, which was
  // crashing the Node runtime and producing 502s when the cache
  // window from a previous render expired.
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!res.ok) throw new Error(`Font fetch failed ${url} (${res.status})`);
  return res.arrayBuffer();
}

/**
 * Fetch the trader's avatar with a hard timeout and return it as a
 * data URL the way satori expects. Any failure (timeout, network,
 * non-image, oversized) returns null so the card falls back to the
 * Monogram letter — instead of letting satori's internal fetch fail
 * mid-render and crash the Node runtime (which surfaces as a Railway
 * 502 with no useful body).
 */
async function preloadAvatar(url: string | null): Promise<string | null> {
  if (!url) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength > 2_000_000) return null; // 2MB ceiling
    const b64 = Buffer.from(buf).toString("base64");
    return `data:${ct};base64,${b64}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ name: string; format: string }> },
): Promise<Response> {
  const { name, format } = await ctx.params;
  if (!(format in FORMATS)) {
    return new Response("Bad format", { status: 400 });
  }
  const f = format as Format;
  const decoded = decodeURIComponent(name);
  const url = new URL(req.url);
  const locale: Locale = resolveLocale(url.searchParams.get("lang") ?? "en");
  const t = tFor(locale);

  let detail: TraderDetail | null = null;
  try {
    detail = await fetchTraderDetail(decoded);
  } catch {
    detail = null;
  }
  if (!detail) return new Response("Not found", { status: 404 });

  const fontJobs: Array<Promise<ArrayBuffer>> = [
    loadFont(FONT_URLS.archivo),
    loadFont(FONT_URLS.monoBold),
    loadFont(FONT_URLS.monoMedium),
  ];
  if (locale === "ar") {
    fontJobs.push(
      loadFont(FONT_URLS.arabicDisplay),
      loadFont(FONT_URLS.arabicBody),
    );
  }

  let archivo900: ArrayBuffer | undefined,
    mono700: ArrayBuffer | undefined,
    mono500: ArrayBuffer | undefined,
    arDisplay: ArrayBuffer | undefined,
    arBody: ArrayBuffer | undefined;
  try {
    const fontBuffers = await Promise.all(fontJobs);
    [archivo900, mono700, mono500, arDisplay, arBody] = fontBuffers;
  } catch (err) {
    return new Response(
      `Font load failed: ${err instanceof Error ? err.message : String(err)}`,
      { status: 500, headers: { "content-type": "text/plain" } },
    );
  }

  // Avatar embed — pre-fetch the trader's profile picture as a data
  // URL so satori never has to make a network call mid-render. The
  // earlier 502 cascade was rooted in resvg-wasm's heap corruption
  // bug; native @resvg/resvg-js (Rust addon) is unaffected, so we
  // can ship real avatars again. Failures fall back to <Monogram>.
  const avatarDataUrl: string | null = await preloadAvatar(
    detail.trader.image,
  );

  const hero = pickHero(detail);
  const traderName = fullName(detail.trader);
  const refCode = detail.trader.referral_code ?? "";
  const { width, height } = FORMATS[f];

  const cardProps: CardProps = {
    name: traderName,
    ref_code: refCode,
    hero,
    avatar: avatarDataUrl,
    t,
  };
  const node =
    f === "story" ? (
      <StoryCard {...cardProps} />
    ) : f === "square" ? (
      <SquareCard {...cardProps} />
    ) : (
      <TwitterCard {...cardProps} />
    );

  // Order matters in satori: glyph lookup walks fonts top-to-bottom.
  // For AR, register Arabic-supporting fonts under the SAME family
  // names that the JSX uses (Archivo / JetBrains Mono) so glyphs not
  // present in the Latin TTFs fall through. Saving size by lazy-load
  // (only when locale=='ar').
  const fonts: Array<{
    name: string;
    data: ArrayBuffer;
    weight: 400 | 500 | 600 | 700 | 800 | 900;
    style: "normal";
  }> = [
    { name: "Archivo", data: archivo900!, weight: 900, style: "normal" },
    { name: "JetBrains Mono", data: mono700!, weight: 700, style: "normal" },
    { name: "JetBrains Mono", data: mono500!, weight: 500, style: "normal" },
  ];
  if (arDisplay && arBody) {
    fonts.push(
      { name: "Archivo", data: arDisplay, weight: 900, style: "normal" },
      { name: "JetBrains Mono", data: arBody, weight: 700, style: "normal" },
      { name: "JetBrains Mono", data: arBody, weight: 500, style: "normal" },
    );
  }

  try {
    // Step 1: satori turns the React tree into an SVG string. This
    // call is pure JS (no wasm), so it's stable across many renders.
    const svg = await satori(node, { width, height, fonts });
    // Step 2: native Resvg rasterises the SVG to PNG. Rust addon, no
    // wasm heap to corrupt — fixes the 'memory access out of bounds'
    // panic that next/og's bundled resvg-wasm hits after ~N renders.
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: width },
    });
    // `asPng()` returns Node's `Buffer<ArrayBufferLike>` and the
    // current TS lib types reject that (and `Uint8Array<ArrayBufferLike>`)
    // as a `BodyInit` argument to `new Response(...)` — BodyInit only
    // accepts `BufferSource` whose ArrayBuffer-typed views are plain
    // `ArrayBuffer`, not `ArrayBufferLike`. `.buffer.slice(...)`
    // copies the bytes into a fresh, plain `ArrayBuffer` that
    // satisfies both the type system and the runtime contract.
    const pngBuf = resvg.render().asPng();
    const pngBytes = pngBuf.buffer.slice(
      pngBuf.byteOffset,
      pngBuf.byteOffset + pngBuf.byteLength,
    ) as ArrayBuffer;
    return new Response(pngBytes, {
      status: 200,
      headers: {
        "content-type": "image/png",
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    return new Response(
      `Render failed: ${err instanceof Error ? err.message : String(err)}`,
      { status: 500, headers: { "content-type": "text/plain" } },
    );
  }
}

interface CardProps {
  name: string;
  ref_code: string;
  hero: Hero;
  avatar: string | null;
  t: ReturnType<typeof tFor>;
}

// ─── Twitter / X / Facebook 1200×675 ──────────────────────────────
function TwitterCard({ name, ref_code, hero, avatar, t }: CardProps) {
  const heroColor = hero.tone === "up" ? TOKENS.pos : TOKENS.neg;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: TOKENS.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: "JetBrains Mono",
        color: TOKENS.ink,
        position: "relative",
      }}
    >
      {/* radial glow accent */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${TOKENS.acid}33 0%, transparent 60%)`,
          display: "flex",
        }}
      />
      {/* top strip */}
      <div
        style={{
          padding: "32px 56px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: 32,
            letterSpacing: "-0.02em",
            color: TOKENS.ink,
          }}
        >
          BOTTOMUP
        </div>
        <div
          style={{
            fontSize: 14,
            color: TOKENS.ink3,
            letterSpacing: "0.18em",
            fontWeight: 700,
          }}
        >
          {`// ${t("analystCard")}`}
        </div>
      </div>

      {/* main body */}
      <div
        style={{
          flex: 1,
          padding: "20px 56px 0",
          display: "flex",
          alignItems: "center",
          gap: 48,
        }}
      >
        {/* left: trader */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt=""
                width={88}
                height={88}
                style={{
                  width: 88,
                  height: 88,
                  border: `2px solid ${TOKENS.line2}`,
                  objectFit: "cover",
                }}
              />
            ) : (
              <Monogram letter={name[0]?.toUpperCase() ?? "?"} size={88} />
            )}
            <div
              style={{
                fontFamily: "Archivo",
                fontWeight: 900,
                fontSize: 72,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: TOKENS.ink,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {name}
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              color: TOKENS.ink3,
              letterSpacing: "0.18em",
              fontWeight: 700,
              marginTop: 4,
              display: "flex",
            }}
          >
            {t("virtualTrackRecord")}
          </div>
        </div>
        {/* right: hero stat */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
            border: `2px solid ${heroColor}`,
            padding: "24px 32px",
            background: `${TOKENS.bg2}`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.2em",
              color: TOKENS.ink3,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {t(hero.labelKey)}
          </div>
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 900,
              fontSize: 96,
              lineHeight: 0.95,
              color: heroColor,
              letterSpacing: "-0.04em",
              display: "flex",
            }}
          >
            {hero.value}
          </div>
          <div
            style={{
              fontSize: 14,
              color: TOKENS.ink2,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {renderHeroSub(hero, t)}
          </div>
        </div>
      </div>

      {/* bottom: ref code strip */}
      <div
        style={{
          marginTop: 24,
          marginLeft: 56,
          marginRight: 56,
          marginBottom: 40,
          border: `2px solid ${TOKENS.acid}`,
          background: TOKENS.bg,
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: TOKENS.acid,
            color: TOKENS.bg,
            padding: "20px 28px",
            fontFamily: "JetBrains Mono",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.18em",
            display: "flex",
            alignItems: "center",
          }}
        >
          {t("refCode")}
        </div>
        <div
          style={{
            padding: "16px 28px",
            fontFamily: "JetBrains Mono",
            fontWeight: 700,
            fontSize: 36,
            color: TOKENS.acid,
            letterSpacing: "0.04em",
            flex: 1,
            display: "flex",
            alignItems: "center",
            textTransform: "uppercase",
          }}
        >
          {ref_code || "—"}
        </div>
        <div
          style={{
            padding: "12px 24px",
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: 28,
            color: TOKENS.acid,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            borderLeft: `2px solid ${TOKENS.acid}`,
            background: `${TOKENS.acid}14`,
          }}
        >
          {t("discountBadge")}
        </div>
      </div>
    </div>
  );
}

// ─── Instagram square 1080×1080 ───────────────────────────────────
function SquareCard({ name, ref_code, hero, avatar, t }: CardProps) {
  const heroColor = hero.tone === "up" ? TOKENS.pos : TOKENS.neg;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: TOKENS.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: "JetBrains Mono",
        color: TOKENS.ink,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -300,
          right: -300,
          width: 800,
          height: 800,
          background: `radial-gradient(circle, ${TOKENS.acid}33 0%, transparent 60%)`,
          display: "flex",
        }}
      />
      {/* top */}
      <div
        style={{
          padding: "56px 64px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: 40,
            letterSpacing: "-0.02em",
            color: TOKENS.ink,
          }}
        >
          BOTTOMUP
        </div>
        <div
          style={{
            fontSize: 16,
            color: TOKENS.ink3,
            letterSpacing: "0.2em",
            fontWeight: 700,
          }}
        >
          // ANALYST
        </div>
      </div>

      {/* trader identity */}
      <div
        style={{
          padding: "60px 64px 0",
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            width={120}
            height={120}
            style={{
              width: 120,
              height: 120,
              border: `3px solid ${TOKENS.line2}`,
              objectFit: "cover",
            }}
          />
        ) : (
          <Monogram letter={name[0]?.toUpperCase() ?? "?"} size={120} />
        )}
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: 110,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            color: TOKENS.ink,
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {name}
        </div>
      </div>

      {/* hero stat */}
      <div
        style={{
          flex: 1,
          padding: "0 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            border: `3px solid ${heroColor}`,
            padding: "44px 56px",
            background: TOKENS.bg2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              color: TOKENS.ink3,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {t(hero.labelKey)}
          </div>
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 900,
              fontSize: 200,
              lineHeight: 0.92,
              color: heroColor,
              letterSpacing: "-0.05em",
              display: "flex",
            }}
          >
            {hero.value}
          </div>
          <div
            style={{
              fontSize: 22,
              color: TOKENS.ink2,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {renderHeroSub(hero, t)}
          </div>
        </div>
      </div>

      {/* ref code + cta */}
      <div
        style={{
          padding: "0 64px 56px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            border: `3px solid ${TOKENS.acid}`,
            background: TOKENS.bg,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: TOKENS.acid,
              color: TOKENS.bg,
              padding: "22px 32px",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.18em",
              display: "flex",
              alignItems: "center",
            }}
          >
            {t("refCode")}
          </div>
          <div
            style={{
              padding: "18px 32px",
              fontWeight: 700,
              fontSize: 56,
              color: TOKENS.acid,
              letterSpacing: "0.04em",
              flex: 1,
              display: "flex",
              alignItems: "center",
              textTransform: "uppercase",
            }}
          >
            {ref_code || "—"}
          </div>
        </div>
        <div
          style={{
            border: `3px solid ${TOKENS.acid}`,
            background: TOKENS.acid,
            color: TOKENS.bg,
            padding: "20px 28px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: 38,
            letterSpacing: "-0.02em",
          }}
        >
          {t("discountBadge")}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            color: TOKENS.ink2,
            fontWeight: 500,
            letterSpacing: "0.14em",
          }}
        >
          <div style={{ display: "flex" }}>{t("useAtSignupAutoFollowed")}</div>
          <div style={{ display: "flex" }}>BOTTOMUP.APP</div>
        </div>
      </div>
    </div>
  );
}

// ─── Story / TikTok 1080×1920 ─────────────────────────────────────
function StoryCard({ name, ref_code, hero, avatar, t }: CardProps) {
  const heroColor = hero.tone === "up" ? TOKENS.pos : TOKENS.neg;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: TOKENS.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: "JetBrains Mono",
        color: TOKENS.ink,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -300,
          left: "50%",
          marginLeft: -500,
          width: 1000,
          height: 1000,
          background: `radial-gradient(circle, ${TOKENS.acid}33 0%, transparent 60%)`,
          display: "flex",
        }}
      />

      {/* top strip */}
      <div
        style={{
          padding: "100px 64px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: 44,
            letterSpacing: "-0.02em",
            color: TOKENS.ink,
          }}
        >
          BOTTOMUP
        </div>
        <div
          style={{
            fontSize: 18,
            color: TOKENS.ink3,
            letterSpacing: "0.22em",
            fontWeight: 700,
          }}
        >
          {`// ${t("analystCard")}`}
        </div>
      </div>

      {/* trader identity */}
      <div
        style={{
          padding: "100px 64px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            width={180}
            height={180}
            style={{
              width: 180,
              height: 180,
              border: `4px solid ${TOKENS.line2}`,
              objectFit: "cover",
            }}
          />
        ) : (
          <Monogram letter={name[0]?.toUpperCase() ?? "?"} size={180} />
        )}
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: 140,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            color: TOKENS.ink,
            textAlign: "center",
            display: "flex",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 18,
            color: TOKENS.ink3,
            letterSpacing: "0.22em",
            fontWeight: 700,
            display: "flex",
          }}
        >
          {t("virtualTrackRecord")}
        </div>
      </div>

      {/* hero stat */}
      <div
        style={{
          flex: 1,
          padding: "60px 64px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            border: `4px solid ${heroColor}`,
            padding: "60px 56px",
            background: TOKENS.bg2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.22em",
              color: TOKENS.ink3,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {t(hero.labelKey)}
          </div>
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 900,
              fontSize: 180,
              lineHeight: 0.95,
              color: heroColor,
              letterSpacing: "-0.04em",
              display: "flex",
            }}
          >
            {hero.value}
          </div>
          <div
            style={{
              fontSize: 28,
              color: TOKENS.ink2,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {renderHeroSub(hero, t)}
          </div>
        </div>
      </div>

      {/* ref code */}
      <div
        style={{
          padding: "0 64px 100px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            border: `4px solid ${TOKENS.acid}`,
            background: TOKENS.bg,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: TOKENS.acid,
              color: TOKENS.bg,
              padding: "20px 32px",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.2em",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {t("refCodeUseAtSignup")}
          </div>
          <div
            style={{
              padding: "32px 32px 36px",
              fontWeight: 700,
              fontSize: 88,
              color: TOKENS.acid,
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          >
            {ref_code || "—"}
          </div>
        </div>
        <div
          style={{
            border: `4px solid ${TOKENS.acid}`,
            background: TOKENS.acid,
            color: TOKENS.bg,
            padding: "26px 32px",
            fontFamily: "Archivo",
            fontWeight: 900,
            fontSize: 56,
            letterSpacing: "-0.03em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {t("discountBadge")}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 22,
            color: TOKENS.ink2,
            fontWeight: 500,
            letterSpacing: "0.18em",
            marginTop: 6,
          }}
        >
          {`BOTTOMUP.APP / ANALYST / ${name.toUpperCase()}`}
        </div>
      </div>
    </div>
  );
}

function Monogram({ letter, size }: { letter: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: TOKENS.bg3,
        border: `2px solid ${TOKENS.line2}`,
        color: TOKENS.acid,
        fontFamily: "Archivo",
        fontWeight: 900,
        fontSize: size * 0.55,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "-0.04em",
      }}
    >
      {letter}
    </div>
  );
}
