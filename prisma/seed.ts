import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const ws = await db.workspace.upsert({
    where: { slug: "demo" },
    update: {},
    create: { name: "Demo Workspace", slug: "demo" },
  });

  const sprint = await db.sprint.upsert({
    where: { id: "seed-sprint-1" },
    update: {},
    create: {
      id: "seed-sprint-1",
      workspaceId: ws.id,
      name: "Sprint 1",
      goal: "Ilk canlı sürüm",
      active: true,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  const epic = await db.epic.upsert({
    where: { workspaceId_key: { workspaceId: ws.id, key: "EP-1" } },
    update: {},
    create: {
      workspaceId: ws.id,
      key: "EP-1",
      title: "Onboarding akışı",
      summary: "Yeni kullanıcıların ilk 5 dakikası",
      color: "#6366F1",
    },
  });

  await db.task.upsert({
    where: { workspaceId_key: { workspaceId: ws.id, key: "T-1" } },
    update: {},
    create: {
      workspaceId: ws.id,
      key: "T-1",
      title: "Google SSO akışı",
      status: "IN_PROGRESS",
      epicId: epic.id,
      sprintId: sprint.id,
    },
  });
  await db.task.upsert({
    where: { workspaceId_key: { workspaceId: ws.id, key: "T-2" } },
    update: {},
    create: {
      workspaceId: ws.id,
      key: "T-2",
      title: "Magic link email tasarımı",
      status: "TODO",
      epicId: epic.id,
      sprintId: sprint.id,
    },
  });

  await db.ideationBoard.upsert({
    where: { id: "seed-board-1" },
    update: {},
    create: {
      id: "seed-board-1",
      workspaceId: ws.id,
      name: "Genel fikirler",
    },
  });

  console.log("Seed tamamlandı:", { ws: ws.slug, epic: epic.key });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
