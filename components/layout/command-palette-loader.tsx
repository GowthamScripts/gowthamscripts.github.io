"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { PaletteItem } from "@/components/layout/command-palette";

const CommandPalette = dynamic(() => import("@/components/layout/command-palette"), { ssr: false });

export const OPEN_PALETTE_EVENT = "portfolio:open-command-palette";

/**
 * Listens for ⌘K / Ctrl K (and the header's search button), and only then downloads the palette,
 * so it costs nothing for visitors who never use it.
 */
export function CommandPaletteLoader({ items, email }: { items: PaletteItem[]; email: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const show = () => {
      setLoaded(true);
      setOpen(true);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setLoaded(true);
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, []);

  return loaded ? (
    <CommandPalette open={open} onOpenChange={setOpen} items={items} email={email} />
  ) : null;
}
