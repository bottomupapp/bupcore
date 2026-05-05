import type { TraderDetail } from "@/lib/bottomup-api";
import { fmtR, fmtUsd } from "./format";

export function LongShort({ data }: { data: TraderDetail["long_short"] }) {
  const total = data.long.trades + data.short.trades;
  const lp = total > 0 ? (data.long.trades / total) * 100 : 50;
  return (
    <div style={{ padding: 24 }}>
      <div className="eyebrow" style={{ marginBottom: 24 }}>
        DIRECTION SPLIT
      </div>
      <div style={{ display: "grid", gap: 18 }}>
        <SideRow side="L" label="LONG" stats={data.long} pct={lp} color="var(--pos)" />
        <SideRow side="S" label="SHORT" stats={data.short} pct={100 - lp} color="var(--neg)" />
      </div>
    </div>
  );
}

function SideRow({
  side,
  label,
  stats,
  pct,
  color,
}: {
  side: "L" | "S";
  label: string;
  stats: { trades: number; wins: number; net_r: number; net_pnl: number };
  pct: number;
  color: string;
}) {
  const wr = stats.trades > 0 ? Math.round((stats.wins / stats.trades) * 100) : null;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 22,
              height: 22,
              background: color,
              color: "var(--bg)",
              display: "inline-grid",
              placeItems: "center",
              fontWeight: 800,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
          >
            {side}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".16em" }}>
            {label}
          </span>
          <span
            className="num"
            style={{ fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }}
          >
            · {stats.trades.toLocaleString("en-US")}t · {wr == null ? "—" : `${wr}%WR`}
          </span>
        </div>
        <span className="display num" style={{ fontSize: 22, color }}>
          {fmtR(stats.net_r)}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "var(--bg-3)",
          position: "relative",
          border: "1px solid var(--line-2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: pct + "%",
            background: color,
          }}
        />
      </div>
      <div
        className="num"
        style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4, letterSpacing: ".06em" }}
      >
        PNL {fmtUsd(stats.net_pnl, { sign: true, compact: true })} · {pct.toFixed(0)}% of trades
      </div>
    </div>
  );
}
