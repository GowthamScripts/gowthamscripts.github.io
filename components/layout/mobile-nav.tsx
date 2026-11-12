"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { onIdle } from "@/lib/idle";

const loadSheet = () => import("@/components/layout/mobile-nav-sheet");
const MobileNavSheet = dynamic(loadSheet, { ssr: false });

/**
 * The menu button. The sheet's code is fetched when the page is idle (or on the first tap),
 * keeping the dialog library out of the first download.
 */
export function MobileNav({ pathname, name }: { pathname: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => onIdle(() => void loadSheet()), []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-lg"
        className="lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
      >
        <Menu />
      </Button>
      {mounted && <MobileNavSheet pathname={pathname} name={name} open={open} setOpen={setOpen} />}
    </>
  );
}
