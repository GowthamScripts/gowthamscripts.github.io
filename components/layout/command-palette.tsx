"use client";

import { Copy, FileText, Mail, SunMoon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { writeToClipboard } from "@/lib/clipboard";
import { notify } from "@/lib/toast";

export type PaletteItem = { group: string; label: string; href: string; keywords?: string };

/** The ⌘K search box (docs/09-ux.md A4). Loaded only when first opened. */
export default function CommandPalette({
  open,
  onOpenChange,
  items,
  email,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PaletteItem[];
  email: string;
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const groups = [...new Set(items.map((item) => item.group))];

  const run = (action: () => void) => {
    onOpenChange(false);
    action();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search the site"
      description="Find a page, case study or project, or run an action."
    >
      {/* Plain "every word appears" matching; the default fuzzy matching returned unrelated pages. */}
      <Command
        filter={(value, search) =>
          search
            .toLowerCase()
            .split(/\s+/)
            .every((word) => value.toLowerCase().includes(word))
            ? 1
            : 0
        }
      >
        <CommandInput placeholder="Search pages, case studies, projects…" />
        <CommandList>
          <CommandEmpty>Nothing found.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {items
                .filter((item) => item.group === group)
                .map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`${item.label} ${item.keywords ?? ""}`}
                    onSelect={() => run(() => router.push(item.href))}
                  >
                    {item.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
          <CommandGroup heading="Actions">
            <CommandItem
              value="Copy email address"
              onSelect={() =>
                run(() => {
                  writeToClipboard(email).then(
                    () => notify("success", "Email copied"),
                    () => notify("error", "Couldn't copy the email."),
                  );
                })
              }
            >
              <Copy /> Copy email address
            </CommandItem>
            <CommandItem
              value="Send a message contact"
              onSelect={() => run(() => router.push("/contact"))}
            >
              <Mail /> Send a message
            </CommandItem>
            <CommandItem value="Open resume cv" onSelect={() => run(() => router.push("/resume"))}>
              <FileText /> Open resume
            </CommandItem>
            <CommandItem
              value="Toggle theme dark light mode"
              onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
            >
              <SunMoon /> Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
