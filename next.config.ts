import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // A fully static site, published to GitHub Pages. Each route is written as folder/index.html.
  output: "export",
  trailingSlash: true,
  // A static host has no image optimizer; images in /public are already sized and compressed.
  images: { unoptimized: true },
  turbopack: {
    // Pin the project root so a stray lockfile in a parent folder is not picked up.
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// With Turbopack, remark/rehype plugins must be given as strings (package names).
const withMDX = createMDX({
  options: {
    // remark-frontmatter hides the YAML block (the content layer reads it separately);
    // remark-gfm adds tables; rehype-slug gives headings the ids the table of contents links to.
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
