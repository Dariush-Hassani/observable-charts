import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/PFD-charts/",
  plugins: [tailwindcss()],
});
