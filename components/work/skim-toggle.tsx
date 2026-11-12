"use client";

import { AlignLeft, Zap } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

/**
 * Skim mode (docs/09-ux.md §5b): hides the long read and leaves the snapshot, TL;DR and results.
 * The choice is remembered across case studies. Hiding is done in CSS via <html data-skim>,
 * see app/globals.css.
 */
export function SkimToggle() {
  const [stored, setStored] = useLocalStorage("skim-mode");
  const skim = stored === "on";

  useEffect(() => {
    if (skim) document.documentElement.dataset.skim = "on";
    else delete document.documentElement.dataset.skim;
    return () => {
      delete document.documentElement.dataset.skim;
    };
  }, [skim]);

  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={skim}
      onClick={() => setStored(skim ? null : "on")}
      className="h-9 px-3 print:hidden"
    >
      {skim ? <AlignLeft data-icon="inline-start" /> : <Zap data-icon="inline-start" />}
      {skim ? "Show full case study" : "Skim mode"}
    </Button>
  );
}
