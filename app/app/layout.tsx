import Link from "next/link";
import { headers } from "next/headers";
import { requireWorkspace } from "@/lib/workspace";
import {
  Lightbulb,
  KanbanSquare,
  Layers,
  FileText,
  Mic,
  Home,
  LogOut,
} from "lucide-react";

async function getCsrfToken(baseUrl: string): Promise<string> {
  try {
    const res = await fetch(`${baseUrl}/api/auth/csrf`, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    return data.csrfToken ?? "";
  } catch {
    return "";
  }
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, workspace } = await requireWorkspace();

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const csrfToken = await getCsrfToken(`${proto}://${host}`);

  const nav = [
    { href: "/app", label: "Pano", icon: Home },
    { href: "/app/ideation", label: "Ideation", icon: Lightbulb },
    { href: "/app/board", label: "Sprint Board", icon: KanbanSquare },
    { href: "/app/epics", label: "Epic & Task", icon: Layers },
    { href: "/app/articles", label: "Makaleler", icon: FileText },
    { href: "/app/voice", label: "Ses → PRD", icon: Mic },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="px-5 py-4 border-b border-border">
          <Link href="/app" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-accent" />
            <span className="font-semibold tracking-tight">Studio</span>
          </Link>
          <p className="mt-2 text-xs text-muted">{workspace.name}</p>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-border/40"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>

        <form
          action="/api/auth/signout"
          method="POST"
          className="p-2 border-t border-border"
        >
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/" />
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <div className="h-6 w-6 rounded-full bg-accent/20 grid place-items-center text-xs font-medium">
              {session.user?.name?.[0]?.toUpperCase() ??
                session.user?.email?.[0]?.toUpperCase() ??
                "?"}
            </div>
            <div className="flex-1 truncate">
              <div className="truncate">{session.user?.name ?? session.user?.email}</div>
            </div>
            <button
              aria-label="Çıkış"
              className="text-muted hover:text-fg"
              title="Çıkış yap"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </form>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
