import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { id } = await params;
  const body = await req.json();
  if (body.active === true) {
    await db.sprint.updateMany({
      where: { workspaceId: workspace.id, active: true, NOT: { id } },
      data: { active: false },
    });
  }
  const sprint = await db.sprint.update({
    where: { id, workspaceId: workspace.id },
    data: {
      name: body.name ?? undefined,
      goal: body.goal ?? undefined,
      active: body.active ?? undefined,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
    },
  });
  return NextResponse.json(sprint);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { workspace } = await requireWorkspace();
  const { id } = await params;
  await db.sprint.delete({ where: { id, workspaceId: workspace.id } });
  return NextResponse.json({ ok: true });
}
