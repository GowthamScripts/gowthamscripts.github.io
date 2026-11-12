/** Runs `callback` when the browser is idle (or after a short delay where that isn't supported). Returns a cancel function. */
export function onIdle(callback: () => void, timeout = 4000): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 2000);
  return () => clearTimeout(id);
}
