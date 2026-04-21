import Link from "next/link";
import { requireWorkspace } from "@/lib/workspace";
import { db } from "@/lib/db";
import EpicsClient from "./epics-client";

export default async function EpicsPage() {
  const { workspace } = await requireWorkspace();
  const epics = await db.epic.findMany({
    where: { workspaceId: workspace.id },
    include: { _count: { select: { tasks: true } } },
    orderBy: { order: "asc" },
  });
  return <EpicsClient initial={JSON.parse(JSON.stringify(epics))} />;
}
