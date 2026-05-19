"use client";

import type { ReactNode } from "react";

interface ContentTransitionProps {
  /** Unique key per item — changing it triggers the enter animation */
  panelKey: string;
  children: ReactNode;
  className?: string;
  /** Slide direction for panel swaps */
  direction?: "left" | "right" | "none";
}

export function ContentTransition({
  panelKey,
  children,
  className = "",
  direction = "right",
}: ContentTransitionProps) {
  const directionClass =
    direction === "left"
      ? "animate-content-enter-left"
      : direction === "none"
        ? "animate-content-enter-fade"
        : "animate-content-enter";

  return (
    <div className={`relative ${className}`}>
      <div key={panelKey} className={directionClass} aria-live="polite">
        {children}
      </div>
    </div>
  );
}

/** Horizontal slide track for carousels */
export const CONTENT_SLIDE_TRACK_CLASS = "content-slide-track";
