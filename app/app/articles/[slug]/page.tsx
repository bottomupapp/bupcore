import { notFound } from "next/navigation";
import { requireWorkspace } from "@/lib/workspace";
import { db } from "@/lib/db";
import ArticleEditor from "./editor-client";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
  if (!article) notFound();

  const epics = await db.epic.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "asc" },
  });
  const tasks = await db.task.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <ArticleEditor
      article={JSON.parse(JSON.stringify(article))}
      epics={JSON.parse(JSON.stringify(epics))}
      tasks={JSON.parse(JSON.stringify(tasks))}
    />
  );
}
