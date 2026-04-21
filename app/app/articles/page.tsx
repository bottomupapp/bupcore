import Link from "next/link";
import { requireWorkspace } from "@/lib/workspace";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import NewArticleButton from "./new-button";

export default async function ArticlesPage() {
  const { workspace } = await requireWorkspace();
  const articles = await db.article.findMany({
    where: { workspaceId: workspace.id },
    include: {
      author: { select: { name: true, email: true, image: true } },
      _count: { select: { links: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Makaleler</h1>
          <p className="text-sm text-muted">
            Medium tadında ürün makaleleri. Paragrafı epic'e bağla, bağlamı
            kaybetme.
          </p>
        </div>
        <NewArticleButton />
      </div>

      {articles.length === 0 && (
        <div className="card p-8 text-center text-muted">
          Henüz makale yok. Sağ üstten ilk makaleni yaz.
        </div>
      )}

      <div className="divide-y divide-border">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/app/articles/${a.slug}`}
            className="block py-5 hover:bg-border/10 px-2 -mx-2 rounded-lg"
          >
            <div className="flex items-center gap-2 text-xs text-muted mb-1">
              <span>{a.author?.name ?? a.author?.email ?? "—"}</span>
              <span>·</span>
              <span>{formatDate(a.updatedAt)}</span>
              <span className="chip">{a.status}</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">{a.title}</h2>
            {a.subtitle && (
              <p className="text-muted mt-1">{a.subtitle}</p>
            )}
            <div className="mt-2 text-xs text-muted">
              {a._count.links} bağlantı
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
