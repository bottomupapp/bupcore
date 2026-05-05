"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

type Variant = "step" | "compact";

export function CopyCode({
  code,
  variant = "step",
}: {
  code: string;
  variant?: Variant;
}) {
  const [copied, setCopied] = useState(false);
  const onClick = () => {
    try {
      navigator.clipboard?.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Copy referral code ${code}`}
        className="hair-btn"
        style={{ borderColor: "var(--acid)", color: "var(--acid)" }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "COPIED" : code.toUpperCase()}
      </button>
    );
  }

  // Default: full "STEP 02 · USE CODE [CODE] [COPY]" — used in the hero strip.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy referral code ${code}`}
      style={{
        border: 0,
        background: "var(--acid)",
        color: "var(--bg)",
        padding: "20px 28px",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        width: "100%",
      }}
    >
      <div>
        <div className="eyebrow" style={{ color: "rgba(0,0,0,.55)", whiteSpace: "nowrap" }}>
          STEP 02 · USE CODE
        </div>
        <div
          className="display num"
          style={{
            fontSize: 38,
            color: "var(--bg)",
            marginTop: 4,
            letterSpacing: "0.04em",
          }}
        >
          {code.toUpperCase()}
        </div>
      </div>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--bg)",
          padding: "8px 14px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".14em",
          textTransform: "uppercase",
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "COPIED" : "COPY"}
      </span>
    </button>
  );
}
