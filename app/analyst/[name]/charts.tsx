/**
 * Pure-SVG chart primitives — server-renderable, no client JS, no
 * dependencies. Designed for the analyst detail page where we need
 * compact equity curves and monthly bar charts.
 */

interface AreaPoint {
  t: number;
  balance: number;
}

export function EquityArea({
  data,
  width = 720,
  height = 200,
}: {
  data: AreaPoint[];
  width?: number;
  height?: number;
}) {
  if (data.length < 2) {
    return (
      <div
        className="grid place-items-center text-xs text-muted"
        style={{ width, height }}
      >
        Not enough data
      </div>
    );
  }
  const pad = { l: 8, r: 8, t: 12, b: 16 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const xs = data.map((d) => d.t);
  const ys = data.map((d) => d.balance);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;
  const sx = (t: number) => pad.l + ((t - xMin) / xSpan) * w;
  const sy = (b: number) => pad.t + h - ((b - yMin) / ySpan) * h;

  const last = data[data.length - 1]!;
  const first = data[0]!;
  const up = last.balance >= first.balance;
  const stroke = up ? "rgb(16 185 129)" : "rgb(244 63 94)";
  const fill = up ? "rgb(16 185 129 / 0.15)" : "rgb(244 63 94 / 0.15)";

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${sx(d.t)},${sy(d.balance)}`)
    .join(" ");
  const areaPath = `${linePath} L${sx(last.t)},${pad.t + h} L${sx(first.t)},${pad.t + h} Z`;
  const baselineY = sy(10000);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="Equity curve"
    >
      <line
        x1={pad.l}
        y1={baselineY}
        x2={pad.l + w}
        y2={baselineY}
        stroke="rgb(var(--border))"
        strokeDasharray="3 3"
      />
      <path d={areaPath} fill={fill} />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={1.75} />
      <text
        x={pad.l}
        y={pad.t + h + 12}
        fontSize={10}
        fill="rgb(var(--muted))"
      >
        {new Date(xMin).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        })}
      </text>
      <text
        x={pad.l + w}
        y={pad.t + h + 12}
        fontSize={10}
        textAnchor="end"
        fill="rgb(var(--muted))"
      >
        {new Date(xMax).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        })}
      </text>
    </svg>
  );
}

export function MonthlyBars({
  data,
  width = 720,
  height = 200,
}: {
  data: Array<{ month: string; net_r: number; trades: number }>;
  width?: number;
  height?: number;
}) {
  if (data.length === 0) {
    return (
      <div
        className="grid place-items-center text-xs text-muted"
        style={{ width, height }}
      >
        No monthly records
      </div>
    );
  }
  const pad = { l: 24, r: 8, t: 12, b: 24 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const values = data.map((d) => d.net_r);
  const yMax = Math.max(0.1, ...values, 0);
  const yMin = Math.min(0, ...values);
  const ySpan = yMax - yMin || 1;
  const barW = (w / data.length) * 0.7;
  const gap = (w / data.length) * 0.3;
  const sy = (v: number) => pad.t + h - ((v - yMin) / ySpan) * h;
  const zeroY = sy(0);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="Monthly net R"
    >
      <line
        x1={pad.l}
        y1={zeroY}
        x2={pad.l + w}
        y2={zeroY}
        stroke="rgb(var(--border))"
      />
      {data.map((d, i) => {
        const x = pad.l + i * (barW + gap) + gap / 2;
        const top = sy(Math.max(d.net_r, 0));
        const bottom = sy(Math.min(d.net_r, 0));
        const barH = Math.max(1, bottom - top);
        const positive = d.net_r >= 0;
        return (
          <g key={d.month}>
            <rect
              x={x}
              y={top}
              width={barW}
              height={barH}
              fill={positive ? "rgb(16 185 129)" : "rgb(244 63 94)"}
              opacity={0.85}
            />
            <text
              x={x + barW / 2}
              y={pad.t + h + 14}
              fontSize={9}
              fill="rgb(var(--muted))"
              textAnchor="middle"
            >
              {d.month.slice(2)}
            </text>
          </g>
        );
      })}
      <text
        x={4}
        y={pad.t + 6}
        fontSize={10}
        fill="rgb(var(--muted))"
      >
        {yMax.toFixed(0)}R
      </text>
      <text
        x={4}
        y={pad.t + h}
        fontSize={10}
        fill="rgb(var(--muted))"
      >
        {yMin.toFixed(0)}R
      </text>
    </svg>
  );
}
