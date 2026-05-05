"use client";

import { useState } from "react";
import { fmtR } from "./format";

export interface MonthlyPoint {
  month: string;
  net_r: number;
  trades: number;
}

export function MonthlyBars({ data }: { data: MonthlyPoint[] }) {
  const safe = data ?? [];
  const greenCount = safe.filter((d) => d.net_r > 0).length;
  return (
    <div style={{ border: "1px solid var(--line-2)", background: "var(--bg-2)" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line-2)" }}>
        <div className="eyebrow">MONTHLY_R · {safe.length}M</div>
        <div className="display" style={{ fontSize: 24, color: "var(--ink)", marginTop: 8 }}>
          <span className="num" style={{ color: "var(--acid)" }}>
            {greenCount}
          </span>
          <span style={{ color: "var(--ink-3)" }}>/</span>
          <span className="num">{safe.length}</span>{" "}
          <span style={{ color: "var(--ink-3)", fontWeight: 700, fontSize: 14 }}>GREEN MONTHS</span>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <BarsSvg data={safe} />
      </div>
    </div>
  );
}

function BarsSvg({ data }: { data: MonthlyPoint[] }) {
  const VBW = 720;
  const VBH = 220;
  const PAD_T = 12;
  const PAD_B = 28;
  const usable = VBH - PAD_T - PAD_B;
  const baseline = PAD_T + usable / 2;
  const w = data.length > 0 ? (VBW - 16) / data.length : 0;
  const barW = w * 0.6;
  const max = Math.max(0.0001, ...data.map((d) => Math.abs(d.net_r))) * 1.1;
  const [hover, setHover] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div
        style={{
          height: 220,
          display: "grid",
          placeItems: "center",
          color: "var(--ink-3)",
          fontSize: 12,
          letterSpacing: ".1em",
          textTransform: "uppercase",
        }}
      >
        no monthly data
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${VBW} ${VBH}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height: 220, display: "block" }}
    >
      <line
        x1={8}
        x2={VBW - 8}
        y1={baseline}
        y2={baseline}
        stroke="var(--ink-4)"
        strokeWidth={1}
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
      {data.map((d, i) => {
        const x = 8 + i * w + (w - barW) / 2;
        const isUp = d.net_r >= 0;
        const h = (Math.abs(d.net_r) / max) * (usable / 2);
        const y = isUp ? baseline - h : baseline;
        const fill = isUp ? "var(--acid)" : "var(--warn)";
        const isHover = hover === i;
        const opacity = hover === null ? 1 : isHover ? 1 : 0.3;
        return (
          <g
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(h, 1.5)}
              fill={fill}
              opacity={opacity}
            />
            <rect x={8 + i * w} y={PAD_T} width={w} height={usable} fill="transparent" />
            <text
              x={x + barW / 2}
              y={VBH - 10}
              textAnchor="middle"
              fontSize={9}
              fill={isHover ? "var(--ink)" : "var(--ink-3)"}
              fontFamily="var(--font-mono)"
              letterSpacing=".05em"
            >
              {labelOf(d.month)}
            </text>
            {isHover ? (
              <g>
                <rect
                  x={x + barW / 2 - 32}
                  y={Math.max(2, y - 22)}
                  width={64}
                  height={18}
                  fill={fill}
                />
                <text
                  x={x + barW / 2}
                  y={Math.max(2, y - 22) + 12}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="var(--bg)"
                  fontFamily="var(--font-mono)"
                >
                  {fmtR(d.net_r)}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** Backend gives us "2025-12" — show "DEC" / "JAN" upper. */
function labelOf(month: string): string {
  const m = /^\d{4}-(\d{2})/.exec(month);
  if (!m) return month.toUpperCase();
  const idx = Number(m[1]) - 1;
  return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][idx] ?? month;
}
