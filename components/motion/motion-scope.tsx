"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * Wrap the few components that need the animation library (layout animations, the domain
 * diagram). Kept out of the root layout so other pages don't download it.
 * reducedMotion="user" honours the OS "reduce motion" setting.
 */
export function MotionScope({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
