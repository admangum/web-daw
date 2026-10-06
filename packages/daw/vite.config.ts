import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { iconsPlugin } from "./scripts/icons/vitePlugin.ts";

/**
 * vite's defineConfig only types Vite's own options.
 * It has no test key, so a test: { environment: "jsdom" }
 * block fails type-checking. vitest/config re-exports
 * defineConfig with the Vitest test option added to the
 * config type. At runtime the two are identical, since
 * defineConfig just returns its argument.
 *
 * https://vite.dev/config/
 */
export default defineConfig({
  plugins: [iconsPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@/ui": path.resolve(import.meta.dirname, "./src/ui/index"),
      "@/ui/icons": path.resolve(import.meta.dirname, "./src/ui/icons/index"),
      "@/util": path.resolve(import.meta.dirname, "./src/util"),
    },
  },
  test: {
    environment: "jsdom",
  },
});
