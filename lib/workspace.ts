import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

/** Oturumu ve kullanıcının ilk workspace'ini getirir; yoksa /auth/signin'a yönlendirir. */
export async function requireWorkspace() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const userId = session.user.id;
  const membership = await db.membership.findFirst({
    where: { userId },
    include: { workspace: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    // Yeni kullanıcıya demo ws ekle (event'te zaten yapılıyor ama fallback).
    let ws = await db.workspace.findUnique({ where: { slug: "demo" } });
    if (!ws) {
      ws = await db.workspace.create({
        data: { name: "Demo Workspace", slug: "demo" },
      });
    }
    await db.membership.create({
      data: { userId, workspaceId: ws.id, role: "OWNER" },
    });
    return { session, workspace: ws };
  }

  return { session, workspace: membership.workspace };
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}
