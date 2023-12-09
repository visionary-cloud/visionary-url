import { resolve } from "path";
import dts from "vite-plugin-dts";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "visionary-url",
      name: "VisionaryUrl",
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
