import { requireWorkspace } from "@/lib/workspace";
import { db } from "@/lib/db";
import SprintBoardClient from "./board-client";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ sprint?: string }>;
}) {
  const { workspace } = await requireWorkspace();
  const { sprint: sprintParam } = await searchParams;

  const [sprints, epics] = await Promise.all([
    db.sprint.findMany({
      where: { workspaceId: workspace.id },
      orderBy: [{ active: "desc" }, { createdAt: "desc" }],
    }),
    db.epic.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const activeSprint =
    sprints.find((s) => s.id === sprintParam) ??
    sprints.find((s) => s.active) ??
    sprints[0] ??
    null;

  const tasks = activeSprint
    ? await db.task.findMany({
        where: { workspaceId: workspace.id, sprintId: activeSprint.id },
        include: {
          epic: { select: { id: true, key: true, title: true, color: true } },
          assignee: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { order: "asc" },
      })
    : [];

  return (
    <SprintBoardClient
      sprints={JSON.parse(JSON.stringify(sprints))}
      epics={JSON.parse(JSON.stringify(epics))}
      activeSprint={JSON.parse(JSON.stringify(activeSprint))}
      initialTasks={JSON.parse(JSON.stringify(tasks))}
    />
  );
}
