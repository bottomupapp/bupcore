import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import { nanoid } from "nanoid";

const createSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  content: z.any().optional(),
});

export async function POST(req: Request) {
  const { workspace, session } = await requireWorkspace();
  const data = createSchema.parse(await req.json());
  let slug = slugify(data.title) || nanoid(8);
  const exists = await db.article.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
  });
  if (exists) slug = `${slug}-${nanoid(4)}`;

  const article = await db.article.create({
    data: {
      workspaceId: workspace.id,
      slug,
      title: data.title,
      subtitle: data.subtitle ?? null,
      content:
        data.content ?? {
          type: "doc",
          content: [
            { type: "paragraph", content: [] },
          ],
        },
      authorId: session.user.id,
    },
  });
  return NextResponse.json(article);
}

export async function GET() {
  const { workspace } = await requireWorkspace();
  const list = await db.article.findMany({
    where: { workspaceId: workspace.id },
    include: { author: { select: { name: true, email: true, image: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(list);
}
