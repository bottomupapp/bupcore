import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysts — BottomUP",
  description:
    "Performance, success metrics and referral codes for analysts on BottomUP.",
};

const LOGO_WORDMARK =
  "https://www.bottomup.app/_next/image?url=%2Flogos%2Flogotype-color-light.png&w=256&q=75";

export default function AnalystLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-orange-500/30">
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur border-b border-white/5">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <Link
            href="/analyst"
            className="flex items-center gap-3 hover:opacity-90"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_WORDMARK}
              alt="BottomUP"
              width={120}
              height={24}
              className="h-6 w-auto md:h-7"
              referrerPolicy="no-referrer"
            />
            <span className="hidden sm:inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
              Analyst
            </span>
          </Link>
          <a
            href="https://bottomup.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-200 sm:px-4 sm:py-2 sm:text-sm"
          >
            Open BottomUP
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} BottomUP. Lab — bupcore.ai
      </footer>
    </div>
  );
}
