/*
  ROBOTS.TXT  ( /robots.txt )  — added 2026-09-23 for launch.

  Allows everything and points at the sitemap. Do NOT add "Disallow: /"
  here to hide the temporary .pages.dev address — that would hide the real
  domain too; that job is done per-hostname in public/_headers (see the
  note there). Cast pages are kept out of search by a header, not here,
  because a "noindex" only works if the crawler is allowed to fetch the
  page; blocking it in robots.txt would hide the noindex from Google.

  The sitemap address comes from `site` in astro.config.mjs, so it's
  correct on whichever domain the site is built for.
*/
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://pyt-website.pages.dev");
  const body = `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${new URL("/sitemap.xml", base).href}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
