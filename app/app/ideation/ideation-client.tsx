"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ThumbsUp, ArrowRightCircle, Trash2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

type IdeaStatus = "NEW" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "PROMOTED";
type Idea = {
  id: string;
  title: string;
  body: string | null;
  status: IdeaStatus;
  color: string;
  tags: string[];
  votes: number;
  author?: { name?: string | null; email?: string | null } | null;
  promotedToEpicId: string | null;
};

const COLORS = [
  "#FDE68A", // sarı
  "#FECACA", // pembe
  "#BFDBFE", // mavi
  "#BBF7D0", // yeşil
  "#DDD6FE", // mor
  "#FED7AA", // turuncu
];

const COLUMNS: { id: IdeaStatus; label: string }[] = [
  { id: "NEW", label: "Yeni fikir" },
  { id: "REVIEWING", label: "Değerlendiriliyor" },
  { id: "ACCEPTED", label: "Kabul edildi" },
  { id: "PROMOTED", label: "Epic'e çıktı" },
];

export default function IdeationClient({
  boardId,
  initial,
}: {
  boardId: string;
  initial: Idea[];
}) {
  const [ideas, setIdeas] = useState<Idea[]>(initial);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();

  async function create() {
    if (!title.trim()) return;
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const res = await apiFetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId, title, body, color, tags }),
    });
    if (res.ok) {
      const c = await res.json();
      setIdeas((p) => [{ ...c, author: null }, ...p]);
      setTitle("");
      setBody("");
      setTagInput("");
      setShowNew(false);
    }
  }

  async function vote(id: string) {
    setIdeas((p) =>
      p.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i)),
    );
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    await apiFetch(`/api/ideas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes: idea.votes + 1 }),
    });
  }

  async function setStatus(id: string, status: IdeaStatus) {
    setIdeas((p) => p.map((i) => (i.id === id ? { ...i, status } : i)));
    await apiFetch(`/api/ideas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function promote(id: string) {
    const res = await apiFetch(`/api/ideas/${id}/promote`, { method: "POST" });
    if (res.ok) {
      const { epic } = await res.json();
      setIdeas((p) =>
        p.map((i) =>
          i.id === id
            ? { ...i, status: "PROMOTED", promotedToEpicId: epic.id }
            : i,
        ),
      );
      router.push(`/app/epics/${epic.id}`);
    }
  }

  async function remove(id: string) {
    if (!confirm("Fikir silinsin mi?")) return;
    setIdeas((p) => p.filter((i) => i.id !== id));
    await apiFetch(`/api/ideas/${id}`, { method: "DELETE" });
  }

  const grouped: Record<IdeaStatus, Idea[]> = {
    NEW: [],
    REVIEWING: [],
    ACCEPTED: [],
    REJECTED: [],
    PROMOTED: [],
  };
  ideas.forEach((i) => grouped[i.status].push(i));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ideation Board</h1>
          <p className="text-sm text-muted">
            Fikirleri hızlıca yaz, ekip oylasın, hazır olanları epic'e yükselt.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowNew((v) => !v)}>
          <Plus className="h-4 w-4" /> Yeni fikir
        </button>
      </div>

      {showNew && (
        <div className="card p-4 mb-4 space-y-3">
          <input
            autoFocus
            className="input"
            placeholder="Fikir başlığı..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input"
            rows={3}
            placeholder="Neden önemli, hangi problemi çözüyor?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <input
            className="input"
            placeholder="Etiketler (virgülle ayır): mobile, onboarding"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="label">Renk</span>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="h-6 w-6 rounded-full border-2"
                style={{
                  background: c,
                  borderColor: c === color ? "#000" : "transparent",
                }}
              />
            ))}
            <div className="ml-auto flex gap-2">
              <button className="btn-ghost" onClick={() => setShowNew(false)}>
                İptal
              </button>
              <button className="btn-primary" onClick={create}>
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="text-sm font-semibold">
                {col.label}{" "}
                <span className="text-muted font-normal ml-1">
                  {grouped[col.id].length}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {grouped[col.id].map((i) => (
                <div
                  key={i.id}
                  className="sticky-note"
                  style={{ background: i.color }}
                >
                  <div className="font-medium leading-snug">{i.title}</div>
                  {i.body && (
                    <p className="text-sm mt-1 text-black/70 whitespace-pre-wrap">
                      {i.body}
                    </p>
                  )}
                  {i.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {i.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] rounded bg-black/10 px-1.5 py-0.5 flex items-center gap-1"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-1">
                    <button
                      onClick={() => vote(i.id)}
                      className="flex items-center gap-1 rounded bg-black/10 px-1.5 py-1 text-xs hover:bg-black/20"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {i.votes}
                    </button>
                    <select
                      value={i.status}
                      onChange={(e) =>
                        setStatus(i.id, e.target.value as IdeaStatus)
                      }
                      className="text-xs bg-black/5 rounded px-1 py-1"
                    >
                      {["NEW", "REVIEWING", "ACCEPTED", "REJECTED"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {i.status !== "PROMOTED" && (
                      <button
                        onClick={() => promote(i.id)}
                        className="ml-auto flex items-center gap-1 rounded bg-black/10 px-1.5 py-1 text-xs hover:bg-black/20"
                        title="Epic'e yükselt"
                      >
                        <ArrowRightCircle className="h-3 w-3" />
                        Epic
                      </button>
                    )}
                    <button
                      onClick={() => remove(i.id)}
                      className={cn(
                        "rounded px-1.5 py-1 text-xs",
                        i.status === "PROMOTED" ? "ml-auto" : "",
                        "hover:bg-black/10",
                      )}
                      title="Sil"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {grouped[col.id].length === 0 && (
                <div className="text-xs text-muted py-4 text-center">Boş</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
