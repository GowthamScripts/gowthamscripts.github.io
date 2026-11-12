"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "portfolio:local-storage";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/**
 * A string kept in localStorage and shared between components and tabs.
 * Returns null on the server, before anything is saved, or when storage is blocked,
 * so pages render the same with or without it.
 */
export function useLocalStorage(key: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );

  const setValue = useCallback(
    (next: string | null) => {
      try {
        if (next === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, next);
      } catch {
        // Private mode or blocked storage: the preference just doesn't persist.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  return [value, setValue] as const;
}
