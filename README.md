# Studio — Ekip planlama & ürün düşünme aracı

> **Lab sayfaları runbook'u (oku, sorun yaşamadan değiştir):**
> - [`docs/ANALYST.md`](docs/ANALYST.md) — `bottomup.app/analyst` zinciri (CF Worker → Studio → 3.0 backend public endpoint'leri), CTA policy, deploy checklist
> - [`docs/DESIGN.md`](docs/DESIGN.md) — analyst sayfaları için BottomUP marka rehberi (dark theme, Smart Money gradient, App Store/Play CTA)
> - [`cloudflare/`](cloudflare/) — `bottomup.app/analyst*` ve `bupcore.ai/product` Worker'ları
> - Backend tarafı (analyst için public endpoint'ler) → karşı repo: [bottomup/docs/RAILWAY.md](https://github.com/denizbottomup/bottomup/blob/main/docs/RAILWAY.md)

Jira alternatifi, UX olarak daha hafif. Tek yerde:

- **Ideation board** — sticky note'larla fikir topla, oyla, etiketle, bir tıkla epic'e yükselt.
- **Sprint planlama** — 5 sütunlu kanban board, sürükle-bırak. Backlog → To do → Devam → Review → Tamam.
- **Epic & Task** — büyük işleri epic olarak tanımla, altına task kır. Renkli, anlaşılır.
- **Ses → PRD** — tarayıcıda kayıt al, Anthropic Claude PRD taslağını çıkarsın (problem, kullanıcı hikayeleri, gereksinimler, önerilen epic ve task'lar).
- **Medium tarzı makaleler** — Tiptap editor. Her paragraf `data-id` tutar; paragraflar epic ve task'lara bağlanabilir.
- **Makale ↔ Epic bağlama** — bir paragrafa tıklayıp epic/task ile ilişkilendir. Epic sayfasında geri-referanslar görünür.

## Teknoloji

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS (özel CSS değişkenleri, shadcn/ui benzeri primitive'ler)
- Prisma + PostgreSQL
- NextAuth v5 (Auth.js) — Google OAuth + email magic link (Resend veya SMTP)
- @dnd-kit (drag & drop)
- Tiptap (makale editörü)
- Anthropic Claude SDK (ses → PRD)

## Yerel geliştirme

```bash
# 1) Bağımlılıklar
npm install

# 2) .env dosyası oluştur
cp .env.example .env
# değerleri doldur

# 3) Postgres
# Docker ile:
docker run --name studio-pg -e POSTGRES_PASSWORD=studio -p 5432:5432 -d postgres:16
# Sonra .env'de:
# DATABASE_URL=postgresql://postgres:studio@localhost:5432/postgres

# 4) Migration + seed
npx prisma migrate dev --name init
npm run db:seed

# 5) Çalıştır
npm run dev
```

Uygulama <http://localhost:3000> adresinde açılır.

## Railway'e deploy

1. **Projeye PostgreSQL ekle** (Railway → *New* → *Database* → *PostgreSQL*). Railway, servisin ortam değişkenlerine otomatik olarak `DATABASE_URL` bağlar.
2. **GitHub repo bağla** veya `railway up` ile deploy et.
3. **Servis değişkenlerini ayarla** (Settings → Variables):
   - `AUTH_SECRET` — `openssl rand -base64 32` çıktısı
   - `AUTH_URL` — örn. `https://studio.up.railway.app` (Railway domain'iyle aynı)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google Cloud Console → OAuth 2.0
     - Yetkili yönlendirme URI'ları: `${AUTH_URL}/api/auth/callback/google`
   - `RESEND_API_KEY`, `EMAIL_FROM` — magic link e-postası için
   - `ANTHROPIC_API_KEY` — ses → PRD için (opsiyonel ama modül çalışmaz)
   - `ANTHROPIC_MODEL` — varsayılan `claude-sonnet-4-5`

4. **Build & start command'ları**
   - `railway.json` ile otomatik alınır. Build içinde `prisma migrate deploy` koşar, yani migration'lar prod DB'ye otomatik uygulanır.

5. **Healthcheck**
   - `/api/health` uç noktası `SELECT 1` ile veritabanını doğrular.

Önemli: Railway servisi ilk deploy'unda veri tabanı değişkenlerini `DATABASE_URL` adıyla vermeyebilir. Eğer `DATABASE_URL` yerine `PGHOST / PGUSER / ...` veriliyorsa, Variables ekranında şu referansı ekle:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

## Modül tanıtımı

### Ideation (`/app/ideation`)
- "Yeni fikir" → başlık, açıklama, etiket, renk.
- Her fikir üzerinde oy, durum (`NEW / REVIEWING / ACCEPTED / REJECTED`) ve **Epic** butonu.
- Epic'e yükseltme → yeni bir `Epic` oluşur, fikir `PROMOTED` olur, `promotedToEpicId` set edilir.

### Sprint board (`/app/board`)
- Üstten sprint seçimi + yeni sprint.
- 5 kolon: Backlog, To do, Devam, Review, Tamam.
- Task kartlarını kolonlar arası sürükle; `PATCH /api/tasks/:id` ile status güncellenir.
- Kolon başlığında `+` ile yeni task; epic seçebilirsin.

### Epic & Task (`/app/epics`)
- Epic listesi, durum dropdown'u, task sayısı.
- Epic detayı (`/app/epics/[id]`) → durumlara göre grup, bağlı makaleler.

### Makaleler (`/app/articles`)
- Liste görünümü + yeni makale.
- Detay (`/app/articles/[slug]`): Tiptap editörü, otomatik kayıt (1 sn debounce).
- **Her blok düğümüne kararlı bir `data-id` atanır** (nanoid 8). Bu ID `ArticleLink.blockId`'de kullanılır.
- "Bu paragrafı bağla" → modal: epic ve/veya task seç, opsiyonel etiket ver.
- Sağdaki sidebar mevcut bağlantıları gösterir.

### Ses → PRD (`/app/voice`)
- Tarayıcıda `getUserMedia` → MediaRecorder (webm).
- Kayıt durunca `POST /api/voice` ile base64 formunda Anthropic'e gönderilir.
- `voiceToPrd()` → Claude'dan yapılandırılmış JSON PRD alır (problem, hedefler, kullanıcı hikayeleri, gereksinimler, önerilen epic + task'lar, riskler, başarı metrikleri).
- Sağ panelde taslağı gör, "Makaleye dönüştür" ile:
  - PRD'den Tiptap JSON üretilir ve yeni Article oluşur.
  - Önerilen epic ve task'lar otomatik workspace'e eklenir.

> Not: Ses verisi bu MVP'de `VoiceRecording.audioBase64` kolonuna base64 olarak saklanır. Prod'da S3 / R2 / Supabase Storage'a taşımak için `lib/anthropic.ts` ve `app/api/voice/route.ts` alanlarını düzenle.

## Veri modeli (özet)

```
Workspace ─┬─ Membership ─ User
           ├─ Epic ─┬─ Task
           │       └─ ArticleLink
           ├─ Sprint ─ Task
           ├─ IdeationBoard ─ IdeationCard (promotedToEpicId?)
           ├─ Article ─┬─ ArticleLink (blockId, epicId?, taskId?, label)
           │           └─ VoiceRecording (articleId?)
           └─ VoiceRecording (prdDraft JSON)
```

## Scriptler

| Komut | Ne yapar |
|------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Prisma generate + migrate deploy + Next build |
| `npm run start` | Prod server |
| `npm run db:migrate` | Dev migration (`prisma migrate dev`) |
| `npm run db:push` | Schema'yı DB'ye zorla (migration üretmez) |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Demo workspace + epic + task |

## Güvenlik notları

- `middleware.ts` auth session kontrolü yapar; kök, landing, auth sayfaları ve `/api/auth/*` hariç her şey login gerektirir.
- API route'ları `requireWorkspace()` ile kullanıcının workspace'ini çözer; tüm CRUD bu workspace kapsamına sıkı filtrelenir.
- Google SSO'da `allowDangerousEmailAccountLinking: true` dev kolaylığı için açık; prod'da aynı email'in farklı provider'larla eşleşmesini istemiyorsan kapat.

## Yapılacaklar (v2)

- Çoklu workspace desteği (şu an kullanıcı ilk workspace'e düşer)
- Task'lara yorum akışı, atamalar UI'ı
- Tiptap mention extension ile inline `@EP-3` tetikleme
- Epic sayfasında makalelerdeki bağlı paragrafları gerçek zamanlı göster
- Ses dosyalarını object storage'a taşı, `durationSec` çıkar
- Realtime (Pusher / Ably / Postgres LISTEN/NOTIFY)
