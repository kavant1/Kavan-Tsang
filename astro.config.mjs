// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Canonical origin — required for canonical URLs, OpenGraph, and the sitemap.
  // GitHub Pages serves the user site at the lowercase host.
  site: "https://kavant1.github.io",
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
