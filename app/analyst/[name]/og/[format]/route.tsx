import { ImageResponse } from "next/og";
import { fetchTraderDetail, type TraderDetail } from "@/lib/bottomup-api";

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

export const runtime = "edge";

const FORMATS = {
  twitter: { width: 1200, height: 675 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
} as const;

type Format = keyof typeof FORMATS;

const TOKENS = {
  bg: "#0A0A0A",
  bg2: "#0F0F0F",
  bg3: "#1A1A1A",
  ink: "#F5F5F0",
  ink2: "#B0B0AA",
  ink3: "#6E6E68",
  line: "#1F1F1F",
  line2: "#2A2A28",
  acid: "#FF6B1A",
  warn: "#FF3B5C",
} as const;

interface Hero {
  label: string;
  value: string;
  sub: string;
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

function pickHero(detail: TraderDetail): Hero {
  const all = detail.all_time;
  const m30 = detail.stats;
  const wrAll = (all.win_rate ?? 0) * 100;
  const wr30 = (m30.win_rate ?? 0) * 100;
  const retAll = all.virtual_return_pct;
  const ret30 = m30.virtual_return_pct;
  const pnl30 = m30.total_pnl;
  const pnlAll = all.total_pnl;

  type C = Hero & { score: number };
  const candidates: C[] = [];

  if (wrAll >= 60 && all.trades >= 5) {
    candidates.push({
      score: wrAll * (1 + Math.log10(Math.max(all.trades, 1)) / 5),
      label: "ALL-TIME WIN RATE",
      value: `${Math.round(wrAll)}%`,
      sub: `${all.wins}W · ${all.losses}L · ${all.trades} trades`,
      tone: "up",
    });
  }
  if (wr30 >= 60 && m30.trades >= 3) {
    candidates.push({
      score: wr30 * 0.95,
      label: "30D WIN RATE",
      value: `${Math.round(wr30)}%`,
      sub: `${m30.wins}W · ${m30.losses}L`,
      tone: "up",
    });
  }
  if (retAll >= 20) {
    candidates.push({
      score: Math.min(retAll, 200),
      label: "ALL-TIME RETURN",
      value: `+${retAll.toFixed(2)}%`,
      sub: `${fmtUsd(pnlAll, true)} · ${all.trades} trades`,
      tone: "up",
    });
  }
  if (ret30 >= 20) {
    candidates.push({
      score: Math.min(ret30, 200) * 0.9,
      label: "30D RETURN",
      value: `+${ret30.toFixed(2)}%`,
      sub: fmtUsd(pnl30, true),
      tone: "up",
    });
  }
  if (pnl30 >= 5000) {
    candidates.push({
      score: 60 + Math.log10(pnl30) * 5,
      label: "30D NET PNL",
      value: fmtUsd(pnl30, true),
      sub: `${m30.trades} trades · ${Math.round(wr30)}% WR`,
      tone: "up",
    });
  }
  if (pnlAll >= 5000) {
    candidates.push({
      score: 55 + Math.log10(pnlAll) * 5,
      label: "ALL-TIME NET PNL",
      value: fmtUsd(pnlAll, true),
      sub: `${all.trades} trades`,
      tone: "up",
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  if (candidates.length > 0) {
    const { score, ...rest } = candidates[0]!;
    void score;
    return rest;
  }
  // Generic fallback — high-volume but not a wow stat
  return {
    label: "TOTAL TRADES",
    value: all.trades.toLocaleString("en-US"),
    sub: `${all.wins}W · ${all.losses}L`,
    tone: "up",
  };
}

// Static TTF URLs. satori (next/og) cannot parse WOFF2 (no brotli
// decoder bundled), and Google Fonts CSS2 serves WOFF2 to modern
// user-agents. Pulling raw TTFs from upstream repos is the simplest
// reliable path. Cached aggressively by Next's fetch.
const FONT_URLS = {
  archivo:
    "https://github.com/google/fonts/raw/main/ofl/archivoblack/ArchivoBlack-Regular.ttf",
  monoBold:
    "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Bold.ttf",
  monoMedium:
    "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Medium.ttf",
} as const;

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed ${url} (${res.status})`);
  return res.arrayBuffer();
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string; format: string }> },
): Promise<Response> {
  const { name, format } = await ctx.params;
  if (!(format in FORMATS)) {
    return new Response("Bad format", { status: 400 });
  }
  const f = format as Format;
  const decoded = decodeURIComponent(name);

  let detail: TraderDetail | null = null;
  try {
    detail = await fetchTraderDetail(decoded);
  } catch {
    detail = null;
  }
  if (!detail) return new Response("Not found", { status: 404 });

  const [archivo900, mono700, mono500] = await Promise.all([
    loadFont(FONT_URLS.archivo),
    loadFont(FONT_URLS.monoBold),
    loadFont(FONT_URLS.monoMedium),
  ]);

  const hero = pickHero(detail);
  const traderName = fullName(detail.trader);
  const refCode = detail.trader.referral_code ?? "";
  const { width, height } = FORMATS[f];

  const node =
    f === "story" ? (
      <StoryCard
        name={traderName}
        ref_code={refCode}
        hero={hero}
        avatar={detail.trader.image}
      />
    ) : f === "square" ? (
      <SquareCard
        name={traderName}
        ref_code={refCode}
        hero={hero}
        avatar={detail.trader.image}
      />
    ) : (
      <TwitterCard
        name={traderName}
        ref_code={refCode}
        hero={hero}
        avatar={detail.trader.image}
      />
    );

  return new ImageResponse(node, {
    width,
    height,
    fonts: [
      { name: "Archivo", data: archivo900, weight: 900, style: "normal" },
      { name: "JetBrains Mono", data: mono700, weight: 700, style: "normal" },
      { name: "JetBrains Mono", data: mono500, weight: 500, style: "normal" },
    ],
    headers: {
      "Cache-Control":
        "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

interface CardProps {
  name: string;
  ref_code: string;
  hero: Hero;
  avatar: string | null;
}

// ─── Twitter / X / Facebook 1200×675 ──────────────────────────────
function TwitterCard({ name, ref_code, hero, avatar }: CardProps) {
  const heroColor = hero.tone === "up" ? TOKENS.acid : TOKENS.warn;
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
          // ANALYST CARD
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
                fontSize: 96,
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
            VIRTUAL TRACK RECORD · BUPCORE.AI
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
            padding: "28px 36px",
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
            {hero.label}
          </div>
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 900,
              fontSize: 120,
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
            {hero.sub}
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
          REF_CODE
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
            padding: "16px 28px",
            fontFamily: "JetBrains Mono",
            fontWeight: 500,
            fontSize: 13,
            color: TOKENS.ink2,
            letterSpacing: "0.14em",
            display: "flex",
            alignItems: "center",
            borderLeft: `1px solid ${TOKENS.line2}`,
          }}
        >
          USE AT SIGNUP → BOTTOMUP.APP
        </div>
      </div>
    </div>
  );
}

// ─── Instagram square 1080×1080 ───────────────────────────────────
function SquareCard({ name, ref_code, hero, avatar }: CardProps) {
  const heroColor = hero.tone === "up" ? TOKENS.acid : TOKENS.warn;
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
            {hero.label}
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
            {hero.sub}
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
            REF_CODE
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
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            color: TOKENS.ink2,
            fontWeight: 500,
            letterSpacing: "0.14em",
          }}
        >
          <div style={{ display: "flex" }}>USE AT SIGNUP — AUTO-FOLLOWED</div>
          <div style={{ display: "flex" }}>BOTTOMUP.APP</div>
        </div>
      </div>
    </div>
  );
}

// ─── Story / TikTok 1080×1920 ─────────────────────────────────────
function StoryCard({ name, ref_code, hero, avatar }: CardProps) {
  const heroColor = hero.tone === "up" ? TOKENS.acid : TOKENS.warn;
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
          // ANALYST CARD
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
          VIRTUAL TRACK RECORD · BUPCORE.AI
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
            {hero.label}
          </div>
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 900,
              fontSize: 280,
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
              fontSize: 28,
              color: TOKENS.ink2,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {hero.sub}
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
            REF_CODE — USE AT SIGNUP
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
            display: "flex",
            justifyContent: "center",
            fontSize: 22,
            color: TOKENS.ink2,
            fontWeight: 500,
            letterSpacing: "0.18em",
            marginTop: 6,
          }}
        >
          BOTTOMUP.APP / ANALYST / {name.toUpperCase()}
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
