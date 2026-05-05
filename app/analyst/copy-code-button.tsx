"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Older browsers / non-HTTPS — surface visually but stay quiet.
        }
      }}
      className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-xs font-mono hover:bg-border/40"
      aria-label={`Copy referral code ${code}`}
    >
      <span>{code}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted group-hover:text-fg" />
      )}
    </button>
  );
}
