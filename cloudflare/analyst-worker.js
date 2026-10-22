/**
 * Cloudflare Worker for the bare name bottomup.app (worker name `bottomup-analyst-proxy`).
 *
 * bottomup.app has only a proxied dummy AAAA (100::) at @, so this Worker answers every request to
 * it and sends the visitor to the same path on www.bottomup.app, where the website runs (Render).
 *
 * Until 22 October 2026 it also proxied /analyst, /okx-closed-session, /vision2027 and /gbah126 to
 * the lab pages on work.bupcore.ai (Railway project "bupcore"). Those pages were retired with
 * Railway after its 21 October security incident, so every path now goes to www.
 *
 * Routes are in analyst-wrangler.toml: only the apex catch-all. A www route must never point here:
 * www is the website itself, so a redirect from www would loop.
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Safety net: if a www route is ever attached to this Worker, pass the request through
    // to the website instead of redirecting it to itself.
    if (url.hostname !== "bottomup.app") return fetch(request);
    return Response.redirect(`https://www.bottomup.app${url.pathname}${url.search}`, 301);
  },
};
