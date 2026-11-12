"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { pages } from "@/lib/site";

/** The menu sheet itself. Loaded on demand by mobile-nav.tsx, so Radix Dialog isn't in the first download. */
export default function MobileNavSheet({
  pathname,
  name,
  open,
  setOpen,
}: {
  pathname: string;
  name: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const close = () => setOpen(false);
  const links = pages.filter((p) => p.href !== "/contact" && p.href !== "/resume");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          <Link
            href="/"
            onClick={close}
            aria-current={pathname === "/" ? "page" : undefined}
            className={cn(
              "flex min-h-14 items-center border-b text-lg font-medium",
              pathname === "/" && "text-primary",
            )}
          >
            Home
          </Link>
          {links.map((page) => {
            const active = pathname === page.href || pathname.startsWith(`${page.href}/`);
            return (
              <Link
                key={page.href}
                href={page.href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 items-center border-b text-lg font-medium last:border-b-0",
                  active && "text-primary",
                )}
              >
                {page.title}
              </Link>
            );
          })}
        </nav>
        <div className="grid grid-cols-2 gap-3 p-4">
          <Button asChild variant="outline" className="h-12 text-base">
            <Link href="/resume" onClick={close}>
              Resume
            </Link>
          </Button>
          <Button asChild className="h-12 text-base">
            <Link href="/contact" onClick={close}>
              Contact
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
