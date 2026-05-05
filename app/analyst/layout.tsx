import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysts — BottomUP",
  description:
    "Performance, success metrics and referral codes for analysts on BottomUP.",
};

const LOGO_WORDMARK =
  "https://www.bottomup.app/_next/image?url=%2Flogos%2Flogotype-color-light.png&w=256&q=75";

const APP_STORE_URL =
  "https://apps.apple.com/tr/app/bottomup-sofi-trade-finance/id1661474993";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.bottomup.bottomupapp";

function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.5 12.5c-.03-3.04 2.48-4.5 2.59-4.57-1.41-2.06-3.61-2.34-4.39-2.37-1.87-.19-3.66 1.1-4.61 1.1-.95 0-2.42-1.07-3.97-1.04-2.04.03-3.92 1.19-4.97 3-2.12 3.68-.54 9.13 1.52 12.13 1.01 1.47 2.21 3.12 3.78 3.06 1.52-.06 2.1-.99 3.94-.99 1.84 0 2.36.99 3.97.95 1.64-.03 2.68-1.49 3.68-2.97 1.16-1.7 1.64-3.36 1.66-3.45-.04-.01-3.18-1.22-3.21-4.85zM14.61 4.27c.83-1.01 1.39-2.41 1.24-3.81-1.2.05-2.65.81-3.51 1.81-.77.89-1.45 2.32-1.27 3.7 1.34.1 2.71-.68 3.54-1.7z" />
    </svg>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M4 2.5L15.5 12 4 21.5V2.5z"
        fill="currentColor"
        opacity="0.95"
      />
    </svg>
  );
}

export default function AnalystLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-orange-500/30">
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur border-b border-white/5">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-4">
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
          <div className="flex items-center gap-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Download on the App Store"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 sm:px-3 sm:py-2 sm:text-sm"
            >
              <AppleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">App Store</span>
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Get it on Google Play"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 sm:px-3 sm:py-2 sm:text-sm"
            >
              <PlayIcon className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">Google Play</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} BottomUP. Lab — bupcore.ai
      </footer>
    </div>
  );
}
