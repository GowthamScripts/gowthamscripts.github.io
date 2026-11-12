"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export function PrintButton({
  label = "Print",
  ...props
}: { label?: string } & Pick<
  React.ComponentProps<typeof Button>,
  "variant" | "size" | "className"
>) {
  return (
    <Button
      type="button"
      onClick={() => {
        track("Resume Download", { method: "print" });
        window.print();
      }}
      {...props}
    >
      <Printer data-icon="inline-start" />
      {label}
    </Button>
  );
}
