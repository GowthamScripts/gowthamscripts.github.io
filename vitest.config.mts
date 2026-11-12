import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // `server-only` throws outside Next.js; tests run in plain Node.
      "server-only": fileURLToPath(new URL("./tests/stubs/empty.ts", import.meta.url)),
      "@": fileURLToPath(new URL("./", import.meta.url)).replace(/\/$/, ""),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
