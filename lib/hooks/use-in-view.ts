"use client";

import { useEffect, useState } from "react";

/** True once `ref` has been at least `amount` (0–1) visible. Stays true afterwards. */
export function useInViewOnce(ref: React.RefObject<Element | null>, amount = 0.15) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, amount, inView]);

  return inView;
}

/** The OS "reduce motion" setting, read once on the client. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
