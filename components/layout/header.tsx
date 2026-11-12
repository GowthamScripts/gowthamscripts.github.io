"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "@/components/layout/command-palette-loader";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { useScrollPosition } from "@/lib/hooks/use-scroll";
import { primaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Global header (docs/09-ux.md A2):
 * transparent at the top, compact with a border after 80px,
 * hides while scrolling down and returns when scrolling up.
 */
type HeaderProps = {
  name: string;
  initials: string;
  availability: { open: boolean; label: string };
};

export function Header({ name, initials, availability }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useScrollPosition((y, previous) => {
    setScrolled(y > 80);
    setHidden(y > previous && y > 240);
  });

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,translate] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] print:hidden",
        hidden && "-translate-y-full",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between gap-4 transition-[height] duration-200",
          scrolled ? "h-14" : "h-18",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-lg bg-foreground font-mono text-sm text-background"
          >
            {initials}
          </span>
          {/* The name is always the link's accessible name; on phones only the initials show. */}
          <span className="sr-only sm:not-sr-only">{name}</span>
          <span className="sr-only">, home</span>
          {availability.open && (
            <span className="relative flex size-2" title={availability.label}>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 [animation-iteration-count:3]" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
              <span className="sr-only">{availability.label}</span>
            </span>
          )}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((page) => {
            const active = pathname === page.href || pathname.startsWith(`${page.href}/`);
            return (
              <Link
                key={page.href}
                href={page.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {page.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-0.5 origin-center animate-underline rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Search the site"
            aria-keyshortcuts="Meta+K Control+K"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
          >
            <Search />
          </Button>
          <ThemeToggle />
          <Button asChild size="lg" className="hidden px-4 sm:inline-flex">
            <Link href="/contact">Contact</Link>
          </Button>
          <MobileNav pathname={pathname} name={name} />
        </div>
      </div>
    </header>
  );
}
