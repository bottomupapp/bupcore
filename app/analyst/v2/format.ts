/**
 * Formatters for the V2 analyst surface — terminal style. Numbers are
 * always tabular (use the `num` class), `−` for negatives (en-dash, not
 * hyphen) so the typographic alignment with `+` is symmetrical.
 */

export function fmtUsd(
  n: number | null | undefined,
  opts: { compact?: boolean; sign?: boolean } = {},
): string {
  if (n == null) return "—";
  const { compact = false, sign = false } = opts;
  const abs = Math.abs(n);
  let body: string;
  if (compact && abs >= 1000) {
    body = "$" + (abs / 1000).toFixed(abs >= 10000 ? 1 : 2) + "k";
  } else if (abs >= 1000) {
    body = "$" + abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  } else {
    body = "$" + abs.toFixed(2);
  }
  if (n < 0) return "−" + body;
  if (sign && n > 0) return "+" + body;
  return body;
}

export function fmtPct(n: number | null | undefined, withSign = true): string {
  if (n == null) return "—";
  return (withSign && n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n).toFixed(2) + "%";
}

export function fmtR(n: number | null | undefined): string {
  if (n == null) return "—";
  return (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n).toFixed(2) + "R";
}

export function fmtInt(n: number | null | undefined): string {
  if (n == null) return "—";
  return Math.round(n).toLocaleString("en-US");
}

export function fmtDate(s: string | Date | null | undefined): string {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

/** "Mar 2024" gibi (joined date). */
export function fmtJoinedMonth(s: string | Date | null | undefined): string | null {
  if (!s) return null;
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/** Synthetic "0xABCDEF12" handle from a UUID — terminal flavor only. */
export function tradesIdHex(id: string | null | undefined): string {
  if (!id) return "0x00000000";
  return "0x" + id.replace(/-/g, "").toUpperCase().slice(0, 8);
}
