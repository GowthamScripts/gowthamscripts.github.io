"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function TermPopover({
  term,
  definition,
  children,
}: {
  term: string;
  definition: string;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger className="cursor-help rounded-sm underline decoration-dotted underline-offset-4">
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-72 text-sm">
        <p className="font-semibold">{term}</p>
        <p className="mt-1 text-muted-foreground">{definition}</p>
      </PopoverContent>
    </Popover>
  );
}
