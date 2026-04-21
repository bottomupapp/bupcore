"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link2, Trash2, Check } from "lucide-react";
import { nanoid } from "nanoid";
import { apiFetch } from "@/lib/api";

type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: any;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  links: ArticleLink[];
};

type ArticleLink = {
  id: string;
  blockId: string;
  label: string | null;
  epic?: { id: string; key: string; title: string; color: string } | null;
  task?: { id: string; key: string; title: string } | null;
};

type Epic = { id: string; key: string; title: string; color: string };
type Task = { id: string; key: string; title: string };

// Block-id extension: paragraph/heading/list/quote gibi blok düğümlerine
// kararlı bir `data-id` attribute'u ekler. Böylece makale paragraflarını
// epic/task'lara uzun ömürlü biçimde bağlayabiliriz.
const BlockId = Extension.create({
  name: "blockId",
  addGlobalAttributes() {
    return [
      {
        types: [
          "heading",
          "paragraph",
          "bulletList",
          "orderedList",
          "blockquote",
          "codeBlock",
          "listItem",
        ],
        attributes: {
          "data-id": {
            default: null,
            parseHTML: (el: HTMLElement) => el.getAttribute("data-id"),
            renderHTML: (attrs: Record<string, any>) =>
              attrs["data-id"] ? { "data-id": attrs["data-id"] } : {},
          },
        },
      },
    ];
  },
});

