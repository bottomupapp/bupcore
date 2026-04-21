# Cloudflare Worker — `bupcore.ai/product` routing

İki dosya:
- `worker.js` — Worker kaynak kodu. Cloudflare UI'sına kopyala-yapıştır.
- `wrangler.toml` — CLI ile deploy etmek istersen.

## UI yoluyla (önerilen, 3 dakika)

1. **Cloudflare Dashboard** → `bupcore.ai` → **Workers & Pages** → *Create → Create Worker*.
2. İsim: `bupcore-product-proxy`. *Deploy* → *Edit code*.
3. Tüm dosyayı sil, `worker.js` içeriğini yapıştır → *Deploy*.
4. Worker sayfası → *Settings → Variables and Secrets* → Add:
   - Key: `RAILWAY_ORIGIN`
   - Value: `https://<senin-servis>.up.railway.app` (Railway public domain'i)
5. *Settings → Triggers → Routes → Add route*:
   - Route: `bupcore.ai/product*`  (yıldız ÖNEMLİ — alt path'leri de yakalasın diye)
   - Zone: `bupcore.ai`
6. **DNS kontrolü**: `bupcore.ai` DNS sekmesinde bir A/AAAA kaydı olmalı ki route tetiklensin. Yoksa:
   - Type: AAAA, Name: `@`, IPv6 address: `100::`, Proxy status: **Proxied** (turuncu bulut).
   - Bu "dummy" kayıttır; Worker route zaten tüm `/product*` isteklerini üstlenir.

## Wrangler CLI ile (istersen)

```bash
cd cloudflare
npx wrangler login                                   # Cloudflare hesabına bağlan
npx wrangler secret put RAILWAY_ORIGIN               # Railway URL'ini gir
npx wrangler deploy                                  # worker.js'i yayınla
```

## Test

```bash
curl -I https://bupcore.ai/product/api/health
# → 200, { "ok": true }
```
