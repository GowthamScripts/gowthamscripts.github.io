import { getProfile } from "@/lib/content";
import { renderShareImage } from "@/lib/og";

// Default share image for every page that doesn't have its own, written to share-image.png
// at build time (see app/icon.png/route.tsx).
export const dynamic = "force-static";

export function GET() {
  const profile = getProfile();
  return renderShareImage({
    eyebrow: `${profile.role} · ${profile.specialty} · ${profile.location}`,
    title: profile.name,
    subtitle: profile.hero.headline,
  });
}
