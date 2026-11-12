import { Bot, Database, Globe, Layers, Smartphone, Monitor, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  users: Users,
  web: Monitor,
  mobile: Smartphone,
  app: Layers,
  ai: Bot,
  data: Database,
  external: Globe,
};

type Block = {
  name: string;
  /** Picks the icon and style. "external" draws a dashed border for services outside the platform. */
  kind?: keyof typeof icons;
  /** Short line under the name, e.g. the technology. */
  tech?: string;
  items?: string[];
  note?: string;
  /** Wider blocks take two columns on desktop. */
  wide?: boolean;
};

type Layer = {
  label: string;
  blocks: Block[];
  /** What connects this layer to the next one down. */
  link?: string;
};

/**
 * A layered architecture diagram for case studies, drawn in HTML so it reflows on phones, follows
 * the theme and ships no JavaScript. Layers stack top to bottom (users → clients → platform →
 * data); each can name what connects it to the next. A text description sits behind a disclosure.
 */
export function ArchitectureDiagram({
  title,
  layers,
  frame,
  description,
}: {
  title: string;
  layers: Layer[];
  /** Optional label for a frame drawn around the layers after the first, e.g. the hosting. */
  frame?: { label: string; from: number };
  description: string;
}) {
  return (
    <figure className="mt-6 rounded-2xl border bg-muted/40 p-4 sm:p-6">
      <figcaption className="mb-5 flex items-baseline justify-between gap-4">
        <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Architecture
        </span>
        <span className="text-right text-sm font-medium">{title}</span>
      </figcaption>

      <div>
        {layers.map((layer, index) => {
          const framed = frame && index >= frame.from;
          const frameStart = frame && index === frame.from;
          const frameEnd = frame && index === layers.length - 1;
          return (
            <div
              key={layer.label}
              className={cn(
                framed && "border-x border-dashed border-primary/40 px-3 sm:px-4",
                frameStart && "rounded-t-xl border-t pt-3",
                frameEnd && "rounded-b-xl border-b pb-4",
              )}
            >
              {frameStart && <p className="mb-3 font-mono text-xs text-primary">{frame.label}</p>}
              <section aria-label={layer.label}>
                {/* Not a heading: the diagram sits under headings of different levels, and the
                    section is already labelled for assistive technology. */}
                <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {layer.label}
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {layer.blocks.map((block) => (
                    <BlockCard key={block.name} block={block} single={layer.blocks.length === 1} />
                  ))}
                </ul>
              </section>
              {index < layers.length - 1 && <Connector label={layer.link} />}
            </div>
          );
        })}
      </div>

      <details className="mt-5 text-sm">
        <summary className="cursor-pointer font-medium text-primary">Describe this diagram</summary>
        <p className="mt-2 leading-6 text-muted-foreground">{description}</p>
      </details>
    </figure>
  );
}

function BlockCard({ block, single }: { block: Block; single: boolean }) {
  const Icon = icons[block.kind ?? "app"];
  const external = block.kind === "external";
  return (
    <li
      className={cn(
        "rounded-xl border bg-card p-3.5",
        (block.wide || single) && "sm:col-span-2",
        external && "border-dashed bg-transparent",
        (block.kind === "app" || block.kind === "ai") && "border-primary/40",
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm leading-5 font-semibold">{block.name}</p>
          {block.tech && <p className="text-xs leading-5 text-muted-foreground">{block.tech}</p>}
        </div>
      </div>
      {block.items && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {block.items.map((item) => (
            <li
              key={item}
              className="rounded-md bg-muted px-2 py-0.5 text-xs leading-5 text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
      {block.note && <p className="mt-2 text-xs leading-5 text-muted-foreground">{block.note}</p>}
    </li>
  );
}

/** The connector between two layers: a short vertical line with what flows across it. */
function Connector({ label }: { label?: string }) {
  if (!label) {
    return (
      <div aria-hidden className="flex justify-center py-1">
        <span className="h-5 w-px bg-border" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center py-1.5">
      <span aria-hidden className="h-3 w-px bg-border" />
      <span className="rounded-full border bg-card px-3 py-0.5 text-center text-xs text-muted-foreground">
        <span className="sr-only">Connected by: </span>
        {label}
      </span>
      <span aria-hidden className="h-3 w-px bg-border" />
    </div>
  );
}
