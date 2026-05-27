// @ts-check
import { defineConfig } from "astro/config";

// PYT website — static site for Cloudflare Pages.
//
// We deliberately use a STATIC build (output: "static") with NO
// server adapter. This is the simplest, most robust setup:
// Cloudflare Pages serves the generated "dist" folder directly.
// No serverless functions, nothing to maintain, nothing to break.
//
// The `site` value is the public address of the site. It is used
// for sitemaps and absolute URLs. Update it to the real domain
// (https://pytnet.org) at launch.
export default defineConfig({
  output: "static",
  site: "https://pyt-website.pages.dev",
});
