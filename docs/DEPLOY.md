# Deploy ve lab → bottomup.app akışı

Bu repo bottomup.app'in **lab sayfalarını** barındırır (`/analyst`, `/gbah126`, `/vision2027`, `/okx-closed-session`). Sayfalar önce `work.bupcore.ai` üzerinde denenir, beğenilince bir Cloudflare Worker route'u ile `bottomup.app` altında yayına alınır.

## Şu anki kurulum

| Parça | Nerede |
|---|---|
| Uygulama | Railway projesi `bupcore`, servis `bupcore-app` |
| Kaynak | `bottomupapp/bupcore`, branch `main`. Push'ta otomatik deploy |
| Build | `Dockerfile` (`railway.json`), healthcheck `/api/health` |
| Domain | `work.bupcore.ai` (+ `bupcore-app-production.up.railway.app`). Kök adres `www.bottomup.app`'e yönlenir |
| Veri | `api.bottomup.app` public endpoint'leri + `bottomupws-production` websocket'i |
| Veritabanı | Yok. Projedeki Postgres eski Studio'dan kalma, uygulama bağlanmıyor |
| bottomup.app köprüsü | Cloudflare Worker `bottomup-analyst-proxy` ([`cloudflare/analyst-worker.js`](../cloudflare/analyst-worker.js), [`analyst-wrangler.toml`](../cloudflare/analyst-wrangler.toml)) |

Uygulama hiçbir env değişkeni gerektirmez. Railway'de duran `AUTH_*`, `GOOGLE_*`, `ANTHROPIC_*`, `DATABASE_URL`, `BUILD_DATABASE_URL` eski Studio'dan kalma ve artık kullanılmıyor.

## Yeni lab sayfası ekleme

1. `app/<sayfa>/page.tsx` (ve gerekirse `layout.tsx`, `styles.css`) oluştur. Görsel dil için [`DESIGN.md`](DESIGN.md).
2. `main`'e push et. Railway build alır, sayfa `https://work.bupcore.ai/<sayfa>` adresinde açılır.
3. Orada gözden geçir, gerekirse iterasyon yap.

## Sayfayı bottomup.app'e alma

1. `cloudflare/analyst-worker.js` içindeki `PROXY_PREFIXES` listesine `"/<sayfa>"` ekle.
2. `cloudflare/analyst-wrangler.toml` içindeki `routes` listesine şunları ekle:
   ```toml
   { pattern = "bottomup.app/<sayfa>*", zone_name = "bottomup.app" },
   { pattern = "www.bottomup.app/<sayfa>*", zone_name = "bottomup.app" },
   ```
3. Deploy:
   ```bash
   npx wrangler deploy --config cloudflare/analyst-wrangler.toml
   ```
4. `https://bottomup.app/<sayfa>` adresini kontrol et. Sayfa stilsiz gelirse `/_next/*` ve `/__nextjs/*` route'larının wrangler dosyasında durduğundan emin ol.

Route listesindeki hiçbir satırı silme: `wrangler deploy` dosyada olmayan route'ları kaldırır, catch-all (`bottomup.app/*`) giderse apex adresler 522 verir.

## Geçmiş

İlk kurulum `bupcore.ai/product` altında, `keen-learning` Railway projesinde planlanmıştı (`bupcore-product-proxy` worker'ı, [`cloudflare/worker.js`](../cloudflare/worker.js)). Uygulama sonra kendi domain'ine (`work.bupcore.ai`) taşındı; o dönemin adım adım kurulum notları bu dosyayla değiştirildi. Ekim 2026'da Studio aracı kaldırıldı, repo sadece lab sayfalarına indi.
