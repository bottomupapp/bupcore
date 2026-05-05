"use client";

import { useEffect, useState } from "react";

const FORMATS = [
  {
    key: "twitter" as const,
    label: "TWITTER / X",
    sublabel: "1200 × 675",
    aspect: 1200 / 675,
  },
  {
    key: "square" as const,
    label: "INSTAGRAM",
    sublabel: "1080 × 1080",
    aspect: 1,
  },
  {
    key: "story" as const,
    label: "STORY / TIKTOK",
    sublabel: "1080 × 1920",
    aspect: 1080 / 1920,
  },
];

/**
 * Floating "Share" trigger + modal sheet with three platform-tuned PNG
 * previews. Each card is the live `/analyst/<name>/og/<format>` PNG —
 * the trader can right-click save, or hit the Download button which
 * pulls the PNG via fetch and triggers a save dialog.
 */
export function ShareButton({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while open + close on Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hair-btn solid"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 65,
          padding: "12px 18px",
          fontSize: 12,
          letterSpacing: "0.16em",
        }}
        aria-label="Share trader card"
      >
        ◉ SHARE
      </button>
      {open ? <ShareModal name={name} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ShareModal({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "60px 24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 1100,
          background: "var(--bg)",
          border: "1px solid var(--acid)",
          padding: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: "var(--acid)" }}>
              // SHARE_KIT
            </div>
            <div
              className="display"
              style={{ fontSize: 36, marginTop: 6, color: "var(--ink)" }}
            >
              {name.toUpperCase()}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--line-2)",
              color: "var(--ink-2)",
              padding: "8px 14px",
              fontSize: 12,
              letterSpacing: "0.16em",
              cursor: "pointer",
            }}
          >
            CLOSE ✕
          </button>
        </div>
        <p
          style={{
            color: "var(--ink-2)",
            fontSize: 13,
            maxWidth: 640,
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          Platform-tuned PNG cards. Pick a format, hit DOWNLOAD, post on
          Twitter / Instagram / TikTok. Updates every time a trade closes.
        </p>
        <div
          className="share-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {FORMATS.map((fmt) => (
            <SharePreview key={fmt.key} name={name} format={fmt} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SharePreview({
  name,
  format,
}: {
  name: string;
  format: (typeof FORMATS)[number];
}) {
  const [downloading, setDownloading] = useState(false);
  const [bust, setBust] = useState(0);
  const url = `/analyst/${encodeURIComponent(name)}/og/${format.key}`;
  const previewUrl = bust > 0 ? `${url}?b=${bust}` : url;

  const onDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${url}?b=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `bottomup-${name}-${format.key}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("share download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        border: "1px solid var(--line-2)",
        background: "var(--bg-2)",
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div
          className="eyebrow"
          style={{ color: "var(--ink-2)", fontSize: 11 }}
        >
          {format.label}
        </div>
        <div className="num" style={{ color: "var(--ink-3)", fontSize: 11 }}>
          {format.sublabel}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          aspectRatio: String(format.aspect),
          background: "var(--bg-3)",
          border: "1px solid var(--line-2)",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={`${name} ${format.label} share card`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          className="hair-btn solid"
          style={{
            flex: 1,
            padding: "10px 14px",
            fontSize: 11,
            letterSpacing: "0.16em",
            cursor: downloading ? "wait" : "pointer",
            opacity: downloading ? 0.6 : 1,
          }}
        >
          {downloading ? "…" : "↓ DOWNLOAD"}
        </button>
        <button
          type="button"
          onClick={() => setBust(Date.now())}
          className="hair-btn"
          style={{
            padding: "10px 14px",
            fontSize: 11,
            letterSpacing: "0.16em",
          }}
          title="Refresh preview"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
