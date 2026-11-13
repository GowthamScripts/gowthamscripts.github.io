"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, useInViewOnce } from "@/lib/hooks/use-in-view";

/**
 * A number that counts up to its value when it scrolls into view (docs/09-ux.md A6).
 * The final value is in the HTML from the start and is what screen readers get; with reduced
 * motion, or without JavaScript, it simply stays put. A number already on screen when the page
 * loads also stays put: re-drawing it would make it the page's late "largest paint" and slow
 * the measured load time.
 */
export function CountUp({
  value,
  from = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  from?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref, 0.5);
  const onScreenAtLoad = useRef<boolean | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || onScreenAtLoad.current !== null) return;
    onScreenAtLoad.current = node.getBoundingClientRect().top < window.innerHeight;
  }, []);

  const decimals = (String(value).split(".")[1] ?? "").length;
  const format = (n: number) =>
    prefix +
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;
  const final = format(value);

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node || onScreenAtLoad.current || prefersReducedMotion()) return;
    const toText = (n: number) =>
      prefix +
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;
    // 0.7s ease-out, drawn with requestAnimationFrame (no animation library needed).
    const duration = 700;
    let frame = 0;
    let start: number | undefined;
    const step = (now: number) => {
      start ??= now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      node.textContent = toText(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      node.textContent = toText(value);
    };
  }, [inView, from, value, prefix, suffix, decimals]);

  return (
    <>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {final}
      </span>
    </>
  );
}
