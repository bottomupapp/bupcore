# Railway + Cloudflare Deploy — `bupcore.ai/product`

Ürün `bupcore.ai/product` altında servis edilecek. İki taraflı çalışır:

- **Railway** uygulamayı bir public URL ile host eder (ör. `studio-production.up.railway.app`). Next.js `basePath: "/product"` ile çalışır, yani Railway domain'inden bile `*.railway.app/product` olarak açılır.
- **Cloudflare** `bupcore.ai/product/*` trafiğini bu Railway origin'ine proxy'ler. Böylece kullanıcı `bupcore.ai` üzerinde kalır.

---

## 1) Railway tarafı

### 1.a) PostgreSQL plugin
Railway projene (link'i verdiğin: `afdaef2b-1c4c-4882-b990-cba267055ccd`) git:
1. *New* → *Database* → *PostgreSQL*.
2. Oluştuğunda Railway otomatik olarak Postgres servisini hazırlar.

### 1.b) Uygulama servisi
1. *New* → *GitHub Repo* → bu `studio/` klasörünü push ettiğin repo'yu seç.
2. Railway `railway.json`'u okur; build komutu:
   ```
   npm install && npx prisma generate && (npx prisma migrate deploy || npx prisma db push --accept-data-loss) && next build
   ```

### 1.c) Environment variables (Service → Variables)

| Değişken | Değer |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `NEXT_PUBLIC_BASE_PATH` | `/product` |
| `AUTH_URL` | `https://bupcore.ai/product` |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_SECRET` | `openssl rand -base64 32` çıktısı |
| `GOOGLE_CLIENT_ID` | Google Cloud Console'dan |
| `GOOGLE_CLIENT_SECRET` | ↑ ile birlikte |
| `RESEND_API_KEY` | resend.com |
| `EMAIL_FROM` | `Bupcore <noreply@bupcore.ai>` |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-5` (opsiyonel) |

> `NEXT_PUBLIC_*` değişkenleri **build anında** bakılır. Değiştirdikten sonra *Deploy* tetikleneceği için endişelenme.

### 1.d) Public domain
Railway servisi sekmesinde *Settings → Networking → Generate Domain* ile bir public URL oluştur. Örn: `studio-production-abc1.up.railway.app`. Bu URL Cloudflare'e origin olarak girilecek.

---

## 2) Google OAuth

https://console.cloud.google.com/apis/credentials

*Create Credentials → OAuth 2.0 Client → Web application*

**Authorized redirect URIs:**
- `https://bupcore.ai/product/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (lokal dev için; lokal dev'de `NEXT_PUBLIC_BASE_PATH=""` yap ve `AUTH_URL=http://localhost:3000`)

Client ID + secret'ı Railway Variables'a yapıştır.

---

## 3) Cloudflare tarafı — `bupcore.ai/product` → Railway

Cloudflare alt-yol (sub-path) routing için **3 seçenek** var. En kolayından başlıyoruz.

### Seçenek A — Cloudflare Worker (önerilen, en esnek)

`bupcore.ai/product/*` isteklerini Railway origin'ine proxy'ler.

1. Cloudflare dashboard → `bupcore.ai` zone'u → *Workers & Pages* → *Create Worker*.
2. Worker adı: `bupcore-product-proxy`. İçeriği:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Yalnızca /product ile başlayanları ele al
    if (!url.pathname.startsWith("/product")) {
      return new Response("Not found", { status: 404 });
    }

    // Railway origin'e hedefle (path'i OLDUĞU GİBİ bırak — Next.js basePath
    // "/product" beklediğinden hedef URL de /product'lı kalmalı).
    const target = new URL(url.pathname + url.search, env.RAILWAY_ORIGIN);

    const proxied = new Request(target.toString(), request);
    proxied.headers.set("host", new URL(env.RAILWAY_ORIGIN).host);

    return fetch(proxied, { redirect: "manual" });
  },
};
```

3. Worker *Settings → Variables*:
   - `RAILWAY_ORIGIN` = `https://studio-production-abc1.up.railway.app` (senin Railway domain'in)

