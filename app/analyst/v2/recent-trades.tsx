import type { TraderRecentTrade } from "@/lib/bottomup-api";
import { fmtDate, fmtR, fmtUsd } from "./format";
import { CoinLogo } from "./coin-logo";

export function RecentTrades({
  trades,
  totalTrades,
}: {
  trades: TraderRecentTrade[];
  totalTrades: number;
}) {
  return (
    <div style={{ border: "1px solid var(--line-2)", background: "var(--bg-2)" }}>
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--line-2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="eyebrow">
          <span className="blink" style={{ color: "var(--acid)" }}>
            ▮
          </span>{" "}
          EXECUTION_LOG · LAST {trades.length}
        </div>
        <span className="eyebrow" style={{ color: "var(--ink-3)" }}>
          ALL TRADES: {totalTrades.toLocaleString("en-US")}
        </span>
      </div>
      {trades.length === 0 ? (
        <div
          style={{
            padding: 32,
            color: "var(--ink-3)",
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
          }}
        >
          no closed trades
        </div>
      ) : (
        <table className="terminal">
          <thead>
            <tr>
              <th>#</th>
              <th>TIMESTAMP</th>
              <th>SYMBOL</th>
              <th>SIDE</th>
              <th>STATUS</th>
              <th className="ralign">R</th>
              <th className="ralign">PNL_USD</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => {
              const isWin = t.status === "success" || t.pnl > 0;
              const tone = t.pnl > 0 ? "var(--acid)" : t.pnl < 0 ? "var(--warn)" : "var(--ink-3)";
              const num = (totalTrades - i).toString().padStart(4, "0");
              return (
                <tr key={t.id}>
                  <td className="num" style={{ color: "var(--ink-3)" }}>
                    {num}
                  </td>
                  <td className="num" style={{ color: "var(--ink-2)" }}>
                    {fmtDate(t.close_date).toUpperCase()}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <CoinLogo coin={t.coin} size={18} />
                      <span style={{ fontWeight: 600 }}>
                        {t.coin.replace(/USDT$/i, "")}
                        <span style={{ color: "var(--ink-4)", fontWeight: 500 }}>
                          /USDT
                        </span>
                      </span>
                    </div>
                  </td>
                  <td>
                    {t.position == null ? (
                      <span style={{ color: "var(--ink-3)" }}>—</span>
                    ) : (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          border: `1px solid ${
                            t.position === "long" ? "var(--acid)" : "var(--warn)"
                          }`,
                          color: t.position === "long" ? "var(--acid)" : "var(--warn)",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: ".14em",
                          textTransform: "uppercase",
                        }}
                      >
                        {t.position}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: ".14em",
                        textTransform: "uppercase",
                        color: isWin ? "var(--acid)" : "var(--ink-3)",
                      }}
                    >
                      {isWin ? "◉ WIN" : "○ " + (t.status || "closed")}
                    </span>
                  </td>
                  <td className="ralign num" style={{ color: tone }}>
                    {fmtR(t.r)}
                  </td>
                  <td className="ralign num" style={{ color: tone, fontWeight: 600 }}>
                    {fmtUsd(t.pnl, { sign: true })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
