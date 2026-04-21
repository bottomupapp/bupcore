import { requireWorkspace } from "@/lib/workspace";
import { db } from "@/lib/db";
import IdeationClient from "./ideation-client";

export default async function IdeationPage() {
  const { workspace } = await requireWorkspace();
  let board = await db.ideationBoard.findFirst({
    where: { workspaceId: workspace.id },
  });
  if (!board) {
    board = await db.ideationBoard.create({
      data: { workspaceId: workspace.id, name: "Genel fikirler" },
    });
  }
  const cards = await db.ideationCard.findMany({
    where: { boardId: board.id },
    include: { author: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <IdeationClient
      boardId={board.id}
      initial={JSON.parse(JSON.stringify(cards))}
    />
  );
}
