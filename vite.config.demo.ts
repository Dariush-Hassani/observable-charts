import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/cockpit-charts/",
  plugins: [tailwindcss()],
});
