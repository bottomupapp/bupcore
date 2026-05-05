"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "./icons";
import { LangPicker } from "./lang-picker";
import { tFor, type Locale } from "./i18n";

const APP_STORE_URL =
  "https://apps.apple.com/tr/app/bottomup-sofi-trade-finance/id1661474993";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.bottomup.bottomupapp";

export function TopBar({
  crumb,
  locale = "en",
}: {
  crumb?: string;
  locale?: Locale;
}) {
  const t = tFor(locale);
  const [now, setNow] = useState<Date | null>(null);
  // Hydration-safe: render time only client-side after mount.
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now ? now.toISOString().slice(11, 19) : "--:--:--";

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid var(--line-2)",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link href="/analyst" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image
              src="/brand/logo-dark.png"
              alt="BottomUP"
              width={108}
              height={22}
              priority
              style={{ display: "block" }}
            />
          </Link>
          <span style={{ height: 16, width: 1, background: "var(--line-2)" }} />
          <span className="eyebrow" style={{ color: "var(--ink-2)" }}>
            {crumb ?? "/ ANALYST"}
          </span>
        </div>
        <div className="top-bar-right" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="num" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".06em" }}>
            <span className="blink" style={{ color: "var(--acid)" }}>
              ●
            </span>{" "}
            {t("live")} · UTC {time}
          </span>
          <LangPicker current={locale} />
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="hair-btn"
          >
            <Plus /> APP STORE
          </a>
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noreferrer"
            className="hair-btn solid"
          >
            <ArrowRight /> GOOGLE PLAY
          </a>
        </div>
      </div>
    </div>
  );
}

export function TickerTape({
  items,
}: {
  items: Array<{ k: string; v: string; up?: boolean | null }>;
}) {
  // Loop the list twice so the CSS keyframes that translate -50% give a
  // seamless wrap.
  const list = [...items, ...items];
  return (
    <div
      style={{
        background: "var(--bg-2)",
        borderBottom: "1px solid var(--line-2)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        letterSpacing: ".05em",
        color: "var(--ink-2)",
      }}
    >
      <div className="tape-track" style={{ padding: "8px 0" }}>
        {list.map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--ink-3)" }}>{t.k}</span>
            <span
              style={{
                color:
                  t.up === false
                    ? "var(--warn)"
                    : t.up === true
                      ? "var(--acid)"
                      : "var(--ink)",
              }}
            >
              {t.v}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
