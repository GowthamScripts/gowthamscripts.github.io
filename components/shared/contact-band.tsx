import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getContact } from "@/lib/content";

/** Closing call to action used at the end of pages: Contact, Resume and LinkedIn. */
export function ContactBand({
  title = "Looking for a Technical Lead or Senior Software Engineer?",
  text,
}: {
  title?: string;
  text?: string;
}) {
  const { linkedin } = getContact().links;
  return (
    <section
      aria-label="Get in touch"
      className="mt-20 flex flex-col items-start gap-6 rounded-2xl bg-accent p-8 text-accent-foreground sm:p-10 lg:flex-row lg:items-center lg:justify-between print:hidden"
    >
      <div>
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-balance">{title}</h2>
        {text && <p className="mt-2 max-w-xl text-sm">{text}</p>}
      </div>
      <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild size="lg" className="h-12 px-5 text-base">
          <Link href="/contact">Contact me</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 px-5 text-base">
          <Link href="/resume">Resume</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 px-5 text-base">
          <a href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight data-icon="inline-end" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
      </div>
    </section>
  );
}
