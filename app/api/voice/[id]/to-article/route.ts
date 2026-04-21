import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { slugify } from "@/lib/utils";
import { nanoid } from "nanoid";

/**
 * PRD taslağından Tiptap JSON dokümanı ve gerçek Article kaydı üretir.
 * Aynı zamanda PRD'nin önerdiği epic/task'ları workspace'e ekler.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { workspace, session } = await requireWorkspace();
  const { id } = await params;

  const rec = await db.voiceRecording.findFirst({
    where: { id, workspaceId: workspace.id },
  });
  if (!rec || !rec.prdDraft) {
    return NextResponse.json({ error: "PRD yok" }, { status: 404 });
  }
  const prd: any = rec.prdDraft;

  const content = prdToTiptap(prd);
  let slug = slugify(prd.title ?? "PRD");
  const exists = await db.article.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
  });
  if (exists) slug = `${slug}-${nanoid(4)}`;

  const article = await db.article.create({
    data: {
      workspaceId: workspace.id,
      slug,
      title: prd.title ?? "PRD Taslağı",
      subtitle: prd.subtitle ?? null,
      content,
      status: "DRAFT",
      authorId: session.user.id,
    },
  });

  // Epics + tasks öner
  const createdEpics: any[] = [];
  if (Array.isArray(prd.epics)) {
    for (const e of prd.epics) {
      const all = await db.epic.findMany({
        where: { workspaceId: workspace.id },
        select: { key: true },
      });
      const nums = all
        .map((x) => parseInt(x.key.split("-")[1], 10))
        .filter((n) => !isNaN(n));
      const nextNum = nums.length ? Math.max(...nums) + 1 : 1;
      const key = `EP-${nextNum}`;
      const epic = await db.epic.create({
        data: {
          workspaceId: workspace.id,
          key,
          title: e.title ?? "Untitled epic",
          summary: e.summary ?? null,
          createdById: session.user.id,
        },
      });
      createdEpics.push(epic);
      if (Array.isArray(e.tasks)) {
        for (const t of e.tasks) {
          const allT = await db.task.findMany({
            where: { workspaceId: workspace.id },
            select: { key: true },
          });
          const numsT = allT
            .map((x) => parseInt(x.key.split("-")[1], 10))
            .filter((n) => !isNaN(n));
          const nextT = numsT.length ? Math.max(...numsT) + 1 : 1;
          await db.task.create({
            data: {
              workspaceId: workspace.id,
              key: `T-${nextT}`,
              title: typeof t === "string" ? t : t.title ?? "Task",
              epicId: epic.id,
              createdById: session.user.id,
            },
          });
        }
      }
    }
  }

  await db.voiceRecording.update({
    where: { id },
    data: { articleId: article.id },
  });

  return NextResponse.json({
    article,
    epics: createdEpics,
  });
}

function p(text: string, dataId = nanoid(8)) {
  return {
    type: "paragraph",
    attrs: { "data-id": dataId },
    content: [{ type: "text", text }],
  };
}
function h(level: 1 | 2 | 3, text: string) {
  return {
    type: "heading",
    attrs: { level, "data-id": nanoid(8) },
    content: [{ type: "text", text }],
  };
}
function bullets(items: string[]) {
  return {
    type: "bulletList",
    attrs: { "data-id": nanoid(8) },
    content: items.map((it) => ({
      type: "listItem",
      content: [
        {
          type: "paragraph",
          attrs: { "data-id": nanoid(8) },
          content: [{ type: "text", text: it }],
        },
      ],
    })),
  };
}

function prdToTiptap(prd: any) {
  const doc: any = { type: "doc", content: [] as any[] };

  if (prd.problem) {
    doc.content.push(h(2, "Problem"));
    doc.content.push(p(String(prd.problem)));
  }
  if (Array.isArray(prd.users) && prd.users.length) {
    doc.content.push(h(2, "Hedef kullanıcı"));
    doc.content.push(bullets(prd.users.map(String)));
  }
  if (Array.isArray(prd.goals) && prd.goals.length) {
    doc.content.push(h(2, "Hedefler"));
    doc.content.push(bullets(prd.goals.map(String)));
  }
  if (Array.isArray(prd.nonGoals) && prd.nonGoals.length) {
    doc.content.push(h(2, "Kapsam dışı"));
    doc.content.push(bullets(prd.nonGoals.map(String)));
  }
  if (Array.isArray(prd.userStories) && prd.userStories.length) {
    doc.content.push(h(2, "Kullanıcı hikayeleri"));
    doc.content.push(
      bullets(
        prd.userStories.map((s: any) =>
          typeof s === "string"
            ? s
            : `Bir ${s.role ?? "kullanıcı"} olarak ${s.want ?? "..."} istiyorum, çünkü ${s.benefit ?? "..."}.`,
        ),
      ),
    );
  }
  if (Array.isArray(prd.requirements) && prd.requirements.length) {
    doc.content.push(h(2, "Gereksinimler"));
    for (const r of prd.requirements) {
      doc.content.push(h(3, `${r.title ?? "Gereksinim"} (${r.priority ?? "MEDIUM"})`));
      if (r.detail) doc.content.push(p(String(r.detail)));
    }
  }
  if (Array.isArray(prd.epics) && prd.epics.length) {
    doc.content.push(h(2, "Önerilen epic'ler"));
    for (const e of prd.epics) {
      doc.content.push(h(3, String(e.title ?? "Epic")));
      if (e.summary) doc.content.push(p(String(e.summary)));
      if (Array.isArray(e.tasks) && e.tasks.length) {
        doc.content.push(
          bullets(e.tasks.map((t: any) => (typeof t === "string" ? t : t.title ?? ""))),
        );
      }
    }
  }
  if (Array.isArray(prd.risks) && prd.risks.length) {
    doc.content.push(h(2, "Riskler"));
    doc.content.push(bullets(prd.risks.map(String)));
  }
  if (Array.isArray(prd.successMetrics) && prd.successMetrics.length) {
    doc.content.push(h(2, "Başarı metrikleri"));
    doc.content.push(bullets(prd.successMetrics.map(String)));
  }
  if (doc.content.length === 0) {
    doc.content.push(p("PRD boş geldi."));
  }
  return doc;
}
