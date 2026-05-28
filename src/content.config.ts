// ============================================================
// ASTRO CONTENT COLLECTIONS
// ============================================================
// This file tells Astro about the content "collections" the
// CMS manages. Each collection is a set of files of the same
// shape (e.g. one file per show). The schema describes which
// fields each file has, so the page templates can read them
// safely.
//
// Single-record settings files (donation-campaign.json,
// donor-tiers.json, about-page.json, etc.) are NOT declared
// here — they're imported directly into the pages that use
// them as plain JSON. Collections are only for sets of items.
// ============================================================

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// --- SHOWS ---
// One Markdown file per show, under src/content/shows/.
// The frontmatter at the top of each file is validated against
// this schema. If a show is missing a required field, the build
// fails with a clear error pointing at which file and which field.
const shows = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/shows" }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    date_display: z.string(),
    venue: z.string(),
    runtime_minutes: z.number().int().optional(),
    ages: z.string().optional(),
    poster: z.string().optional(),
    synopsis: z.string(),
    ticketing_url: z.string().optional(),
    cast_page_url: z.string().optional(),
  }),
});

// --- PROGRAMS ---
// One Markdown file per program (class, camp, etc.).
const programs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/programs" }),
  schema: z.object({
    name: z.string(),
    eyebrow: z.string().optional(),
    program_type: z.enum(["Class", "Camp", "Stories on Stage", "Studio Intensive"]),
    age_range: z.string(),
    season: z.enum(["Fall", "Spring", "Summer", "Year-round"]),
    description: z.string(),
    schedule: z.string().optional(),
    tuition: z.string().optional(),
    registration_url: z.string().optional(),
    scholarships_available: z.boolean().default(false),
  }),
});

// Expose the collections so Astro can discover them.
export const collections = { shows, programs };
