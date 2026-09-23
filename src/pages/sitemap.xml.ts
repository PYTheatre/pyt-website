/*
  SITEMAP  ( /sitemap.xml )  — added 2026-09-23 for launch.

  Hand-built rather than via @astrojs/sitemap (no new dependency, and
  full control over what's listed). Lists every public page:
    - every static page file in src/pages (one entry per .astro file
      that isn't dynamic), minus the EXCLUDED list below;
    - every show, Stories on Stage production and CMS page.
  Deliberately NOT listed: cast pages (noindex, direct-link only), the
  thank-you page, the 404 page, /admin, and the old-site cast-page alias.

  Addresses are absolute, on `site` from astro.config.mjs — so after the
  switch they're all pytnet.org with no change needed here.
  robots.txt (src/pages/robots.txt.ts) points search engines at this file.
*/
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const EXCLUDED = new Set(["404", "thank-you", "sitemap.xml", "robots.txt"]);

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://pyt-website.pages.dev");

  // Static pages: every non-dynamic .astro file directly in src/pages.
  const files = import.meta.glob("./*.astro", { eager: false });
  const staticPaths = Object.keys(files)
    .map((p) => p.replace(/^\.\//, "").replace(/\.astro$/, ""))
    .filter((name) => !name.includes("[") && !EXCLUDED.has(name))
    .map((name) => (name === "index" ? "/" : `/${name}/`));

  // Dynamic pages from the content collections.
  const shows = await getCollection("shows");
  const sos = await getCollection("storiesOnStage");
  const pages = (await getCollection("pages")).filter((p: any) => !p.data.draft);
  const dynamicPaths = [
    "/shows/",
    ...shows.map((s) => `/shows/${s.id}/`),
    ...sos.map((s) => `/stories-on-stage/${s.id}/`),
    ...pages.map((p) => `/${p.id}/`),
  ];

  const all = Array.from(new Set([...staticPaths, ...dynamicPaths])).sort((x, y) =>
    x === "/" ? -1 : y === "/" ? 1 : x.localeCompare(y)
  );
  const today = new Date().toISOString().slice(0, 10);
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    all
      .map((p) => `  <url><loc>${new URL(p, base).href}</loc><lastmod>${today}</lastmod></url>`)
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
