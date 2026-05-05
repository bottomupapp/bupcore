"use client";

import { useState } from "react";
import type { TraderDetail } from "@/lib/bottomup-api";
import { equityPaths } from "./equity-path";
import { fmtPct, fmtUsd } from "./format";

type Range = "7D" | "30D" | "90D" | "ALL";

export function EquityCard({ detail }: { detail: TraderDetail }) {
  const [range, setRange] = useState<Range>("30D");

  // Backend currently exposes only the 30-day equity curve (sampled).
  // Range buttons are presented but until the backend ships windowed
  // curves we filter the existing series; "ALL" shows everything.
  const points = detail.equity_curve ?? [];
  const filtered = filterByRange(points, range);
  const eq = equityPaths(filtered);

  const startBalance = filtered[0]?.balance ?? eq.endBalance;
  const totalPnl = eq.endBalance - startBalance;
  const returnPct = startBalance > 0 ? (totalPnl / startBalance) * 100 : 0;
  const tone = totalPnl >= 0 ? "var(--acid)" : "var(--warn)";

  const dateLabels = makeDateLabels(filtered);

  return (
    <div
      style={{
        border: "1px solid var(--line-2)",
        background: "var(--bg-2)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--line-2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="eyebrow">EQUITY · {range}</div>
          <div
            className="display num"
            style={{ fontSize: 44, color: tone, marginTop: 8, letterSpacing: "-0.03em" }}
          >
            {fmtUsd(eq.endBalance, { compact: true })}
          </div>
          <div className="num" style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
            <span style={{ color: tone }}>
              {fmtUsd(totalPnl, { sign: true })} ({fmtPct(returnPct)})
            </span>{" "}
            · vs. {fmtUsd(startBalance)} start
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, border: "1px solid var(--line-2)" }}>
          {(["7D", "30D", "90D", "ALL"] as const).map((r) => {
            const active = r === range;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                style={{
                  border: 0,
                  padding: "8px 14px",
                  background: active ? "var(--acid)" : "transparent",
                  color: active ? "var(--bg)" : "var(--ink-3)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".12em",
                  cursor: "pointer",
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "8px 0 0", position: "relative" }}>
        <svg
          viewBox="0 0 720 240"
          preserveAspectRatio="none"
          style={{ width: "100%", height: 320, display: "block" }}
        >
          <defs>
            <linearGradient id="eqFill2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={tone} stopOpacity=".26" />
              <stop offset="100%" stopColor={tone} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={8}
              x2={712}
              y1={20 + i * 40}
              y2={20 + i * 40}
              stroke="var(--line-2)"
              strokeWidth={1}
              strokeDasharray="2 4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <line
            x1={8}
            x2={712}
            y1={204}
            y2={204}
            stroke="var(--ink-4)"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          <path d={eq.area} fill="url(#eqFill2)" />
          <path
            d={eq.line}
            fill="none"
            stroke={tone}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
          <circle cx={eq.endX} cy={eq.endY} r={4} fill={tone} />
          <circle cx={eq.endX} cy={eq.endY} r={9} fill={tone} opacity={0.25} />
        </svg>
      </div>
      <div
        style={{
          padding: "0 24px 18px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "var(--ink-3)",
          letterSpacing: ".12em",
        }}
      >
        {dateLabels.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function filterByRange(
  points: Array<{ t: number; balance: number }>,
  range: Range,
): Array<{ t: number; balance: number }> {
  if (points.length === 0) return points;
  if (range === "ALL") return points;
  const days = range === "7D" ? 7 : range === "30D" ? 30 : 90;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const f = points.filter((p) => p.t >= cutoff);
  // Always keep at least 2 points so the curve doesn't collapse.
  return f.length >= 2 ? f : points.slice(-2);
}

function makeDateLabels(points: Array<{ t: number; balance: number }>): string[] {
  if (points.length < 2) return ["—", "—"];
  const first = new Date(points[0]!.t);
  const last = new Date(points[points.length - 1]!.t);
  const fmt = (d: Date) =>
    d
      .toLocaleDateString("en-US", { day: "2-digit", month: "short" })
      .toUpperCase();
  // Two endpoints + two midpoints if range is wide enough
  const span = last.getTime() - first.getTime();
  if (span <= 0) return [fmt(first), fmt(last)];
  const midA = new Date(first.getTime() + span / 3);
  const midB = new Date(first.getTime() + (2 * span) / 3);
  return [fmt(first), fmt(midA), fmt(midB), fmt(last)];
}
