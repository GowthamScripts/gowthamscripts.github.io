import { getProfile } from "@/lib/content";
import { renderIcon } from "@/lib/og";

// Written to apple-icon.png at build time (see app/icon.png/route.tsx).
export const dynamic = "force-static";

export function GET() {
  return renderIcon(getProfile().initials, 180);
}
