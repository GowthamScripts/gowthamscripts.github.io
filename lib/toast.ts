/**
 * Toasts without putting the toast library in every page's first download.
 * The <Toaster> mounts when the browser is idle (components/layout/toaster-loader.tsx);
 * if a toast is needed before that, this asks it to mount now and waits for it.
 */
export const toasterLoadEvent = "toaster:load";

let markReady: () => void = () => {};
const ready = new Promise<void>((resolve) => (markReady = resolve));

/** Called by the loader once <Toaster> is on the page. */
export function toasterMounted() {
  markReady();
}

function whenToasterReady(): Promise<void> {
  window.dispatchEvent(new Event(toasterLoadEvent));
  return ready;
}

export async function notify(kind: "success" | "error", message: string) {
  const [{ toast }] = await Promise.all([import("sonner"), whenToasterReady()]);
  toast[kind](message);
}
