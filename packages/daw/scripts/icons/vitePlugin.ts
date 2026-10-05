import path from "node:path";
import type { Plugin } from "vite";
import { SVG_DIR, syncIcons } from "./generate.ts";

export function iconsPlugin(): Plugin {
  return {
    name: "icons",
    async buildStart() {
      await syncIcons();
    },
    configureServer(server) {
      server.watcher.add(SVG_DIR);
      let timer: ReturnType<typeof setTimeout> | undefined;
      const onChange = (file: string) => {
        if (!path.resolve(file).startsWith(SVG_DIR + path.sep)) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          syncIcons().catch((e) => server.config.logger.error(`[icons] ${e}`));
        }, 100);
      };
      for (const event of ["add", "change", "unlink", "unlinkDir", "addDir"]) {
        server.watcher.on(event, onChange);
      }
    },
  };
}
