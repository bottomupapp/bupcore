/**
 * Cloudflare Worker — bupcore.ai/product/* trafiğini Railway origin'ine proxy'ler.
 *
 * Kurulum:
 * 1. Cloudflare Dashboard → Workers & Pages → Create Worker ("bupcore-product-proxy")
 * 2. Bu dosyanın içeriğini yapıştır, Deploy
 * 3. Settings → Variables → Add:
 *      RAILWAY_ORIGIN = https://<senin-servis>.up.railway.app
 * 4. Triggers → Routes → Add route:
 *      Route:   bupcore.ai/product*
 *      Zone:    bupcore.ai
 * 5. bupcore.ai zone'unda DNS'de en az bir A/AAAA kaydı olmalı ki route eşleşsin.
 *    (Boşsa: dummy AAAA "100::" proxied ekle; ya da apex'i bir yere yönlendiren
 *     mevcut kaydı bırak.)
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/product")) {
      return new Response("Not found", { status: 404 });
    }
    if (!env.RAILWAY_ORIGIN) {
      return new Response(
        "RAILWAY_ORIGIN env set edilmemiş. Worker Settings → Variables.",
        { status: 500 },
      );
    }

    // Hedef Railway URL'i — path OLDUĞU GİBİ (Next.js basePath="/product" bekliyor).
    const target = new URL(url.pathname + url.search, env.RAILWAY_ORIGIN);

    // Host header'ı Railway origin domain'ine çevir ki NextAuth vb. doğru resolve etsin.
    const upstreamHeaders = new Headers(request.headers);
    upstreamHeaders.set("host", new URL(env.RAILWAY_ORIGIN).host);
    // Orijinal domain'i de beraber gönder (uygulama bilmek isterse):
    upstreamHeaders.set("x-forwarded-host", "bupcore.ai");
    upstreamHeaders.set("x-forwarded-proto", "https");

    const upstream = new Request(target.toString(), {
      method: request.method,
      headers: upstreamHeaders,
      body: request.body,
      redirect: "manual",
    });

    const response = await fetch(upstream);

    // set-cookie'leri olduğu gibi geçir (NextAuth çerezleri için önemli)
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
