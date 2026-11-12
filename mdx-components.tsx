import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/mdx/architecture-diagram";
import { Term } from "@/components/mdx/term";

/**
 * How plain Markdown elements look inside MDX content (long-form reading styles).
 * Case-study components (ArchitectureDiagram, Term) are registered here too.
 */
const components: MDXComponents = {
  Term,
  ArchitectureDiagram,
  h2: (props) => (
    <h2
      className="mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-8 scroll-mt-24 text-lg font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-7 text-pretty" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 leading-7" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 leading-7" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="font-medium text-primary underline underline-offset-4"
        {...props}
      />
    ) : (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4"
        target="_blank"
        rel="noreferrer"
        {...props}
      />
    ),
  blockquote: (props) => (
    <blockquote
      className="mt-4 rounded-r-lg border-l-4 border-warning bg-warning/10 py-2 pr-4 pl-4 text-sm [&>p]:mt-0"
      {...props}
    />
  ),
  table: (props) => (
    <div className="mt-6 overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[520px] text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-muted text-muted-foreground" {...props} />,
  th: (props) => <th className="px-4 py-2.5 font-medium" {...props} />,
  td: (props) => <td className="border-t px-4 py-3 align-top" {...props} />,
  code: (props) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
