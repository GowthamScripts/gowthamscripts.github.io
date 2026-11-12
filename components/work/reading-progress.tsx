"use client";

import { useRef } from "react";
import { useScrollPosition } from "@/lib/hooks/use-scroll";

/** Thin bar at the top of the window that fills as the case study is read. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useScrollPosition((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar.current) bar.current.style.scale = `${max > 0 ? Math.min(1, y / max) : 0} 1`;
  });
  return (
    <div
      ref={bar}
      aria-hidden
      style={{ scale: "0 1" }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary print:hidden"
    />
  );
}
