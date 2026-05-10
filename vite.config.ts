import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "CockpitCharts",
      fileName: "cockpit-charts",
    },
    sourcemap: true,
    rollupOptions: {
      external: [/^d3-.*/],
    },
  },
  plugins: [dts(), tailwindcss()],
});
