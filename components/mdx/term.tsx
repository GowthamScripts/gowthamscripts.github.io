import { TermPopover } from "@/components/mdx/term-popover";
import { getGlossary } from "@/lib/content";

/**
 * A glossary term inside MDX: <Term id="Idempotency">idempotent</Term>.
 * Shows the definition from content/glossary.json in a pop-up. An unknown id fails the build.
 */
export function Term({ id, children }: { id: string; children?: React.ReactNode }) {
  const entry = getGlossary().find((item) => item.term.toLowerCase() === id.toLowerCase());
  if (!entry) {
    throw new Error(`<Term id="${id}"> is not in content/glossary.json.`);
  }
  return (
    <TermPopover term={entry.term} definition={entry.long ?? entry.short}>
      {children ?? entry.term}
    </TermPopover>
  );
}
