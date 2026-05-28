import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "PFDCharts",
      fileName: "PFD-charts",
    },
    sourcemap: true,
    rollupOptions: {
      external: [/^d3-.*/],
      output: {
        globals: {
          "d3-selection": "d3",
          "d3-array": "d3",
          "d3-scale": "d3",
          "d3-shape": "d3",
        },
      },
    },
    copyPublicDir: false,
  },
  plugins: [dts(), tailwindcss()],
});
