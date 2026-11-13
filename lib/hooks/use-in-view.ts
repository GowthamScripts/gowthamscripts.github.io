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
      // The root reaches far above the screen, so content the reader has already passed counts
      // as seen. A jump to a lower section then leaves nothing above it invisible.
      { threshold: amount, rootMargin: "100000px 0px 0px 0px" },
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
