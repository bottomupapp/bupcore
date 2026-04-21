import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().optional(),
  summary: z.string().nullable().optional(),
  color: z.string().optional(),
  status: z
    .enum(["IDEA", "DISCOVERY", "IN_PROGRESS", "SHIPPED", "ARCHIVED"])
    .optional(),
  order: z.number().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { id } = await params;
  const data = patchSchema.parse(await req.json());
  const epic = await db.epic.update({
    where: { id, workspaceId: workspace.id },
    data,
  });
  return NextResponse.json(epic);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { id } = await params;
  await db.epic.delete({ where: { id, workspaceId: workspace.id } });
  return NextResponse.json({ ok: true });
}
