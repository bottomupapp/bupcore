import Link from "next/link";
import { notFound } from "next/navigation";
import { requireWorkspace } from "@/lib/workspace";
import { db } from "@/lib/db";

const TASK_STATUS_LABEL: Record<string, string> = {
  BACKLOG: "Backlog",
  TODO: "To do",
  IN_PROGRESS: "Devam",
  REVIEW: "Review",
  DONE: "Tamam",
};

export default async function EpicDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { workspace } = await requireWorkspace();
  const { id } = await params;
  const epic = await db.epic.findFirst({
    where: { id, workspaceId: workspace.id },
    include: {
      tasks: {
        orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      },
      articleLinks: {
        include: { article: { select: { id: true, slug: true, title: true } } },
      },
    },
  });
  if (!epic) notFound();

  const byStatus: Record<string, typeof epic.tasks> = {
    BACKLOG: [],
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  };
  epic.tasks.forEach((t) => byStatus[t.status].push(t));

  return (
    <div className="p-8 max-w-5xl">
      <Link
        href="/studio/epics"
        className="text-sm text-muted hover:text-fg mb-2 inline-block"
      >
        ← Epic'ler
      </Link>

      <div className="flex items-start gap-3 mb-2">
        <span
          className="h-4 w-4 rounded-full mt-2"
          style={{ background: epic.color }}
        />
        <div>
          <div className="text-xs text-muted uppercase tracking-wide">
            {epic.key} · {epic.status}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{epic.title}</h1>
          {epic.summary && (
            <p className="text-muted mt-2 max-w-2xl">{epic.summary}</p>
          )}
        </div>
      </div>

      {epic.articleLinks.length > 0 && (
        <section className="mt-6">
          <h2 className="label mb-2">Bağlı makaleler</h2>
          <div className="flex flex-wrap gap-2">
            {epic.articleLinks.map((l) =>
              l.article ? (
                <Link
                  key={l.id}
                  href={`/studio/articles/${l.article.slug}`}
                  className="chip hover:bg-border/40"
                >
                  {l.article.title}
                  {l.label ? ` · ${l.label}` : ""}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Task'lar</h2>
        {epic.tasks.length === 0 ? (
          <div className="card p-6 text-muted text-sm">
            Henüz task yok. Sprint board'dan bu epic'e task ekleyin.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(byStatus).map(([status, tasks]) =>
              tasks.length === 0 ? null : (
                <div key={status}>
                  <div className="label mb-2">
                    {TASK_STATUS_LABEL[status]} · {tasks.length}
                  </div>
                  <div className="space-y-1">
                    {tasks.map((t) => (
                      <div
                        key={t.id}
                        className="card p-3 text-sm flex items-center gap-2"
                      >
                        <span className="text-muted">{t.key}</span>
                        <span className="flex-1 truncate">{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}
