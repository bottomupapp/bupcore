import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { z } from "zod";

const schema = z.object({
  boardId: z.string().optional(),
  title: z.string().min(1),
  body: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const { workspace, session } = await requireWorkspace();
  const data = schema.parse(await req.json());

  let boardId = data.boardId;
  if (!boardId) {
    const any = await db.ideationBoard.findFirst({
      where: { workspaceId: workspace.id },
    });
    const board =
      any ??
      (await db.ideationBoard.create({
        data: { workspaceId: workspace.id, name: "Genel fikirler" },
      }));
    boardId = board.id;
  }

  const card = await db.ideationCard.create({
    data: {
      boardId,
      title: data.title,
      body: data.body ?? null,
      color: data.color ?? "#FDE68A",
      tags: data.tags ?? [],
      authorId: session.user.id,
    },
  });
  return NextResponse.json(card);
}

export async function GET() {
  const { workspace } = await requireWorkspace();
  const cards = await db.ideationCard.findMany({
    where: { board: { workspaceId: workspace.id } },
    include: { author: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(cards);
}
