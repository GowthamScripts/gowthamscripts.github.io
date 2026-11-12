import Link from "next/link";
import { getContact, getProfile } from "@/lib/content";
import { pages } from "@/lib/site";

export function Footer() {
  const site = getProfile();
  const contact = getContact();
  return (
    <footer className="mt-24 border-t print:hidden">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-2">
          <p className="font-semibold tracking-tight">{site.name}</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {site.role} · {site.specialty}
          </p>
          <p className="text-sm text-muted-foreground">{site.location}</p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-3 text-sm font-medium">Pages</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-muted-foreground hover:text-foreground">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-sm font-medium">Get in touch</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={contact.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={contact.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            Last updated {site.lastUpdated} · Press{" "}
            <kbd className="rounded border px-1 font-mono">⌘K</kbd> or{" "}
            <kbd className="rounded border px-1 font-mono">Ctrl K</kbd> to search
          </p>
          <p>Work shown is my own; confidential details are omitted or generalized.</p>
        </div>
      </div>
    </footer>
  );
}
