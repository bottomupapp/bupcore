import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const providers: any[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    }),
  );
} else if (process.env.EMAIL_SERVER_HOST) {
  providers.push(
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  providers,
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Yeni kullanıcıyı otomatik olarak "demo" workspace'e MEMBER olarak bağla.
      const ws = await db.workspace.findUnique({ where: { slug: "demo" } });
      if (ws && user.id) {
        await db.membership.upsert({
          where: { userId_workspaceId: { userId: user.id, workspaceId: ws.id } },
          update: {},
          create: { userId: user.id, workspaceId: ws.id, role: "MEMBER" },
        });
      }
    },
  },
});