4. Worker *Triggers → Routes → Add route*:
   - Route: `bupcore.ai/product*`
   - Zone: `bupcore.ai`

5. DNS:
   - `bupcore.ai` zone'unda A veya AAAA kaydı olmalı ki route tetiklensin. Boşsa geçici olarak `100::` AAAA proxied (orange cloud) ekleyebilirsin — Cloudflare "dummy" kaydı olarak bunu kabul eder. Ya da Cloudflare Pages/başka bir kaynak zaten apex'te servis ediyorsa onu bırak.

### Seçenek B — Cloudflare "Origin Rules" (Enterprise / Pro özelliği)

Pro+ planda *Rules → Origin Rules* ile:
- **When incoming requests match:** `(starts_with(http.request.uri.path, "/product"))`
- **Override:** *Host Header* = `studio-production-abc1.up.railway.app`,
  *DNS Record* aynı domain'e resolve edecek şekilde ayarla.

Ama DNS orig'e CNAME olmadan çalışmaz — bu seçeneği önermiyorum, Worker daha temiz.

### Seçenek C — `product.bupcore.ai` alt alan (yol yerine)

Eğer `/product` yerine `product.bupcore.ai` kabul edilebilirse:
1. Cloudflare DNS → CNAME `product` → `studio-production-abc1.up.railway.app` (proxied ya da DNS-only).
2. Railway servisi → Settings → Networking → *Custom Domain* → `product.bupcore.ai`. Railway TLS'i otomatik yapar.
3. `NEXT_PUBLIC_BASE_PATH` ve `basePath` ayarlarını kaldır (sadece boş string).
4. `AUTH_URL=https://product.bupcore.ai`.

Bu en basit yol. `/product` path'i illa şart değilse bunu tercih et.

---

## 4) Doğrulama

- `https://bupcore.ai/product` → landing sayfası.
- `https://bupcore.ai/product/api/health` → `{"ok":true}`.
- *Giriş yap* → Google → `bupcore.ai/product/app` dashboard.
- Mikrofon izni: HTTPS gerektiği için Cloudflare Worker üzerinden gelmesi yeterli (otomatik HTTPS).

## 5) Sorun giderme

| Belirti | Sebep / Çözüm |
|---------|---------------|
| `/product` 404 | Worker route eşleşmiyor. Route pattern'i `bupcore.ai/product*` (yıldızın yerine dikkat). DNS'de en az bir A/AAAA kaydı gerekli. |
| Asset'ler 404 (`/_next/static/...`) | `basePath` + `assetPrefix` uygulanmadı. Railway build log'una bak: `NEXT_PUBLIC_BASE_PATH=/product` set edildi mi? Build cache'i temizleyip re-deploy et. |
| Login sonrası "UntrustedHost" | `AUTH_TRUST_HOST=true` ekle (Railway arkasındayız). |
| Google OAuth "redirect_uri_mismatch" | Google console'daki redirect URI tam olarak `https://bupcore.ai/product/api/auth/callback/google` olmalı. |
| Worker `525` TLS error | Railway origin'inde HTTPS beklenir. Worker içinde `fetch` target'ı `https://...up.railway.app` (http değil). |
| Yazma aksiyonu (POST) çalışıyor ama veri gelmiyor | Worker `redirect: "manual"` dediğim için 3xx'ler geçiyor. NextAuth callback'i set-cookie döner — Worker bunu olduğu gibi aktarıyor. Çerez domain'i `bupcore.ai` olmalı; NextAuth `useSecureCookies: true` otomatik (HTTPS'de). |

## 6) Prod öncesi checklist

- [ ] `AUTH_SECRET` rotasyonu
- [ ] `allowDangerousEmailAccountLinking: false` (lib/auth.ts)
- [ ] `VoiceRecording.audioBase64` → R2 / S3
- [ ] Rate-limit (`/api/voice` pahalı)
- [ ] Cloudflare Worker için **logs** (Tail) açık
- [ ] Railway Postgres backup
