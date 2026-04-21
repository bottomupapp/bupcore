import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { nextKey } from "@/lib/utils";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  epicId: z.string().optional().nullable(),
  sprintId: z.string().optional().nullable(),
  status: z
    .enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  const { workspace, session } = await requireWorkspace();
  const body = await req.json();
  const data = createSchema.parse(body);

  const all = await db.task.findMany({
    where: { workspaceId: workspace.id },
    select: { key: true },
  });
  const key = nextKey(
    all.map((t) => t.key),
    "T",
  );

  const task = await db.task.create({
    data: {
      workspaceId: workspace.id,
      key,
      title: data.title,
      description: data.description ?? null,
      epicId: data.epicId ?? null,
      sprintId: data.sprintId ?? null,
      status: data.status ?? "BACKLOG",
      priority: data.priority ?? "MEDIUM",
      createdById: session.user.id,
    },
  });

  return NextResponse.json(task);
}

export async function GET(req: Request) {
  const { workspace } = await requireWorkspace();
  const { searchParams } = new URL(req.url);
  const sprintId = searchParams.get("sprintId");
  const epicId = searchParams.get("epicId");

  const tasks = await db.task.findMany({
    where: {
      workspaceId: workspace.id,
      ...(sprintId ? { sprintId } : {}),
      ...(epicId ? { epicId } : {}),
    },
    include: {
      epic: { select: { id: true, key: true, title: true, color: true } },
      assignee: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(tasks);
}
