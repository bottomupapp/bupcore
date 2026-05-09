"use client";

import { useEffect, useRef, useState } from "react";
import type { Analyst } from "./bottomup-api";

/**
 * Public WS gateway URL. Override per-env via NEXT_PUBLIC_BOTTOMUP_WS_URL.
 * The `analyst` channel is open to anonymous clients (no JWT) — gateway
 * permits it the same way it permits spot/futures/setup.
 */
const WS_URL =
  process.env.NEXT_PUBLIC_BOTTOMUP_WS_URL ??
  "wss://bottomupws-production.up.railway.app/";

type Frame =
  | { channel: "analyst"; id: string; data: Analyst; ts: number }
  | { channel: string; id: string; data: unknown; ts: number };

/**
 * Subscribe to live analyst updates.
 *
 * - `id = "*"`            → directory page (every analyst row)
 * - `id = "<name>"`       → detail page (one analyst, lowercased server-side)
 *
 * Returns a map keyed by trader_id → freshest Analyst row,
 * plus a stamp recording when the last frame arrived. Components splice
 * matching rows on top of the SSR-rendered initial data so the page never
 * goes blank during a reconnect.
 */
export function useAnalystLive(id: string): {
  rows: Map<string, Analyst>;
  lastUpdateAt: number | null;
  connected: boolean;
} {
  const [rows, setRows] = useState<Map<string, Analyst>>(() => new Map());
  const [lastUpdateAt, setLastUpdateAt] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const sockRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;

    const connect = (): void => {
      if (cancelled) return;
      const ws = new WebSocket(WS_URL);
      sockRef.current = ws;

      ws.addEventListener("open", () => {
        if (cancelled) return;
        attempt = 0;
        setConnected(true);
        ws.send(
          JSON.stringify({ channel: "analyst", action: "bind", id }),
        );
      });

      ws.addEventListener("message", (ev) => {
        let frame: Frame | null = null;
        try {
          frame = JSON.parse(ev.data as string) as Frame;
        } catch {
          return;
        }
        if (!frame || frame.channel !== "analyst") return;
        // The analyst channel carries two payload shapes:
        //   1. trader-watcher snapshots: full Analyst row
        //   2. replicator notifications: { kind: 'trades-changed', ... }
        // This hook only consumes (1); (2) is handled by
        // useAnalystInvalidate. Detect by presence of trader_id field.
        const data = frame.data as Analyst | { kind?: string };
        if (!data || typeof data !== "object" || !("trader_id" in data)) {
          return;
        }
        const row = data as Analyst;
        setRows((prev) => {
          const next = new Map(prev);
          next.set(row.trader_id, row);
          return next;
        });
        setLastUpdateAt(Date.now());
      });

      ws.addEventListener("close", () => {
        if (cancelled) return;
        setConnected(false);
        // Exponential-ish backoff capped at 8s.
        const delay = Math.min(8000, 500 * 2 ** Math.min(attempt, 4));
        attempt += 1;
        reconnectTimer.current = setTimeout(connect, delay);
      });

      ws.addEventListener("error", () => {
        // Let the close handler drive reconnect — error fires first then
        // close, so we don't double-schedule.
      });
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      const ws = sockRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(
            JSON.stringify({ channel: "analyst", action: "unbind", id }),
          );
        } catch {
          // socket already half-closed; ignore.
        }
        ws.close();
      } else {
        ws?.close();
      }
      sockRef.current = null;
    };
  }, [id]);

  return { rows, lastUpdateAt, connected };
}

/**
 * Subscribe to per-trader page-invalidation notifications. The
 * replicator publishes `{kind:'trades-changed'}` on `analyst:<trader_id>`
 * whenever a setup of theirs transitions to closed. The detail page
 * reacts by calling router.refresh() so PerfMatrix / equity / monthly
 * bars / recent trades re-render with fresh data.
 *
 * Fires `onInvalidate` debounced (250ms) — a batch of replicated
 * setups for the same trader collapses into one refresh.
 */
export function useAnalystInvalidate(
  traderId: string | null | undefined,
  onInvalidate: () => void,
): void {
  const cbRef = useRef(onInvalidate);
  cbRef.current = onInvalidate;

  useEffect(() => {
    if (!traderId) return;
    const id = traderId.toLowerCase();
    let cancelled = false;
    let attempt = 0;
    let sock: WebSocket | null = null;
    let reconnect: ReturnType<typeof setTimeout> | null = null;
    let debounce: ReturnType<typeof setTimeout> | null = null;

    const connect = (): void => {
      if (cancelled) return;
      const ws = new WebSocket(WS_URL);
      sock = ws;
      ws.addEventListener("open", () => {
        if (cancelled) return;
        attempt = 0;
        ws.send(JSON.stringify({ channel: "analyst", action: "bind", id }));
      });
      ws.addEventListener("message", (ev) => {
        let frame: Frame | null = null;
        try {
          frame = JSON.parse(ev.data as string) as Frame;
        } catch {
          return;
        }
        if (!frame || frame.channel !== "analyst") return;
        const data = frame.data as { kind?: string };
        if (data?.kind !== "trades-changed") return;
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => cbRef.current(), 250);
      });
      ws.addEventListener("close", () => {
        if (cancelled) return;
        const delay = Math.min(8000, 500 * 2 ** Math.min(attempt, 4));
        attempt += 1;
        reconnect = setTimeout(connect, delay);
      });
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnect) clearTimeout(reconnect);
      if (debounce) clearTimeout(debounce);
      if (sock && sock.readyState === WebSocket.OPEN) {
        try {
          sock.send(
            JSON.stringify({ channel: "analyst", action: "unbind", id }),
          );
        } catch {
          // socket already half-closed; ignore.
        }
        sock.close();
      } else {
        sock?.close();
      }
    };
  }, [traderId]);
}
