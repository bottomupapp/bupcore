import Link from "next/link";
import { requireWorkspace } from "@/lib/workspace";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AppHome() {
  const { workspace } = await requireWorkspace();
  const wid = workspace.id;

  const [tasks, epics, sprints, ideas, articles, voices] = await Promise.all([
    db.task.count({ where: { workspaceId: wid } }),
    db.epic.count({ where: { workspaceId: wid } }),
    db.sprint.count({ where: { workspaceId: wid, active: true } }),
    db.ideationCard.count({ where: { board: { workspaceId: wid } } }),
    db.article.count({ where: { workspaceId: wid } }),
    db.voiceRecording.count({ where: { workspaceId: wid } }),
  ]);

  const recentEpics = await db.epic.findMany({
    where: { workspaceId: wid },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: { _count: { select: { tasks: true } } },
  });

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pano</h1>
          <p className="text-sm text-muted">
            Workspace: <span className="text-fg">{workspace.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-10">
        {[
          { label: "Aktif Sprint", value: sprints, href: "/studio/board" },
          { label: "Task", value: tasks, href: "/studio/board" },
          { label: "Epic", value: epics, href: "/studio/epics" },
          { label: "Fikir", value: ideas, href: "/studio/ideation" },
          { label: "Makale", value: articles, href: "/studio/articles" },
          { label: "Ses Kaydı", value: voices, href: "/studio/voice" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="card p-4 hover:bg-border/20">
            <div className="label">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold">{s.value}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Son epic'ler</h2>
      <div className="grid gap-2">
        {recentEpics.length === 0 && (
          <div className="card p-4 text-sm text-muted">
            Henüz epic yok.{" "}
            <Link href="/studio/epics" className="text-accent underline">
              Yeni epic oluştur
            </Link>
          </div>
        )}
        {recentEpics.map((e) => (
          <Link
            key={e.id}
            href={`/studio/epics/${e.id}`}
            className="card p-4 flex items-center gap-3 hover:bg-border/20"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: e.color }}
            />
            <div className="flex-1">
              <div className="font-medium">
                <span className="text-muted mr-2">{e.key}</span>
                {e.title}
              </div>
              <div className="text-xs text-muted">
                {e._count.tasks} task · güncellendi {formatDate(e.updatedAt)}
              </div>
            </div>
            <span className="chip">{e.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
