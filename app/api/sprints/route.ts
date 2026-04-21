import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  goal: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  active: z.boolean().optional(),
});

export async function POST(req: Request) {
  const { workspace } = await requireWorkspace();
  const data = createSchema.parse(await req.json());
  if (data.active) {
    await db.sprint.updateMany({
      where: { workspaceId: workspace.id, active: true },
      data: { active: false },
    });
  }
  const sprint = await db.sprint.create({
    data: {
      workspaceId: workspace.id,
      name: data.name,
      goal: data.goal ?? null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
      active: data.active ?? false,
    },
  });
  return NextResponse.json(sprint);
}

export async function GET() {
  const { workspace } = await requireWorkspace();
  const sprints = await db.sprint.findMany({
    where: { workspaceId: workspace.id },
    orderBy: [{ active: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(sprints);
}
