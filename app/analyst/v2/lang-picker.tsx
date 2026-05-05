"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES, type Locale } from "./i18n";

/**
 * Language switcher. Hairline pill that opens a dropdown of all 10
 * locales BottomUP supports. Selection is persisted via the `lang`
 * query param so shareable URLs encode the language. Clicking the
 * page sticks to it; the modal closes on outside click via the
 * native dropdown overlay.
 */
export function LangPicker({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const select = (next: Locale) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (next === "en") params.delete("lang");
    else params.set("lang", next);
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "flex" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hair-btn"
        style={{
          padding: "8px 12px",
          fontSize: 11,
          letterSpacing: "0.16em",
          fontWeight: 700,
        }}
        aria-label="Change language"
      >
        ⌘ {LOCALE_LABELS[current]}
      </button>
      {open ? (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 64,
              background: "transparent",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              zIndex: 65,
              background: "var(--bg)",
              border: "1px solid var(--acid)",
              minWidth: 200,
              padding: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {LOCALES.map((l) => {
              const active = l === current;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => select(l)}
                  style={{
                    background: active ? "var(--acid)" : "transparent",
                    color: active ? "var(--bg)" : "var(--ink-2)",
                    border: 0,
                    padding: "10px 14px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.14em",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{LOCALE_LABELS[l]}</span>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: 0,
                      fontWeight: 500,
                      textTransform: "none",
                      color: active ? "var(--bg)" : "var(--ink-3)",
                    }}
                  >
                    {LOCALE_NAMES[l]}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
