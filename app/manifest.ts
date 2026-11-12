import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/content";

// Written to a file at build time for the static export.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const profile = getProfile();
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description: profile.seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#fbfaf8",
    theme_color: "#fbfaf8",
    icons: [
      { src: "/icon.png", sizes: "48x48", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
