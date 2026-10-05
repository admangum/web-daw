import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { iconsPlugin } from "./scripts/icons/vitePlugin.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [iconsPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@/ui": path.resolve(import.meta.dirname, "./src/ui/index"),
      "@/ui/icons": path.resolve(import.meta.dirname, "./src/ui/icons/index"),
      "@/util": path.resolve(import.meta.dirname, "./src/util"),
    },
  },
});