export default function ArticleEditor({
  article,
  epics,
  tasks,
}: {
  article: Article;
  epics: Epic[];
  tasks: Task[];
}) {
  const [title, setTitle] = useState(article.title);
  const [subtitle, setSubtitle] = useState(article.subtitle ?? "");
  const [status, setStatus] = useState(article.status);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [links, setLinks] = useState<ArticleLink[]>(article.links);
  const [linkOpen, setLinkOpen] = useState<{ blockId: string } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef(title);
  const subtitleRef = useRef(subtitle);
  titleRef.current = title;
  subtitleRef.current = subtitle;

  const editor = useEditor({
    extensions: [
      StarterKit,
      BlockId,
      Placeholder.configure({
        placeholder:
          "Hikayeni anlat... Paragrafa tıklayıp epic/task'a bağlayabilirsin.",
      }),
      Link.configure({ openOnClick: false }),
    ],
    content: article.content,
    editorProps: {
      attributes: { class: "prose-studio focus:outline-none min-h-[400px]" },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      ensureBlockIds(editor);
      scheduleSave(editor.getJSON());
    },
    onCreate: ({ editor }) => {
      ensureBlockIds(editor);
    },
  });

  function scheduleSave(content: any) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(content), 1000);
  }

  async function save(content?: any) {
    const res = await apiFetch(`/api/articles/${article.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titleRef.current,
        subtitle: subtitleRef.current,
        content: content ?? editor?.getJSON(),
      }),
    });
    if (res.ok) setSavedAt(new Date());
  }

  async function updateStatus(next: Article["status"]) {
    setStatus(next);
    await apiFetch(`/api/articles/${article.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
  }

  async function addLink(
    blockId: string,
    payload: { epicId?: string; taskId?: string; label?: string },
  ) {
    const res = await apiFetch(`/api/articles/${article.slug}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockId, ...payload }),
    });
    if (res.ok) {
      const link = await res.json();
      setLinks((p) => [...p, link]);
    }
  }

  async function removeLink(id: string) {
    setLinks((p) => p.filter((l) => l.id !== id));
    await apiFetch(`/api/articles/${article.slug}/links/${id}`, {
      method: "DELETE",
    });
  }

  function currentBlockId() {
    if (!editor) return null;
    const { $from } = editor.state.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth);
      const id = node.attrs?.["data-id"];
      if (id) return id;
    }
    return null;
  }

  const linksByBlock = useMemo(() => {
    const m: Record<string, ArticleLink[]> = {};
    links.forEach((l) => {
      m[l.blockId] ??= [];
      m[l.blockId].push(l);
    });
    return m;
  }, [links]);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] min-h-screen">
      <div className="max-w-3xl mx-auto p-10 w-full">
        <div className="mb-6 flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value as any)}
            className="input w-32"
          >
            <option value="DRAFT">Taslak</option>
            <option value="PUBLISHED">Yayında</option>
            <option value="ARCHIVED">Arşiv</option>
          </select>
          <button
            className="btn-outline"
            onClick={() => {
              const id = currentBlockId();
              if (!id) {
                alert(
                  "Önce bir paragrafa tıkla (bloklara otomatik ID atanır).",
                );
                return;
              }
              setLinkOpen({ blockId: id });
            }}
          >
            <Link2 className="h-4 w-4" /> Bu paragrafı bağla
          </button>
          <div className="ml-auto text-xs text-muted">
            {savedAt ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                kaydedildi {savedAt.toLocaleTimeString("tr-TR")}
              </span>
            ) : (
              "otomatik kaydediliyor..."
            )}
          </div>
        </div>

        <input
          className="w-full text-5xl font-bold tracking-tight outline-none bg-transparent mb-2"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            scheduleSave(editor?.getJSON());
          }}
          placeholder="Başlık"
        />
        <input
          className="w-full text-xl text-muted outline-none bg-transparent mb-8"
          value={subtitle}
          onChange={(e) => {
            setSubtitle(e.target.value);
            scheduleSave(editor?.getJSON());
          }}
          placeholder="Alt başlık"
        />

        <EditorContent editor={editor} />
      </div>

      <aside className="border-l border-border bg-surface p-5 lg:sticky lg:top-0 h-full max-h-screen overflow-y-auto">
        <h3 className="label mb-3">Bağlantılar</h3>
        {links.length === 0 && (
          <p className="text-sm text-muted">
            Henüz bağlantı yok. Bir paragrafa tıkla, "Bu paragrafı bağla" de.
          </p>
        )}
        <div className="space-y-3">
          {links.map((l) => (
            <div key={l.id} className="card p-3">
              {l.epic && (
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: l.epic.color }}
                  />
                  <span className="text-muted">{l.epic.key}</span>
                  <span className="flex-1 truncate">{l.epic.title}</span>
                </div>
              )}
              {l.task && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">{l.task.key}</span>
                  <span className="flex-1 truncate">{l.task.title}</span>
                </div>
              )}
              {l.label && <div className="mt-1 chip">{l.label}</div>}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted">
                  blok: {l.blockId.slice(0, 6)}
                </span>
                <button
                  onClick={() => removeLink(l.id)}
                  className="text-muted hover:text-red-600"
                  title="Bağlantıyı kaldır"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {linkOpen && (
        <LinkModal
          blockId={linkOpen.blockId}
          epics={epics}
          tasks={tasks}
          onClose={() => setLinkOpen(null)}
          onAdd={(payload) => {
            addLink(linkOpen.blockId, payload);
            setLinkOpen(null);
          }}
        />
      )}
    </div>
  );
}

function LinkModal({
  blockId,
  epics,
  tasks,
  onClose,
  onAdd,
}: {
  blockId: string;
  epics: Epic[];
  tasks: Task[];
  onClose: () => void;
  onAdd: (p: { epicId?: string; taskId?: string; label?: string }) => void;
}) {
  const [epicId, setEpicId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [label, setLabel] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 p-6">
      <div className="card p-5 w-full max-w-md">
        <h3 className="font-semibold text-lg">Paragrafı bağla</h3>
        <p className="text-xs text-muted mb-4">Blok: {blockId.slice(0, 8)}</p>

        <label className="label block mb-1">Epic</label>
        <select
          value={epicId}
          onChange={(e) => setEpicId(e.target.value)}
          className="input mb-3"
        >
          <option value="">—</option>
          {epics.map((e) => (
            <option key={e.id} value={e.id}>
              {e.key} · {e.title}
            </option>
          ))}
        </select>

        <label className="label block mb-1">Task</label>
        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="input mb-3"
        >
          <option value="">—</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.key} · {t.title}
            </option>
          ))}
        </select>

        <label className="label block mb-1">Etiket (opsiyonel)</label>
        <input
          className="input mb-4"
          placeholder="ör. Scope, Acceptance criteria"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>
            İptal
          </button>
          <button
            className="btn-primary"
            disabled={!epicId && !taskId}
            onClick={() =>
              onAdd({
                epicId: epicId || undefined,
                taskId: taskId || undefined,
                label: label || undefined,
              })
            }
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Her blok düğümüne data-id yoksa atar, böylece paragrafları epic/task'a
 * kararlı ID ile bağlayabiliriz. BlockId extension'ı sayesinde bu attr
 * Tiptap şemasında tanımlı olduğu için serileştirilir.
 */
function ensureBlockIds(editor: any) {
  const tr = editor.state.tr;
  let changed = false;
  editor.state.doc.descendants((node: any, pos: number) => {
    if (node.isBlock && !node.attrs["data-id"]) {
      tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        "data-id": nanoid(8),
      });
      changed = true;
    }
  });
  if (changed) editor.view.dispatch(tr);
}
