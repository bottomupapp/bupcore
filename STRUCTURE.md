# Proje yapısı

```
studio/
├── README.md                       ← genel bakış + modül açıklamaları
├── DEPLOY-RAILWAY.md               ← adım adım Railway rehberi
├── package.json
├── tsconfig.json
├── next.config.mjs                 ← bodySizeLimit 25mb (ses için)
├── tailwind.config.ts
├── postcss.config.mjs
├── middleware.ts                   ← auth koruması
├── railway.json                    ← build + healthcheck
├── nixpacks.toml                   ← Nixpacks override
├── Dockerfile                      ← Docker alternatifi
├── .env.example
│
├── prisma/
│   ├── schema.prisma               ← User, Workspace, Epic, Task, Sprint,
│   │                                 IdeationCard, Article, ArticleLink,
│   │                                 VoiceRecording
│   └── seed.ts                     ← demo workspace + 1 epic + 2 task
│
├── lib/
│   ├── db.ts                       ← Prisma client singleton
│   ├── auth.ts                     ← NextAuth v5: Google + Resend/SMTP
│   ├── workspace.ts                ← requireWorkspace() helper
│   ├── anthropic.ts                ← voiceToPrd(), transcribeOnly()
│   └── utils.ts                    ← cn(), slugify(), nextKey(), formatDate()
│
├── app/
│   ├── layout.tsx                  ← global layout + tr dili
│   ├── globals.css                 ← tasarım tokenları + primitive class'lar
│   ├── page.tsx                    ← landing (giriş yapılmışsa /app'e redirect)
│   │
│   ├── auth/
│   │   ├── signin/page.tsx         ← Google + magic link formu
│   │   └── verify/page.tsx         ← email gönderildi ekranı
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── health/route.ts         ← /api/health → SELECT 1
│   │   ├── tasks/route.ts          ← POST (yeni task), GET (liste)
│   │   ├── tasks/[id]/route.ts     ← PATCH (status/epic/sprint değiştir), DELETE
│   │   ├── epics/route.ts
│   │   ├── epics/[id]/route.ts
│   │   ├── sprints/route.ts
│   │   ├── sprints/[id]/route.ts
│   │   ├── ideas/route.ts
│   │   ├── ideas/[id]/route.ts
│   │   ├── ideas/[id]/promote/route.ts  ← fikir → epic
│   │   ├── articles/route.ts
│   │   ├── articles/[slug]/route.ts
│   │   ├── articles/[slug]/links/route.ts
│   │   ├── articles/[slug]/links/[linkId]/route.ts
│   │   ├── voice/route.ts          ← POST audio → Claude → PRD JSON
│   │   └── voice/[id]/to-article/route.ts  ← PRD → yeni Article + epic/task'lar
│   │
│   └── app/                        ← oturum gerektiren tüm sayfalar
│       ├── layout.tsx              ← sol sidebar (Pano, Ideation, Board, Epics, Makaleler, Ses)
│       ├── page.tsx                ← dashboard / özet
│       ├── ideation/
│       │   ├── page.tsx
│       │   └── ideation-client.tsx ← 4 kolon (NEW/REVIEWING/ACCEPTED/PROMOTED)
│       │                              sticky note'lar, oy, durum, epic'e yükselt
│       ├── board/
│       │   ├── page.tsx
│       │   └── board-client.tsx    ← 5 kolon kanban, @dnd-kit sürükle-bırak
│       ├── epics/
│       │   ├── page.tsx
│       │   ├── epics-client.tsx
│       │   └── [id]/page.tsx       ← epic detayı + bağlı makaleler
│       ├── articles/
│       │   ├── page.tsx
│       │   ├── new-button.tsx
│       │   └── [slug]/
│       │       ├── page.tsx
│       │       └── editor-client.tsx  ← Tiptap + BlockId extension + link modal
│       └── voice/
│           ├── page.tsx
│           └── voice-client.tsx    ← MediaRecorder + PRD görüntüleyici
│
└── components/                     ← (şimdilik boş, bileşenler sayfa içine gömülü)
```

## Önemli akışlar

### 1. Fikir → Epic
```
/app/ideation → "Epic" butonu → POST /api/ideas/:id/promote
  → yeni Epic oluşur, kart PROMOTED'a düşer, epic detayına redirect
```

### 2. Sprint board drag-drop
```
Kart sürüklendi → onDragEnd → PATCH /api/tasks/:id { status }
  → optimistic UI + veri tabanı güncellenir
```

### 3. Ses → PRD → Makale
```
/app/voice → Kayda başla → MediaRecorder (audio/webm)
  → Stop → POST /api/voice (multipart/form-data)
  → lib/anthropic.voiceToPrd() → Claude JSON
  → VoiceRecording.prdDraft kaydedilir, status=READY
  → "Makaleye dönüştür" → POST /api/voice/:id/to-article
    → Tiptap JSON oluştur, Article oluştur
    → prd.epics[*] için Epic + altına Task'lar oluştur
    → /app/articles/:slug'a redirect
```

### 4. Makale paragrafı ↔ Epic/Task
```
Tiptap BlockId extension her blok düğümüne data-id ekler (nanoid 8)
  → Kullanıcı paragrafa tıklar → "Bu paragrafı bağla"
  → LinkModal: Epic veya Task seç + opsiyonel etiket
  → POST /api/articles/:slug/links { blockId, epicId, taskId, label }
  → ArticleLink kaydı → Epic detay sayfasında görünür
```
