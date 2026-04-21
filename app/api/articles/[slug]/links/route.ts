import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { z } from "zod";

const schema = z.object({
  blockId: z.string().min(1),
  epicId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { slug } = await params;
  const data = schema.parse(await req.json());

  const article = await db.article.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
  });
  if (!article) return NextResponse.json({ error: "not found" }, { status: 404 });

  const link = await db.articleLink.create({
    data: {
      articleId: article.id,
      blockId: data.blockId,
      epicId: data.epicId ?? null,
      taskId: data.taskId ?? null,
      label: data.label ?? null,
    },
    include: {
      epic: { select: { id: true, key: true, title: true, color: true } },
      task: { select: { id: true, key: true, title: true } },
    },
  });
  return NextResponse.json(link);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
    include: {
      links: {
        include: {
          epic: { select: { id: true, key: true, title: true, color: true } },
          task: { select: { id: true, key: true, title: true } },
        },
      },
    },
  });
  return NextResponse.json(article?.links ?? []);
}
