import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bottomup Analysts",
  description:
    "Performance, success metrics and referral codes for analysts on Bottomup.",
};

export default function AnalystLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface/70 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/analyst" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-accent" />
            <span className="font-semibold tracking-tight">
              Bottomup Analyst
            </span>
          </Link>
          <a
            href="https://bottomup.app"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted hover:text-fg"
          >
            bottomup.app →
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Bottomup. Lab — bupcore.ai
      </footer>
    </div>
  );
}
