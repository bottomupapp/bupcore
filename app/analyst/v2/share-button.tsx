"use client";

import { useEffect, useState } from "react";
import { tFor, type Locale, type StringKey } from "./i18n";

const FORMATS = [
  {
    key: "twitter" as const,
    labelKey: "shareTwitter" as const,
    sublabel: "1200 × 675",
    aspect: 1200 / 675,
  },
  {
    key: "square" as const,
    labelKey: "shareInstagram" as const,
    sublabel: "1080 × 1080",
    aspect: 1,
  },
  {
    key: "story" as const,
    labelKey: "shareStory" as const,
    sublabel: "1080 × 1920",
    aspect: 1080 / 1920,
  },
];

/**
 * Hero stat the OG route should render. `auto` runs the marketability
 * auto-pick (the original behavior); the rest force a specific window
 * + metric so the trader can choose which story their card tells.
 * Mirrors the `MetricKey` union in `og/[format]/route.tsx`.
 */
type MetricKey =
  | "auto"
  | "pnl-30d"
  | "pnl-all"
  | "return-30d"
  | "return-all"
  | "wr-30d"
  | "wr-all"
  | "equity-30d"
  | "equity-all";

const METRIC_OPTIONS: ReadonlyArray<{ key: MetricKey; labelKey: StringKey }> = [
  { key: "auto", labelKey: "metricAuto" },
  { key: "pnl-30d", labelKey: "metric30dPnl" },
  { key: "return-30d", labelKey: "metric30dReturn" },
  { key: "wr-30d", labelKey: "metric30dWr" },
  { key: "equity-30d", labelKey: "metric30dEquity" },
  { key: "pnl-all", labelKey: "metricAllPnl" },
  { key: "return-all", labelKey: "metricAllReturn" },
  { key: "wr-all", labelKey: "metricAllWr" },
  { key: "equity-all", labelKey: "metricAllEquity" },
];

/**
 * Floating "Share" trigger + modal sheet with three platform-tuned PNG
 * previews. Each card is the live `/analyst/<name>/og/<format>` PNG —
 * the trader can right-click save, or hit the Download button which
 * pulls the PNG via fetch and triggers a save dialog.
 */
export function ShareButton({
  name,
  locale = "en",
}: {
  name: string;
  locale?: Locale;
}) {
  const [open, setOpen] = useState(false);
  const t = tFor(locale);

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
        {t("shareCta")}
      </button>
      {open ? (
        <ShareModal
          name={name}
          locale={locale}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

function ShareModal({
  name,
  locale,
  onClose,
}: {
  name: string;
  locale: Locale;
  onClose: () => void;
}) {
  const t = tFor(locale);
  const [metric, setMetric] = useState<MetricKey>("auto");
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
              // {t("shareKit")}
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
            {t("shareClose")}
          </button>
        </div>
        <p
          style={{
            color: "var(--ink-2)",
            fontSize: 13,
            maxWidth: 640,
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          {t("shareTagline")}
        </p>
        <div style={{ marginBottom: 24 }}>
          <div
            className="eyebrow"
            style={{ color: "var(--ink-3)", marginBottom: 10 }}
          >
            {t("metricPickerLabel")}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {METRIC_OPTIONS.map((m) => {
              const active = m.key === metric;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMetric(m.key)}
                  style={{
                    padding: "6px 12px",
                    border: `1px solid ${active ? "var(--acid)" : "var(--line-2)"}`,
                    background: active ? "var(--acid)" : "transparent",
                    color: active ? "var(--bg)" : "var(--ink-2)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all .12s ease",
                  }}
                >
                  {t(m.labelKey)}
                </button>
              );
            })}
          </div>
        </div>
        <div
          className="share-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {FORMATS.map((fmt) => (
            <SharePreview
              key={fmt.key}
              name={name}
              format={fmt}
              locale={locale}
              metric={metric}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SharePreview({
  name,
  format,
  locale,
  metric,
}: {
  name: string;
  format: (typeof FORMATS)[number];
  locale: Locale;
  metric: MetricKey;
}) {
  const t = tFor(locale);
  const [downloading, setDownloading] = useState(false);
  const [bust, setBust] = useState(0);
  const baseUrl = `/analyst/${encodeURIComponent(name)}/og/${format.key}`;
  const params: string[] = [];
  if (locale !== "en") params.push(`lang=${locale}`);
  if (metric !== "auto") params.push(`metric=${metric}`);
  const url = params.length > 0 ? `${baseUrl}?${params.join("&")}` : baseUrl;
  const previewUrl =
    bust > 0
      ? `${url}${url.includes("?") ? "&" : "?"}b=${bust}`
      : url;
  const formatLabel = t(format.labelKey);

  const onDownload = async () => {
    setDownloading(true);
    try {
      const dlUrl = `${url}${url.includes("?") ? "&" : "?"}b=${Date.now()}`;
      const res = await fetch(dlUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const metricSlug = metric === "auto" ? "" : `-${metric}`;
      a.download = `bottomup-${name}-${format.key}${metricSlug}-${locale}.png`;
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
          {formatLabel}
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
          alt={t("shareDownloadAria", { name, platform: formatLabel })}
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
          {downloading ? "…" : t("shareDownload")}
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
