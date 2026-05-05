"use client";

import { useState } from "react";

const COIN_TINT: Record<string, string> = {
  btc: "#F7931A",
  eth: "#627EEA",
  sol: "#14F195",
  sui: "#4DA1F0",
  avax: "#E84142",
  ftm: "#1969FF",
  floki: "#F2B33C",
  bonk: "#F58A2D",
  jto: "#74EAA8",
  render: "#A26EFF",
  pump: "#FF6B1A",
  wld: "#1A1A1A",
  fartcoin: "#FFD24A",
};

const COIN_BASE = (c: string) =>
  c.replace(/USDT$|USDC$|BUSD$/i, "").toLowerCase();

export function CoinLogo({ coin, size = 22 }: { coin: string; size?: number }) {
  const base = COIN_BASE(coin);
  const [err, setErr] = useState(false);
  const tint = COIN_TINT[base] || "var(--acid)";
  if (err) {
    return (
      <span
        style={{
          width: size,
          height: size,
          display: "inline-grid",
          placeItems: "center",
          background: tint,
          color: "#0A0A0A",
          fontSize: size * 0.42,
          fontWeight: 800,
          fontFamily: "var(--font-mono)",
        }}
      >
        {base.slice(0, 3).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${base}.svg`}
      alt={coin}
      width={size}
      height={size}
      onError={() => setErr(true)}
      style={{ display: "block", borderRadius: "50%" }}
    />
  );
}
