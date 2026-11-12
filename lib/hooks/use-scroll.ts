"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onScroll(y, previousY)` at most once per frame while the page scrolls, and once on mount.
 * A plain listener instead of an animation library, so it costs almost nothing to ship.
 */
export function useScrollPosition(onScroll: (y: number, previous: number) => void) {
  const callback = useRef(onScroll);
  useEffect(() => {
    callback.current = onScroll;
  });

  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      callback.current(y, previous);
      previous = y;
    };
    const onEvent = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onEvent, { passive: true });
    window.addEventListener("resize", onEvent, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onEvent);
      window.removeEventListener("resize", onEvent);
    };
  }, []);
}
