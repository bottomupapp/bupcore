"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Loader2, Wand2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

type Recording = {
  id: string;
  status: "RECORDED" | "TRANSCRIBING" | "DRAFTING" | "READY" | "FAILED";
  createdAt: string;
  transcript: string | null;
  prdDraft: any;
  articleId: string | null;
  errorMessage: string | null;
};

export default function VoiceClient({ initial }: { initial: Recording[] }) {
  const [recs, setRecs] = useState<Recording[]>(initial);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hint, setHint] = useState("");
  const [selected, setSelected] = useState<Recording | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorder.current = rec;
      chunks.current = [];
      rec.ondataavailable = (e) => chunks.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        await upload(blob);
      };
      rec.start();
      setIsRecording(true);
      setElapsed(0);
      timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch (e: any) {
      alert("Mikrofona erişilemedi: " + (e?.message ?? e));
    }
  }

  function stop() {
    if (timer.current) clearInterval(timer.current);
    setIsRecording(false);
    mediaRecorder.current?.stop();
  }

  async function upload(blob: Blob) {
    setIsProcessing(true);
    try {
      const fd = new FormData();
      fd.append("audio", blob, "recording.webm");
      if (hint.trim()) fd.append("hint", hint.trim());
      const res = await apiFetch("/api/voice", { method: "POST", body: fd });
      const rec: Recording = await res.json();
      setRecs((p) => [rec, ...p]);
      setSelected(rec);
    } finally {
      setIsProcessing(false);
    }
  }

  async function convertToArticle(id: string) {
    const res = await apiFetch(`/api/voice/${id}/to-article`, { method: "POST" });
    if (res.ok) {
      const { article } = await res.json();
      router.push(`/studio/articles/${article.slug}`);
    } else {
      alert("Dönüşüm başarısız");
    }
  }

  const prd = selected?.prdDraft;

  return (
    <div className="p-8 max-w-6xl grid lg:grid-cols-[360px_1fr] gap-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Ses → PRD</h1>
        <p className="text-sm text-muted mb-4">
          Bir düğmeye bas, fikrini anlat. Claude; problem, kullanıcı hikayeleri,
          gereksinimler ve önerilen epic'leri çıkaracak.
        </p>

        <div className="card p-4">
          <label className="label block mb-1">Ek bağlam (opsiyonel)</label>
          <textarea
            className="input mb-3"
            rows={2}
            placeholder="ör. 'B2B dashboard, teknik kullanıcılar için'"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            disabled={isRecording || isProcessing}
          />

          {!isRecording ? (
            <button
              disabled={isProcessing}
              className="btn-primary w-full justify-center h-12"
              onClick={start}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> İşleniyor...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> Kayda başla
                </>
              )}
            </button>
          ) : (
            <button
              className="btn w-full justify-center h-12 bg-red-600 text-white hover:bg-red-500"
              onClick={stop}
            >
              <Square className="h-4 w-4" /> Durdur · {mmss(elapsed)}
            </button>
          )}

          <p className="text-xs text-muted mt-3">
            Ses verisi Anthropic API'ye gönderilir. ANTHROPIC_API_KEY .env'de
            tanımlı olmalı.
          </p>
        </div>

        <h3 className="label mt-6 mb-2">Son kayıtlar</h3>
        <div className="space-y-1">
          {recs.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={cn(
                "w-full text-left card p-3",
                selected?.id === r.id && "ring-2 ring-accent/50",
              )}
            >
              <div className="flex items-center gap-2">
                <StatusPill status={r.status} />
                <span className="text-sm truncate flex-1">
                  {r.prdDraft?.title ?? "Başlıksız"}
                </span>
                <span className="text-xs text-muted">
                  {new Date(r.createdAt).toLocaleTimeString("tr-TR")}
                </span>
              </div>
              {r.errorMessage && (
                <div className="text-xs text-red-600 mt-1 truncate">
                  {r.errorMessage}
                </div>
              )}
            </button>
          ))}
          {recs.length === 0 && (
            <div className="text-sm text-muted p-3">Henüz kayıt yok.</div>
          )}
        </div>
      </section>

      <section className="min-w-0">
        {!selected ? (
          <div className="card p-8 text-center text-muted h-full grid place-items-center">
            Bir kaydı seç veya yeni bir kayıt oluştur.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold flex-1">
                {prd?.title ?? "PRD Taslağı"}
              </h2>
              <StatusPill status={selected.status} />
              {selected.status === "READY" && (
                <button
                  className="btn-primary"
                  onClick={() => convertToArticle(selected.id)}
                >
                  <Wand2 className="h-4 w-4" /> Makaleye dönüştür
                </button>
              )}
              {selected.articleId && (
                <button
                  className="btn-outline"
                  onClick={() => router.push(`/studio/articles`)}
                >
                  <FileText className="h-4 w-4" /> Makaleyi aç
                </button>
              )}
            </div>

            {selected.errorMessage && (
              <div className="card p-4 text-sm text-red-700 bg-red-50">
                Hata: {selected.errorMessage}
              </div>
            )}

            {prd?.subtitle && (
              <p className="text-muted">{prd.subtitle}</p>
            )}

            {prd && <PrdView prd={prd} />}

            {selected.transcript && (
              <details className="card p-4">
                <summary className="cursor-pointer text-sm text-muted">
                  Ham çıktı (debug)
                </summary>
                <pre className="text-xs whitespace-pre-wrap mt-3">
                  {selected.transcript}
                </pre>
              </details>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color: Record<string, string> = {
    RECORDED: "bg-sky-100 text-sky-800",
    DRAFTING: "bg-amber-100 text-amber-800",
    TRANSCRIBING: "bg-amber-100 text-amber-800",
    READY: "bg-emerald-100 text-emerald-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={cn(
        "text-[11px] rounded-full px-2 py-0.5",
        color[status] ?? "bg-border/40",
      )}
    >
      {status}
    </span>
  );
}

function PrdView({ prd }: { prd: any }) {
  return (
    <div className="card p-5 space-y-4">
      <Section title="Problem" body={prd.problem} />
      <List title="Hedef kullanıcı" items={prd.users} />
      <List title="Hedefler" items={prd.goals} />
      <List title="Kapsam dışı" items={prd.nonGoals} />
      {Array.isArray(prd.userStories) && prd.userStories.length > 0 && (
        <div>
          <h3 className="label mb-1">Kullanıcı hikayeleri</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {prd.userStories.map((s: any, i: number) => (
              <li key={i}>
                {typeof s === "string"
                  ? s
                  : `Bir ${s.role} olarak ${s.want} istiyorum, çünkü ${s.benefit}.`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {Array.isArray(prd.requirements) && prd.requirements.length > 0 && (
        <div>
          <h3 className="label mb-1">Gereksinimler</h3>
          <div className="space-y-2">
            {prd.requirements.map((r: any, i: number) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="text-sm font-medium">
                  {r.title}{" "}
                  <span className="text-xs text-muted">({r.priority})</span>
                </div>
                {r.detail && (
                  <div className="text-sm text-muted mt-1">{r.detail}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {Array.isArray(prd.epics) && prd.epics.length > 0 && (
        <div>
          <h3 className="label mb-1">Önerilen epic'ler</h3>
          <div className="space-y-2">
            {prd.epics.map((e: any, i: number) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="text-sm font-medium">{e.title}</div>
                {e.summary && (
                  <div className="text-sm text-muted mt-1">{e.summary}</div>
                )}
                {Array.isArray(e.tasks) && e.tasks.length > 0 && (
                  <ul className="list-disc pl-5 text-sm mt-2 space-y-0.5">
                    {e.tasks.map((t: any, j: number) => (
                      <li key={j}>
                        {typeof t === "string" ? t : t.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <List title="Riskler" items={prd.risks} />
      <List title="Başarı metrikleri" items={prd.successMetrics} />
    </div>
  );
}

function Section({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div>
      <h3 className="label mb-1">{title}</h3>
      <p className="text-sm whitespace-pre-wrap">{body}</p>
    </div>
  );
}
function List({ title, items }: { title: string; items?: any[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div>
      <h3 className="label mb-1">{title}</h3>
      <ul className="list-disc pl-5 text-sm space-y-0.5">
        {items.map((it, i) => (
          <li key={i}>{String(it)}</li>
        ))}
      </ul>
    </div>
  );
}

function mmss(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
