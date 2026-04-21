import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Landing() {
  const session = await auth();
  if (session?.user) redirect("/app");

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <header className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent" />
          <span className="text-lg font-semibold tracking-tight">Studio</span>
        </div>
        <Link href="/auth/signin" className="btn-primary">
          Giriş yap
        </Link>
      </header>

      <section className="max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Jira'yı unut. <br />
          Fikirden ürüne, tek çatı altında.
        </h1>
        <p className="mt-6 text-lg text-muted leading-relaxed">
          Ideation board'da fikir topla, sprint planla, epic ve task'ları
          yönet. Sesle anlat, Claude PRD'ye çevirsin. Medium tarzı makalelerde
          ürün hikayeni yaz, paragrafı epic'e bağla.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/auth/signin" className="btn-primary">
            Başla
          </Link>
          <a
            href="#features"
            className="btn-outline"
          >
            Neler var?
          </a>
        </div>
      </section>

      <section id="features" className="mt-24 grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Ideation board",
            body: "Sticky note'larla fikir topla, oyla, etiketle. Bir tıkla epic'e yükselt.",
          },
          {
            title: "Sprint planlama",
            body: "Kanban board üstünde sürükle-bırak. Aktif sprint, backlog ve done kolonları.",
          },
          {
            title: "Epic + Task",
            body: "Büyük işleri epic olarak tanımla, altına task kır. Renkli, anlaşılır, sade.",
          },
          {
            title: "Ses → PRD",
            body: "Bir düğmeye bas, anlat. Claude senin yerine problem, kullanıcı hikayeleri ve gereksinimleri çıkarsın.",
          },
          {
            title: "Medium tarzı makaleler",
            body: "Product plan'larını yazı tadında yaz. Ekibe anlat, arşivle.",
          },
          {
            title: "Makale ↔ Epic bağlama",
            body: "Yazdığın her paragrafı epic ya da task'a bağla. Bağlam kaybolmasın.",
          },
        ].map((f) => (
          <div key={f.title} className="card p-5">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="mt-24 text-sm text-muted">
        © {new Date().getFullYear()} Studio. Railway üzerinde çalışır.
      </footer>
    </main>
  );
}
