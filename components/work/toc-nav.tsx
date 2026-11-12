"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Desktop table of contents for a case study. Highlights the section being read
 * (the last heading that has passed the top of the window).
 */
export function TocNav({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    const update = () => {
      const passed = headings.filter((heading) => heading.getBoundingClientRect().top <= 140);
      setActive((passed.at(-1) ?? headings[0])?.id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [items]);

  return (
    <nav aria-label="On this page" className="hidden lg:block" data-skim-hide>
      <div className="sticky top-24">
        <p className="text-sm font-medium">On this page</p>
        <ul className="mt-3 space-y-2 border-l text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l pl-4 transition-colors",
                  active === item.id
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
