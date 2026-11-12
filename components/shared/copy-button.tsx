"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { notify } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { writeToClipboard } from "@/lib/clipboard";

type CopyButtonProps = {
  /** Text to copy. Use "current-url" to copy the page address. */
  text: string;
  label: string;
  copiedMessage?: string;
  /** Analytics goal to record on a successful copy. */
  event?: AnalyticsEvent;
} & Pick<React.ComponentProps<typeof Button>, "variant" | "size" | "className">;

export function CopyButton({
  text,
  label,
  copiedMessage = "Copied",
  event,
  variant = "outline",
  size = "sm",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await writeToClipboard(text === "current-url" ? window.location.href : text);
      setCopied(true);
      if (event) track(event);
      notify("success", copiedMessage);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify("error", "Couldn't copy. Select the text and copy it manually.");
    }
  }

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={copy}>
      {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
      {label}
    </Button>
  );
}
