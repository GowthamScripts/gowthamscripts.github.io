"use client";

import { useState } from "react";
import { useScrollPosition } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";

/**
 * Phone-only action bar pinned to the bottom (docs/09-ux.md A8).
 * Appears once the top of the page has scrolled away, and steps aside near the footer.
 */
export function StickyBar({
  children,
  after = 480,
}: {
  children: React.ReactNode;
  after?: number;
}) {
  const [visible, setVisible] = useState(false);

  useScrollPosition((y) => {
    const distanceToBottom = document.documentElement.scrollHeight - window.innerHeight - y;
    setVisible(y > after && distanceToBottom > 240);
  });

  return (
    <div
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-200 sm:hidden print:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="grid grid-cols-2 gap-3 [&>*]:h-12 [&>*]:text-base">{children}</div>
    </div>
  );
}
