import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { nextKey } from "@/lib/utils";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  color: z.string().optional(),
  status: z
    .enum(["IDEA", "DISCOVERY", "IN_PROGRESS", "SHIPPED", "ARCHIVED"])
    .optional(),
});

export async function POST(req: Request) {
  const { workspace, session } = await requireWorkspace();
  const body = await req.json();
  const data = createSchema.parse(body);

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
      title: data.title,
      summary: data.summary ?? null,
      color: data.color ?? "#6366F1",
      status: data.status ?? "IDEA",
      createdById: session.user.id,
    },
  });
  return NextResponse.json(epic);
}

export async function GET() {
  const { workspace } = await requireWorkspace();
  const epics = await db.epic.findMany({
    where: { workspaceId: workspace.id },
    include: { _count: { select: { tasks: true } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(epics);
}
