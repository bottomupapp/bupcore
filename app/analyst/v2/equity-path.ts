/**
 * Convert an equity curve point list into the SVG path strings expected
 * by the V2 hero/equity components.
 *
 * Backend gives us `Array<{ t: ms, balance: number }>` (chronological).
 * V2 design uses a fixed viewBox of 720×220 with:
 *   - x range: 8 → 712 (704px usable)
 *   - y baseline (start equity): 204
 *   - y top (max equity): 12
 *
 * We return BOTH:
 *   - `area`  — the closed path including baseline segments (for fill)
 *   - `line`  — stroke-only polyline (for the line)
 *
 * If we have <2 points, we emit a flat baseline so the hero doesn't
 * collapse visually.
 */

const VBW = 720;
const VBH = 220;
const X_LEFT = 8;
const X_RIGHT = 712;
const Y_TOP = 12;
const Y_BASE = 204;

const STARTING_BALANCE = 10_000;

export interface EquityPaths {
  area: string;
  line: string;
  /** Final balance at the right edge — useful for end-dot tooltip. */
  endBalance: number;
  endX: number;
  endY: number;
  /** True when balance ended above starting equity; used to color stroke. */
  up: boolean;
}

export function equityPaths(
  points: Array<{ t: number; balance: number }>,
): EquityPaths {
  if (!points || points.length < 2) {
    const y = Y_BASE;
    return {
      area: `M${X_LEFT},${Y_BASE} L${X_RIGHT},${y} L${X_RIGHT},${Y_BASE} Z`,
      line: `M${X_LEFT},${Y_BASE} L${X_RIGHT},${y}`,
      endBalance: STARTING_BALANCE,
      endX: X_RIGHT,
      endY: y,
      up: true,
    };
  }

  const xs = points.map((p) => p.t);
  const ys = points.map((p) => p.balance);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys, STARTING_BALANCE);
  const yMax = Math.max(...ys, STARTING_BALANCE);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  const sx = (t: number) =>
    X_LEFT + ((t - xMin) / xSpan) * (X_RIGHT - X_LEFT);
  const sy = (b: number) =>
    Y_BASE - ((b - yMin) / ySpan) * (Y_BASE - Y_TOP);

  const segments = points.map((p, i) => {
    const cmd = i === 0 ? "M" : "L";
    return `${cmd}${sx(p.t).toFixed(2)},${sy(p.balance).toFixed(2)}`;
  });
  const line = segments.join(" ");

  const last = points[points.length - 1]!;
  const first = points[0]!;
  const endX = sx(last.t);
  const endY = sy(last.balance);

  const area = `${line} L${endX.toFixed(2)},${Y_BASE} L${sx(first.t).toFixed(
    2,
  )},${Y_BASE} Z`;

  return {
    area,
    line,
    endBalance: last.balance,
    endX,
    endY,
    up: last.balance >= first.balance,
  };
}

export const EQUITY_VIEWBOX = `0 0 ${VBW} ${VBH}`;
export const EQUITY_VBW = VBW;
export const EQUITY_VBH = VBH;
export const EQUITY_X_LEFT = X_LEFT;
export const EQUITY_X_RIGHT = X_RIGHT;
export const EQUITY_Y_TOP = Y_TOP;
export const EQUITY_Y_BASE = Y_BASE;
