import type { TraderCoinStat } from "@/lib/bottomup-api";
import { fmtR, fmtUsd } from "./format";
import { CoinLogo } from "./coin-logo";

export function TopCoins({ coins }: { coins: TraderCoinStat[] }) {
  const max = coins.length > 0 ? Math.max(...coins.map((c) => Math.abs(c.net_r))) : 1;
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
        <div className="eyebrow">TOP_COINS · BY R</div>
        <span className="eyebrow" style={{ color: "var(--ink-3)" }}>
          {coins.length} ROWS
        </span>
      </div>
      {coins.length === 0 ? (
        <div
          style={{
            padding: 32,
            color: "var(--ink-3)",
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
          }}
        >
          no coin breakdown
        </div>
      ) : (
        <table className="terminal">
          <thead>
            <tr>
              <th>SYMBOL</th>
              <th className="ralign">TRADES</th>
              <th className="ralign">WR</th>
              <th>R DISTRIBUTION</th>
              <th className="ralign">PNL</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((c) => {
              const tone = c.net_r >= 0 ? "var(--acid)" : "var(--warn)";
              const barPct = max > 0 ? (Math.abs(c.net_r) / max) * 100 : 0;
              return (
                <tr key={c.coin}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <CoinLogo coin={c.coin} size={22} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>
                        {c.coin.replace(/USDT$/i, "")}
                        <span style={{ color: "var(--ink-4)", fontWeight: 500 }}>
                          /USDT
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="ralign num" style={{ color: "var(--ink-2)" }}>
                    {c.trades}
                  </td>
                  <td
                    className="ralign num"
                    style={{ color: c.win_rate >= 50 ? "var(--acid)" : "var(--ink-2)" }}
                  >
                    {c.win_rate.toFixed(1)}%
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 140,
                          height: 4,
                          background: "var(--bg-3)",
                          position: "relative",
                          border: "1px solid var(--line-2)",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: "0 auto 0 0",
                            width: barPct + "%",
                            background: tone,
                          }}
                        />
                      </div>
                      <span
                        className="num"
                        style={{ color: tone, fontSize: 12, minWidth: 60 }}
                      >
                        {fmtR(c.net_r)}
                      </span>
                    </div>
                  </td>
                  <td className="ralign num" style={{ fontWeight: 600, color: tone }}>
                    {fmtUsd(c.net_pnl, { sign: true, compact: true })}
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
