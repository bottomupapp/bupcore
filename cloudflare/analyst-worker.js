/**
 * Cloudflare Worker — proxies bottomup.app/analyst* to the Studio
 * Railway service that hosts the analyst directory (currently served
 * at work.bupcore.ai/analyst). The browser URL stays on bottomup.app —
 * this is a transparent reverse proxy, not a redirect.
 *
 * Setup:
 *   1. Cloudflare Dashboard → bottomup.app zone → Workers & Pages →
 *      Create Worker → name `bottomup-analyst-proxy`. Paste this file
 *      and Deploy.
 *   2. Settings → Variables → Add:
 *        STUDIO_ORIGIN = https://work.bupcore.ai
 *      (Or the underlying *.up.railway.app URL if you prefer to skip
 *      the bupcore.ai hop.)
 *   3. Routes are managed via `analyst-wrangler.toml` — `wrangler deploy`
 *      registers all of them. Current routes (zone: bottomup.app):
 *        bottomup.app/analyst*
 *        bottomup.app/okx-closed-session*
 *        www.bottomup.app/okx-closed-session*    ← worker 301s → apex
 *        bottomup.app/vision2027*
 *        www.bottomup.app/vision2027*            ← worker 301s → apex
 *        bottomup.app/_next/*
 *        bottomup.app/__nextjs/*
 *      Keep all of them in wrangler.toml — a deploy that omits them
 *      WILL silently drop the routes and the page renders unstyled.
 *   4. Apex DNS: bottomup.app currently has no A/AAAA at @, so the
 *      route would never match. Add a *proxied* dummy AAAA at @:
 *        Type: AAAA, Name: @, Content: 100::, Proxy: orange cloud.
 *   5. Disable any existing Page Rule / Bulk Redirect that maps
 *      `*.bottomup.app/analyst*` → `trade.bupcore.ai/analyst*`
 *      (or scope it to exclude this path) — Page Rules run before
 *      Worker routes and would 308 the request away.
 *
 * The same Worker can later swap STUDIO_ORIGIN to point at the prod
 * Studio domain once /analyst graduates out of the lab.
 */
// Path prefixes this worker proxies to Studio. `/analyst` is the
// public analyst directory; `/okx-closed-session` is the unindexed
// OKX partnership pitch deck. `/_next` is required so the Next.js
// build's CSS, JS chunks and image-optimization endpoint resolve
// under bottomup.app (otherwise the page renders unstyled).
// `/__nextjs` covers Next.js dev/runtime endpoints we may surface
// later.
const PROXY_PREFIXES = [
  "/analyst",
  "/okx-closed-session",
  "/vision2027",
  "/_next",
  "/__nextjs",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // If the request hit us on www.bottomup.app (the OKX pitch route
    // has a www variant), bounce to the apex so the page's /_next/*
    // assets resolve under the host that owns the Worker routes.
    // Without this, the HTML would load from www but the chunks/fonts
    // would 404/522 against the www host that has no _next route.
    // Apex serves the entire surface end-to-end.
    if (url.hostname.startsWith("www.")) {
      return Response.redirect(
        `https://bottomup.app${url.pathname}${url.search}`,
        301,
      );
    }

    // Anything not in the Studio surface gets bounced to the marketing
    // site at www.bottomup.app. Required because we added a dummy
    // proxied AAAA on the apex (so Worker routes can fire); without
    // this fallback the apex root and any other path would 522 against
    // the unreachable 100:: target.
    if (!PROXY_PREFIXES.some((p) => url.pathname.startsWith(p))) {
      return Response.redirect(
        `https://www.bottomup.app${url.pathname}${url.search}`,
        301,
      );
    }
    if (!env.STUDIO_ORIGIN) {
      return new Response(
        "STUDIO_ORIGIN env not set. Worker → Settings → Variables.",
        { status: 500 },
      );
    }

    const target = new URL(url.pathname + url.search, env.STUDIO_ORIGIN);

    const upstreamHeaders = new Headers(request.headers);
    upstreamHeaders.set("host", new URL(env.STUDIO_ORIGIN).host);
    upstreamHeaders.set("x-forwarded-host", "bottomup.app");
    upstreamHeaders.set("x-forwarded-proto", "https");

    const upstream = new Request(target.toString(), {
      method: request.method,
      headers: upstreamHeaders,
      body: request.body,
      redirect: "manual",
    });

    const response = await fetch(upstream);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
