# Cloudflare Workers

Two proxy workers in this folder:

| Worker | Source | Route | Origin (env) |
|---|---|---|---|
| `bupcore-product-proxy` | [worker.js](worker.js), [wrangler.toml](wrangler.toml) | `bupcore.ai/product*` | `RAILWAY_ORIGIN` |
| `bottomup-analyst-proxy` | [analyst-worker.js](analyst-worker.js), [analyst-wrangler.toml](analyst-wrangler.toml) | `bottomup.app/analyst*` | `STUDIO_ORIGIN` (= `https://work.bupcore.ai`) |

The analyst worker forwards `bottomup.app/analyst*` requests to the Studio app (currently lab-served at `work.bupcore.ai/analyst`). The browser URL stays on `bottomup.app` — transparent reverse proxy, no redirect. Setup steps + the existing `*/analyst` redirect that needs to be disabled are documented at the top of [analyst-worker.js](analyst-worker.js).

---

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
