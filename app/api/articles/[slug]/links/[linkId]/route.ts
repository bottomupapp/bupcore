import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string; linkId: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { slug, linkId } = await params;
  const article = await db.article.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
  });
  if (!article) return NextResponse.json({ error: "not found" }, { status: 404 });
  await db.articleLink.delete({
    where: { id: linkId },
  });
  return NextResponse.json({ ok: true });
}
