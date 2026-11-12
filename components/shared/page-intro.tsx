import { getPage } from "@/lib/site";

/** Page heading block: small label, title, one-line description. */
export function PageIntro({ href }: { href: string }) {
  const page = getPage(href);
  return (
    <header className="max-w-2xl space-y-4">
      <p className="font-mono text-xs tracking-widest text-primary uppercase">{page.label}</p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {page.title}
      </h1>
      <p className="text-lg text-muted-foreground">{page.description}</p>
    </header>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">
      {children}
    </span>
  );
}
