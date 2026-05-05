"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Variant = "chip" | "cta";

export function CopyCodeButton({
  code,
  variant = "chip",
  label,
}: {
  code: string;
  variant?: Variant;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Older browsers / non-HTTPS — fail silently.
    }
  }

  if (variant === "cta") {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy referral code ${code}`}
        className="group inline-flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-left transition hover:border-emerald-400/60 hover:bg-emerald-400/15 sm:w-auto"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/80">
            {label ?? "Referral code"}
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-emerald-100 sm:text-xl">
            {code.toUpperCase()}
          </span>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-zinc-950 transition group-hover:bg-emerald-400">
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy referral code ${code}`}
      className="group inline-flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-400/15"
    >
      <span>{code}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-300" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-emerald-300/80 group-hover:text-emerald-200" />
      )}
    </button>
  );
}
