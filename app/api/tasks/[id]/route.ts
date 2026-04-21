import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  epicId: z.string().nullable().optional(),
  sprintId: z.string().nullable().optional(),
  status: z
    .enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  order: z.number().optional(),
  estimate: z.number().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { id } = await params;
  const body = await req.json();
  const data = patchSchema.parse(body);

  const task = await db.task.update({
    where: { id, workspaceId: workspace.id },
    data,
  });
  return NextResponse.json(task);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { id } = await params;
  await db.task.delete({ where: { id, workspaceId: workspace.id } });
  return NextResponse.json({ ok: true });
}
