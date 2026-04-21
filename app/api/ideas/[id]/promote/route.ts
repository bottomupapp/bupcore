import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { nextKey } from "@/lib/utils";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { workspace, session } = await requireWorkspace();
  const { id } = await params;

  const card = await db.ideationCard.findUnique({ where: { id } });
  if (!card) return NextResponse.json({ error: "not found" }, { status: 404 });

  const all = await db.epic.findMany({
    where: { workspaceId: workspace.id },
    select: { key: true },
  });
  const key = nextKey(
    all.map((e) => e.key),
    "EP",
  );

  const epic = await db.epic.create({
    data: {
      workspaceId: workspace.id,
      key,
      title: card.title,
      summary: card.body,
      color: card.color,
      createdById: session.user.id,
    },
  });

  await db.ideationCard.update({
    where: { id },
    data: { status: "PROMOTED", promotedToEpicId: epic.id },
  });

  return NextResponse.json({ epic });
}
