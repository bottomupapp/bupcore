# bupcore lab

bottomup.app'in lab sayfaları. Sayfalar önce `work.bupcore.ai` üzerinde yayınlanır, beğenilince bir Cloudflare Worker route'u ile `bottomup.app` altında görünür hale gelir (adres çubuğu bottomup.app'te kalır).

| Sayfa | Ne |
|---|---|
| `/analyst`, `/analyst/[isim]` | Trader dizini ve detay sayfası (canlı veri, referral kodu, OG görseli) |
| `/gbah126` | Seed investor brief |
| `/vision2027` | Series A brief (İngilizce) |
| `/okx-closed-session` | OKX kapalı oturum sunumu (Türkçe) |

Kök adres (`/`) `www.bottomup.app`'e yönlenir. `/api/health` Railway healthcheck'idir.

## Dokümanlar

- [`docs/DEPLOY.md`](docs/DEPLOY.md): Railway kurulumu, yeni lab sayfası ekleme ve sayfayı bottomup.app'e alma
- [`docs/ANALYST.md`](docs/ANALYST.md): `/analyst` zinciri (CF Worker → bu uygulama → production API'nin public endpoint'leri), CTA politikası
- [`docs/DESIGN.md`](docs/DESIGN.md): lab sayfaları için BottomUP marka rehberi
- [`cloudflare/`](cloudflare/): `bottomup-analyst-proxy` worker'ı ve route listesi

## Yapı

```
app/
  analyst/            trader dizini + detay, v2/ altında bileşenler
  gbah126/            seed brief
  vision2027/         Series A brief
  okx-closed-session/ OKX sunumu
  api/health/         healthcheck
  page.tsx            → www.bottomup.app
lib/
  bottomup-api.ts     production API public endpoint istemcisi
  use-analyst-live.ts canlı veri hook'u
cloudflare/           bottomup.app → bu uygulama proxy worker'ları
```

## Yerel geliştirme

```bash
npm install --legacy-peer-deps
npm run dev            # http://localhost:3000/analyst
```

Ortam değişkeni gerekmez. `/analyst` verisi `https://api.bottomup.app` adresinden (`lib/bottomup-api.ts`), canlı güncellemeler `wss://bottomupws-production.up.railway.app` websocket'inden gelir (`NEXT_PUBLIC_BOTTOMUP_WS_URL` ile değiştirilebilir).

## Geçmiş

Repo başlangıçta "Studio" adında bir ekip planlama aracı (ideation board, sprint, epic/task, ses → PRD) olarak kuruldu. Studio Ekim 2026'da kaldırıldı; Railway'deki Postgres veritabanı verisiyle birlikte şimdilik yerinde duruyor ama uygulama artık ona bağlanmıyor. Studio kodu git geçmişinde `638e14f` ve öncesinde.
