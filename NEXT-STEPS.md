# Sıradaki Adımlar — Sadece Senin Yapman Gerekenler

Altyapının tamamı kuruldu. Aşağıdaki 3 adımı tamamlayınca `bupcore.ai/product` canlıya çıkar.

---

## Şu an durum

**Railway** (proje: `keen-learning`)
- ✅ PostgreSQL servisi oluşturuldu, ONLINE.
- ✅ `lovely-insight` adlı empty app servisi oluşturuldu.
- ✅ 12 environment variable yüklü:
  - `NEXT_PUBLIC_BASE_PATH=/product`
  - `AUTH_URL=https://bupcore.ai/product`
  - `AUTH_TRUST_HOST=true`
  - `AUTH_SECRET=EULvUXH1D5FK5wg4eY44YjJbQfZph1/Ul1OFDG2hSFQ=`
  - `DATABASE_URL=${{Postgres.DATABASE_URL}}` (otomatik bağlı)
  - `NODE_ENV=production`
  - `ANTHROPIC_MODEL=claude-sonnet-4-5`
  - `EMAIL_FROM=Bupcore <noreply@bupcore.ai>`
  - `ANTHROPIC_API_KEY=REPLACE_ME` ← **senin dolduracağın**
  - `GOOGLE_CLIENT_ID=REPLACE_ME` ← **senin dolduracağın**
  - `GOOGLE_CLIENT_SECRET=REPLACE_ME` ← **senin dolduracağın**
  - `RESEND_API_KEY=REPLACE_ME` ← **senin dolduracağın**
- ✅ Public domain: `lovely-insight-production-afd9.up.railway.app` (Port 3000)

**Cloudflare** (zone: `bupcore.ai`)
- ✅ Worker `bupcore-product-proxy` deploy edildi.
  - Worker.dev URL: `https://bupcore-product-proxy.deniz-ab4.workers.dev`
  - Binding: `RAILWAY_ORIGIN=https://lovely-insight-production-afd9.up.railway.app`
- ✅ Route `bupcore.ai/product*` → Worker.
- ✅ Dummy AAAA DNS kaydı (`100::` proxied) eklendi (route'un tetiklenmesi için gerekli).

---

## Adım 1 — Kodu GitHub'a pushla

Bilgisayarından terminal aç, kodun bulunduğu klasöre git (`/sessions/tender-keen-mendel/mnt/outputs/studio` → bu Cowork'teki workspace klasörü, dosyaları indir veya path'i doğrudan kullan):

```bash
# Workspace klasörünün içinde:
git init
git add .
git commit -m "chore: initial scaffold - studio (bupcore.ai/product)"
git branch -M main

# Yeni private GitHub repo oluştur + pushla
gh repo create bupcore/studio --private --source=. --push

# Eğer gh CLI yoksa:
# 1. github.com'da yeni private repo aç: bupcore/studio
# 2. git remote add origin git@github.com:bupcore/studio.git
# 3. git push -u origin main
```

## Adım 2 — Railway servisine GitHub repo'yu bağla

1. Railway projende → `lovely-insight` servisine tıkla.
2. **Settings → Source → Connect Repo** → `bupcore/studio` seç → branch: `main`.
3. Railway otomatik olarak build'i başlatır. Build komutu zaten `railway.json`'dan alınır:
   ```
   npm install && npx prisma generate && (npx prisma migrate deploy || npx prisma db push --accept-data-loss) && next build
   ```
4. İlk deploy ~3-5 dakika sürer.

## Adım 3 — Secret değişkenlerini doldur

Railway `lovely-insight` → **Variables** → aşağıdaki 4 değeri güncelle:

| Variable | Nereden |
|----------|---------|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| `GOOGLE_CLIENT_ID` | https://console.cloud.google.com/apis/credentials (yeni OAuth 2.0 Client) |
| `GOOGLE_CLIENT_SECRET` | ↑ aynı yerden |
| `RESEND_API_KEY` | https://resend.com/api-keys |

**Google OAuth ayarları — ÖNEMLİ:**
- Application type: Web application
- **Authorized redirect URIs:**
  - `https://bupcore.ai/product/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (lokal dev için)

Değişkenler değişince Railway otomatik re-deploy eder.

## Adım 4 — Doğrula

Deploy bittikten sonra:

```bash
curl https://bupcore.ai/product/api/health
# → {"ok":true}
```

Tarayıcıda `https://bupcore.ai/product` → landing sayfası → **Giriş yap** → Google → dashboard.

---

## Sorun olursa

| Belirti | Çözüm |
|---------|-------|
| `curl` 404 "Application not found" | Railway servisi henüz deploy olmadı. Deploy loglarını Railway → `lovely-insight` → Deployments'ta kontrol et. |
| `curl` 502/503 | Railway build başarılı ama uygulama crash etti. Logs'a bak — muhtemelen DATABASE_URL ya da AUTH_SECRET hatası. |
| Login sonrası "UntrustedHost" | `AUTH_TRUST_HOST=true` ekli (eklenmiş olmalı; değilse kontrol et). |
| Google OAuth `redirect_uri_mismatch` | Adım 3'teki Authorized redirect URI yanlış yazılmış. `https://bupcore.ai/product/api/auth/callback/google` olmalı. |
| Asset'ler (`/_next/static`) 404 | Build'de `NEXT_PUBLIC_BASE_PATH=/product` set değil. Railway Variables'tan kontrol et; yoksa yeniden ekle + re-deploy. |
| `https://bupcore.ai/product` reaches Cloudflare ama proxy çalışmıyor | Worker logları: Cloudflare → Workers & Pages → bupcore-product-proxy → Observability → Logs. |

## Gelecek için prod-hardening

- [ ] `AUTH_SECRET` rotasyonu (yukarıdaki değer MVP için — prod'da tekrar üret)
- [ ] `lib/auth.ts` → `allowDangerousEmailAccountLinking: false`
- [ ] `VoiceRecording.audioBase64` → R2 / S3 (prod'da DB şişmesin)
- [ ] Rate-limit `/api/voice` (Anthropic maliyeti)
- [ ] Railway Postgres backup açık (Settings → Backups)
