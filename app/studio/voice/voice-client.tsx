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

const BAR_COUNT = 24;
const MIC_STORAGE_KEY = "voice.mic.deviceId";

export default function VoiceClient({ initial }: { initial: Recording[] }) {
  const [recs, setRecs] = useState<Recording[]>(initial);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hint, setHint] = useState("");
  const [selected, setSelected] = useState<Recording | null>(null);
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0));
  const [peakHeard, setPeakHeard] = useState(false);

  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [permissionState, setPermissionState] = useState<
    "unknown" | "granted" | "denied" | "needs-request"
  >("unknown");
  const [deviceLost, setDeviceLost] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const rafId = useRef<number | null>(null);
  const sourceStream = useRef<MediaStream | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem(MIC_STORAGE_KEY);
    if (saved) setDeviceId(saved);

    refreshDevices();

    const onChange = () => refreshDevices();
    navigator.mediaDevices?.addEventListener?.("devicechange", onChange);

    // If permissions API is available, watch live
    let permStatus: PermissionStatus | null = null;
    (async () => {
      try {
        const ps = await (navigator as any).permissions?.query?.({
          name: "microphone",
        });
        if (ps) {
          permStatus = ps;
          const map = (s: string) =>
            s === "granted"
              ? "granted"
              : s === "denied"
                ? "denied"
                : "needs-request";
          setPermissionState(map(ps.state) as any);
          ps.onchange = () => {
            setPermissionState(map(ps.state) as any);
            if (ps.state === "granted") refreshDevices();
          };
        } else {
          setPermissionState("needs-request");
        }
      } catch {
        setPermissionState("needs-request");
      }
    })();

    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", onChange);
      if (permStatus) permStatus.onchange = null;
      cleanupAudio();
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  async function refreshDevices() {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const audioIn = list.filter((d) => d.kind === "audioinput");
      setMics(audioIn);
      // if stored deviceId missing, fall back
      setDeviceId((prev) => {
        if (prev && audioIn.some((d) => d.deviceId === prev)) return prev;
        const def = audioIn.find((d) => d.deviceId === "default") ?? audioIn[0];
        return def?.deviceId ?? "";
      });
    } catch {}
  }

  async function requestPermission() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
      setPermissionState("granted");
      await refreshDevices();
    } catch (e: any) {
      setPermissionState("denied");
      alert("Mikrofon izni reddedildi: " + (e?.message ?? e));
    }
  }

  function onPickMic(id: string) {
    setDeviceId(id);
    try {
      localStorage.setItem(MIC_STORAGE_KEY, id);
    } catch {}
  }

  function cleanupAudio() {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
    sourceStream.current?.getTracks().forEach((t) => t.stop());
    sourceStream.current = null;
    audioCtx.current?.close().catch(() => {});
    audioCtx.current = null;
    analyser.current = null;
  }

  function startMeter(stream: MediaStream) {
    const AC: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    const src = ctx.createMediaStreamSource(stream);
    const a = ctx.createAnalyser();
    a.fftSize = 1024;
    a.smoothingTimeConstant = 0.75;
    src.connect(a);
    audioCtx.current = ctx;
    analyser.current = a;

    const data = new Uint8Array(a.frequencyBinCount);
    const binSize = Math.floor(data.length / BAR_COUNT);

    const tick = () => {
      if (!analyser.current) return;
      analyser.current.getByteFrequencyData(data);
      const next: number[] = [];
      let max = 0;
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < binSize; j++) sum += data[i * binSize + j];
        const avg = sum / binSize / 255;
        next.push(avg);
        if (avg > max) max = avg;
      }
      setLevels(next);
      if (max > 0.12) setPeakHeard(true);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
  }

  async function start() {
    if (!deviceId) {
      alert("Önce bir mikrofon seç.");
      return;
    }
    setIsStarting(true);
    setDeviceLost(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      sourceStream.current = stream;

      // Detect mid-recording device disconnect
      stream.getAudioTracks().forEach((t) => {
        t.addEventListener("ended", () => {
          if (mediaRecorder.current?.state === "recording") {
            setDeviceLost(true);
            try {
              mediaRecorder.current.stop();
            } catch {}
            if (timer.current) clearInterval(timer.current);
            setIsRecording(false);
          }
        });
      });

      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorder.current = rec;
      chunks.current = [];
      rec.ondataavailable = (e) =>
        e.data.size > 0 && chunks.current.push(e.data);
      rec.onstop = async () => {
        cleanupAudio();
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        if (blob.size > 0 && !deviceLost) await upload(blob);
      };
      rec.start(250);
      setIsRecording(true);
      setElapsed(0);
      setLevels(Array(BAR_COUNT).fill(0));
      setPeakHeard(false);
      startMeter(stream);
      timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch (e: any) {
      alert("Mikrofona erişilemedi: " + (e?.message ?? e));
    } finally {
      setIsStarting(false);
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
    const res = await apiFetch(`/api/voice/${id}/to-article`, {
      method: "POST",
    });
    if (res.ok) {
      const { article } = await res.json();
      router.push(`/studio/articles/${article.slug}`);
    } else {
      alert("Dönüşüm başarısız");
    }
  }

  const prd = selected?.prdDraft;
  const needsRequest =
    permissionState === "needs-request" ||
    permissionState === "unknown" ||
    // labels hidden = not granted yet (Safari etc.)
    (mics.length > 0 && mics.every((m) => !m.label));
  const isDenied = permissionState === "denied";

  return (
    <div className="p-8 max-w-6xl grid lg:grid-cols-[380px_1fr] gap-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Ses → PRD</h1>
        <p className="text-sm text-muted mb-4">
          Bir düğmeye bas, fikrini anlat. Claude; problem, kullanıcı hikayeleri,
          gereksinimler ve önerilen epic'leri çıkaracak.
        </p>

        <div className="card p-4">
          <label className="label block mb-1">Mikrofon</label>
          {isDenied ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Mikrofon izni reddedilmiş. Tarayıcı adres çubuğundaki kilit
              simgesinden izni açıp sayfayı yenile.
            </div>
          ) : needsRequest ? (
            <button
              type="button"
              className="btn-outline w-full justify-center h-10"
              onClick={requestPermission}
              disabled={isRecording || isProcessing}
            >
              Mikrofonları göster
            </button>
          ) : (
            <select
              className="input h-10 w-full"
              value={deviceId}
              onChange={(e) => onPickMic(e.target.value)}
              disabled={isRecording || isProcessing || isStarting}
            >
              {mics.length === 0 && <option value="">Mikrofon bulunamadı</option>}
              {mics.map((m) => (
                <option key={m.deviceId} value={m.deviceId}>
                  {m.label || "Adsız mikrofon"}
                </option>
              ))}
            </select>
          )}
          {mics.length > 1 && !needsRequest && !isDenied && (
            <p className="text-xs text-muted mt-1">
              Kullanmak istediğin mikrofonu seç. macOS'te iPhone'un
              Continuity mikrofonu görünebilir; kayıt sırasında bağlantıyı
              koparırsa kayıt iptal olur.
            </p>
          )}

          <label className="label block mt-4 mb-1">Ek bağlam (opsiyonel)</label>
          <textarea
            className="input mb-3"
            rows={2}
            placeholder="ör. 'B2B dashboard, teknik kullanıcılar için'"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            disabled={isRecording || isProcessing}
          />

          {deviceLost && !isRecording && (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Mikrofon bağlantısı koptu. Farklı bir mikrofon seçip tekrar
              dene.
            </div>
          )}

          {isRecording ? (
            <RecordingView
              elapsed={elapsed}
              levels={levels}
              peakHeard={peakHeard}
              micLabel={mics.find((m) => m.deviceId === deviceId)?.label}
              onStop={stop}
            />
          ) : (
            <button
              disabled={
                isProcessing || isStarting || needsRequest || isDenied || !deviceId
              }
              className="btn-primary w-full justify-center h-12"
              onClick={start}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> İşleniyor...
                </>
              ) : isStarting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />{" "}
                  Mikrofon açılıyor...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> Kayda başla
                </>
              )}
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

            {prd?.subtitle && <p className="text-muted">{prd.subtitle}</p>}

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

function RecordingView({
  elapsed,
  levels,
  peakHeard,
  micLabel,
  onStop,
}: {
  elapsed: number;
  levels: number[];
  peakHeard: boolean;
  micLabel?: string;
  onStop: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-red-800">KAYDEDİLİYOR</div>
          <div className="text-xs text-red-700/80 truncate">
            {micLabel ? `${micLabel} · ` : ""}
            {peakHeard ? "ses alıyor" : "sessizlik — konuşmaya başla"}
          </div>
        </div>
        <div className="font-mono text-2xl tabular-nums text-red-900">
          {mmss(elapsed)}
        </div>
      </div>

      <div
        aria-hidden
        className="flex items-end justify-between gap-0.5 h-10 px-0.5"
      >
        {levels.map((v, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-red-500/80 transition-[height] duration-75"
            style={{ height: `${Math.max(6, Math.min(100, v * 140))}%` }}
          />
        ))}
      </div>

      <button
        className="btn w-full justify-center h-11 bg-red-600 text-white hover:bg-red-500"
        onClick={onStop}
      >
        <Square className="h-4 w-4" /> Durdur ve PRD üret
      </button>
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
