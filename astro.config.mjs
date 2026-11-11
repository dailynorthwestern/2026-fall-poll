import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://dailynorthwestern.github.io",
  base: process.env.SITE_BASE || "/2026-fall-poll/",
});
