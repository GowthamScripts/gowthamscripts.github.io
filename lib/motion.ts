/** Motion tokens (docs/09-ux.md A6). Durations in seconds. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const transitions = {
  instant: { duration: 0.1, ease: "linear" },
  quick: { duration: 0.18, ease: easeOut },
  standard: { duration: 0.28, ease: easeOut },
  expressive: { type: "spring", stiffness: 260, damping: 30 },
} as const;

export const stagger = 0.05;
