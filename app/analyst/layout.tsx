import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysts — BottomUP",
  description:
    "Performance, success metrics and referral codes for analysts on BottomUP.",
};

export default function AnalystLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 antialiased">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-zinc-200/70">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <Link
            href="/analyst"
            className="flex items-center gap-2 text-zinc-900 hover:opacity-80"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-900 text-white text-xs font-bold">
              B
            </span>
            <span className="font-semibold tracking-tight">BottomUP</span>
            <span className="ml-1 hidden sm:inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              Analyst
            </span>
          </Link>
          <a
            href="https://bottomup.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 sm:px-4 sm:py-2 sm:text-sm"
          >
            Open BottomUP
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} BottomUP. Lab — bupcore.ai
      </footer>
    </div>
  );
}
