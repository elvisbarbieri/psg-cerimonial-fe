"use client";

import { useEffect, useRef } from "react";

/** Interval between automatic "next item" advances (5 seconds). */
export const AUTO_ADVANCE_INTERVAL_MS = 5_000;

/**
 * Calls `onAdvance` every `intervalMs` (default 5s), like clicking "next".
 * Restarts the timer when `resetKey` changes (e.g. after a manual selection).
 *
 * Uses a recursive `setTimeout` chain (instead of `setInterval`) because some
 * mobile browsers — notably iOS Safari — can throttle/skip `setInterval`
 * callbacks after backgrounding or during scroll-driven address-bar resizes.
 * A per-tick `setTimeout` is rescheduled fresh each cycle and is reliable.
 */
export function useAutoAdvance(
  itemCount: number,
  onAdvance: () => void,
  resetKey: string | number,
  options?: { enabled?: boolean; intervalMs?: number },
) {
  const { enabled = true, intervalMs = AUTO_ADVANCE_INTERVAL_MS } =
    options ?? {};
  const onAdvanceRef = useRef(onAdvance);

  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    if (!enabled || itemCount <= 1) return;
    if (typeof window === "undefined") return;

    let cancelled = false;
    let timeoutId: number | null = null;

    const tick = () => {
      if (cancelled) return;
      onAdvanceRef.current();
      timeoutId = window.setTimeout(tick, intervalMs);
    };

    timeoutId = window.setTimeout(tick, intervalMs);

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, [itemCount, enabled, intervalMs, resetKey]);
}
