import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().nullable().optional(),
  content: z.any().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { slug } = await params;
  const data = patchSchema.parse(await req.json());
  const article = await db.article.update({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
    data: {
      ...data,
      publishedAt:
        data.status === "PUBLISHED" ? new Date() : undefined,
    },
  });
  return NextResponse.json(article);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { slug } = await params;
  await db.article.delete({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
  });
  return NextResponse.json({ ok: true });
}
