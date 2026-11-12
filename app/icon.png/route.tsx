import { getProfile } from "@/lib/content";
import { renderIcon } from "@/lib/og";

// Written to icon.png at build time. A route handler (not icon.tsx) so the file keeps its .png
// extension, which static hosts need to serve it as an image.
export const dynamic = "force-static";

export function GET() {
  return renderIcon(getProfile().initials, 48);
}
