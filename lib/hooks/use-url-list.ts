"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "portfolio:url-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/**
 * A list of values kept in the address bar (?focus=LEAD,ARCH), so a filtered view can be shared.
 *
 * The server renders the unfiltered list (it never sees the query), and the browser applies the
 * filter right after loading. Reading the address this way, instead of with useSearchParams,
 * keeps the page fully prerendered and avoids re-creating the list on load.
 */
export function useUrlList<T extends string>(param: string, allowed: readonly T[]) {
  const raw = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(param) ?? "",
    () => "",
  );
  const values = raw.split(",").filter((value): value is T => allowed.includes(value as T));

  const toggle = useCallback(
    (value: T | null) => {
      const params = new URLSearchParams(window.location.search);
      const current = (params.get(param) ?? "").split(",").filter(Boolean);
      const next =
        value === null
          ? []
          : current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
      if (next.length > 0) params.set(param, next.join(","));
      else params.delete(param);
      const query = params.toString().replace(/%2C/g, ",");
      window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
      window.dispatchEvent(new Event(EVENT));
    },
    [param],
  );

  return [values, toggle] as const;
}
