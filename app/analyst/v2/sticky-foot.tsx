"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Plus } from "./icons";
import { CopyCode } from "./copy-code";
import { tFor, type Locale } from "./i18n";

const APP_STORE_URL =
  "https://apps.apple.com/tr/app/bottomup-sofi-trade-finance/id1661474993";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.bottomup.bottomupapp";

export function StickyFoot({
  name,
  avatar,
  referralCode,
  locale = "en",
}: {
  name: string;
  avatar: string | null;
  referralCode: string | null;
  locale?: Locale;
}) {
  const t = tFor(locale);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 720);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        transform: `translateY(${show ? 0 : 100}%)`,
        transition: "transform .3s ease",
        zIndex: 60,
        background: "var(--bg)",
        borderTop: "1px solid var(--acid)",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              style={{ width: 32, height: 32, border: "1px solid var(--line-2)" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span
              style={{
                width: 32,
                height: 32,
                border: "1px solid var(--line-2)",
                background: "var(--bg-2)",
                color: "var(--ink-3)",
                display: "inline-grid",
                placeItems: "center",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {name[0]?.toUpperCase() ?? "?"}
            </span>
          )}
          <div>
            <div className="eyebrow" style={{ color: "var(--ink-3)" }}>
              {t("follow", { name: name.toUpperCase() })}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 2 }}>
              {t("useCodeBound")}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {referralCode ? <CopyCode code={referralCode} variant="compact" locale={locale} /> : null}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="hair-btn sticky-foot-cta"
          >
            <Plus /> APP STORE
          </a>
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noreferrer"
            className="hair-btn solid sticky-foot-cta"
          >
            <ArrowRight /> GOOGLE PLAY
          </a>
        </div>
      </div>
    </div>
  );
}
