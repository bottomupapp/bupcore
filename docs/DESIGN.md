# BottomUP Analyst — Design System

Source of truth for the lab pages served at `bottomup.app/analyst*`. Mirrors the dark, premium tone of the marketing site at `www.bottomup.app/`. Use this doc as design context when iterating in Claude Design.

## Brand

- Product name: **BottomUP** (no space, capital U+P)
- Slogan: **"The App Store of Smart Money."**
- Tone: financial, premium, AI-forward, dark-first.
- Logo wordmark (cross-origin): `https://www.bottomup.app/_next/image?url=%2Flogos%2Flogotype-color-light.png&w=256&q=75`
- Logo mark only (64×64): `https://www.bottomup.app/_next/image?url=%2Flogos%2Flogomark-color.png&w=64&q=75`
- The logomark is a colorful 4-segment "B"-like glyph (orange/yellow/green/violet quadrants) — never recolor it.

## Audience CTAs

The only call-to-action is to install the mobile app. **Never link to bottomup.app/web.** Use these URLs:
- App Store: `https://apps.apple.com/tr/app/bottomup-sofi-trade-finance/id1661474993`
- Google Play: `https://play.google.com/store/apps/details?id=com.bottomup.bottomupapp`

A trader's `referral_code` (e.g. `awerte`, `lumex`) is the second tier CTA: every analyst card and the detail hero must show it as a copyable, prominent emerald block.

## Foundations

### Color (dark theme — only theme we ship)

| Token | Tailwind | Hex | Use |
|---|---|---|---|
| Canvas | `bg-zinc-950` | `#09090B` | Page background |
| Surface | `bg-zinc-900/60` | `#18181B` 60% | Card background |
| Surface raised | `bg-zinc-900` | `#18181B` | Card hover |
| Hairline | `border-white/10` | `rgba(255,255,255,0.10)` | Card borders, dividers |
| Hairline strong | `border-white/20` | `rgba(255,255,255,0.20)` | Hover state |
| Text primary | `text-white` / `text-zinc-100` | `#FAFAFA` | Headings, key numbers |
| Text body | `text-zinc-300` / `text-zinc-400` | — | Paragraph copy, sub-labels |
| Text muted | `text-zinc-500` | `#71717A` | Secondary hints, table cells |
| Tag pill bg | `bg-white/5` + `border-white/10` | — | "Analyst", "Smart Money" rozetleri |

### Accent

- Hero gradient (Smart Money): `bg-gradient-to-r from-orange-400 via-rose-400 to-rose-500 bg-clip-text text-transparent`. Apply to one word per page max.
- Selection: `selection:bg-orange-500/30`.
- App Store CTA: solid white pill on dark (`bg-white text-zinc-950`).
- Google Play CTA: outline pill (`bg-white/10 text-white ring-1 ring-white/15`) with an emerald-tinted play glyph.

### Performance signal

- Positive: `text-emerald-400` (number), `bg-emerald-400/10 + border-emerald-400/30` (chip)
- Negative: `text-rose-400`, `bg-rose-400/10 + border-rose-400/30`
- Warning win-rate (40–59%): `text-amber-300`, `bg-amber-400/10 + border-amber-400/30`
- Neutral / no data: `text-zinc-500`

### Typography

- Family: **Inter** (`font-family: var(--font-inter), system-ui, sans-serif`).
- Hero: `text-4xl sm:text-5xl font-bold tracking-tight`.
- Section heading: `text-xs font-semibold uppercase tracking-wider text-zinc-500`.
- Stat value: `text-xl sm:text-2xl font-bold`.
- Body: `text-sm leading-relaxed text-zinc-400`.
- Label: `text-[10px] font-semibold uppercase tracking-wider text-zinc-500`.
- Mono (referral code, tabular numbers): `font-mono`.

### Layout

- Page container: `max-w-[1400px] mx-auto px-4 md:px-8`.
- Detail container narrower: `max-w-[1200px]`.
- Vertical rhythm: section gap `mb-8`, hero gap `mb-10`.
- Card radius: `rounded-2xl`. Pill radius: `rounded-full`. Button radius: `rounded-lg`.

### Header

Sticky, translucent, hairline border:
```
sticky top-0 z-40 bg-zinc-950/85 backdrop-blur border-b border-white/5
```
Inside: logo + "Analyst" pill on the left, App Store + Google Play CTAs on the right. Mobile collapses CTAs to icon-only.

## Components

### Trader card (list)
Surface `bg-zinc-900/60` with hairline. Body:
1. Header row: 56×56 ring-avatar · name (link to detail) · followers count · win-rate badge (right).
2. KPI grid 2×2: Monthly PnL · Monthly Win Rate · Total PnL · PnL Rate.
3. **Referral CTA (full width)**: emerald-400/10 surface, label "REFERRAL CODE", code in mono UPPERCASE, copy button (emerald-500 solid).
4. "View details →" footer link (zinc-400 → white on hover).

Grid: 1 col → `sm:grid-cols-2` → `xl:grid-cols-3`.

### Trader detail hero
Single rounded-2xl card with two sections:
1. Top — 96×96 ring avatar · large display name (`text-3xl sm:text-4xl`) · bio (`text-zinc-400`) · followers chip.
2. Bottom (only if `referral_code` present) — emerald gradient strip (`from-emerald-500/10 via-zinc-900/0 to-emerald-500/10`), copy: "Follow {Name} — Use this referral code at signup on the BottomUP app to follow them on day one." with the same emerald CTA copy button.

### Stat card
Compact rounded-2xl. Label (10px caps) → big value (xl/2xl bold) → optional sub-text (xs muted). Tone bound to value sign.

### Tables (coins, recent trades)
Header row `bg-white/5`, dividers `divide-white/5`, status pills emerald/rose `bg-…/15 text-…/300`.

### Charts (pure SVG, server-rendered)
Equity area: filled area in emerald-400 (positive) or rose-400 (negative), 0.15 fill alpha + 1.75px stroke. Baseline at $10,000 dashed in `rgb(63 63 70)`.
Monthly bars: emerald/rose by sign, x labels in `rgb(113 113 122)`.

## Anti-patterns

- ❌ Light/white surfaces. Page is dark-first.
- ❌ "Open BottomUP" / "Open on bottomup.app" links — install the app instead.
- ❌ More than one gradient highlight per page.
- ❌ Per-card avatar shapes other than circle.
- ❌ Custom non-Inter fonts.
- ❌ Recoloring the BottomUP logomark.
- ❌ Showing the trader's `uid` (Firebase) anywhere in UI; use display `name`.

## Routes the design covers

- `/analyst` — analyst directory (sortable list)
- `/analyst/{name}` — single trader profile (case-insensitive name; URL is the public share link)

## What lives outside this doc

- Backend public endpoints (`/public/analysts`, `/public/trader/:name`) live on the 3.0 API; design doesn't touch them.
- The marketing landing at `www.bottomup.app/` is a separate Next.js app — borrow tone and palette but keep the analyst pages independent.
