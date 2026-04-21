"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";

type EpicStatus = "IDEA" | "DISCOVERY" | "IN_PROGRESS" | "SHIPPED" | "ARCHIVED";
type Epic = {
  id: string;
  key: string;
  title: string;
  summary: string | null;
  color: string;
  status: EpicStatus;
  _count: { tasks: number };
};

const STATUS_LABEL: Record<EpicStatus, string> = {
  IDEA: "Fikir",
  DISCOVERY: "Keşif",
  IN_PROGRESS: "Devam",
  SHIPPED: "Yayında",
  ARCHIVED: "Arşiv",
};

const COLORS = [
  "#6366F1",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#0EA5E9",
  "#8B5CF6",
];

export default function EpicsClient({ initial }: { initial: Epic[] }) {
  const [epics, setEpics] = useState<Epic[]>(initial);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  async function create() {
    if (!title.trim()) return;
    const res = await apiFetch("/api/epics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, summary, color }),
    });
    if (res.ok) {
      const e = await res.json();
      setEpics((p) => [...p, { ...e, _count: { tasks: 0 } }]);
      setTitle("");
      setSummary("");
      setShowNew(false);
    }
  }

  async function patch(id: string, data: Partial<Epic>) {
    setEpics((p) => p.map((e) => (e.id === id ? { ...e, ...data } : e)));
    await apiFetch(`/api/epics/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Epic & Task</h1>
          <p className="text-sm text-muted">
            Büyük işleri epic olarak tanımla, alt görevleri bağla.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowNew((v) => !v)}>
          <Plus className="h-4 w-4" /> Yeni epic
        </button>
      </div>

      {showNew && (
        <div className="card p-4 mb-4 space-y-3">
          <input
            autoFocus
            className="input"
            placeholder="Epic başlığı..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input"
            rows={3}
            placeholder="Özet (opsiyonel)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
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
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        {epics.length === 0 && (
          <div className="card p-8 text-center text-muted">
            Henüz epic yok.
          </div>
        )}
        {epics.map((e) => (
          <div key={e.id} className="card p-4 flex items-center gap-4">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ background: e.color }}
            />
            <div className="flex-1 min-w-0">
              <Link
                href={`/app/epics/${e.id}`}
                className="font-medium hover:underline block truncate"
              >
                <span className="text-muted mr-2">{e.key}</span>
                {e.title}
              </Link>
              {e.summary && (
                <div className="text-sm text-muted truncate">{e.summary}</div>
              )}
            </div>
            <select
              value={e.status}
              onChange={(ev) =>
                patch(e.id, { status: ev.target.value as EpicStatus })
              }
              className="input w-32"
            >
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <span className="chip">{e._count.tasks} task</span>
          </div>
        ))}
      </div>
    </div>
  );
}
