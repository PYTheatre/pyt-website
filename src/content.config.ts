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
    // Runtime is tolerant by design: if a staffer ever saves a bad value
    // (text, blank-as-empty-string, a stray decimal), we quietly treat it as
    // "no runtime" rather than failing the ENTIRE site build. coerce turns a
    // numeric string into a number; catch() swallows anything uncoercible.
    runtime_minutes: z.coerce.number().int().positive().optional().catch(undefined),
    ages: z.string().optional(),
    poster: z.string().optional(),
    synopsis: z.string(),
    ticketing_url: z.string().optional(),
    audition_url: z.string().optional(),
    // Audition window. start/end are real dates used for auto-close logic;
    // display is the human-readable text families see. All optional and
    // tolerant: bad values are ignored rather than failing the whole build.
    audition_start: z.coerce.date().optional().catch(undefined),
    audition_end: z.coerce.date().optional().catch(undefined),
    audition_display: z.string().optional(),
    // Legacy single-date field from before the range change. Kept so old
    // content files that still have it don't break the build. Falls back to
    // acting as the end date when the new fields are absent.
    audition_date: z.coerce.date().optional().catch(undefined),
    cast_page_url: z.string().optional(),
    // --- DOUBLE-CAST PERFORMANCE SCHEDULE ---
    // ANY show can be double cast (Mainstage always is; SecondStage / Studio
    // shows sometimes are). When a show is double cast, the external ticketing
    // site (MVCPA) refuses to label which cast performs on which date — it
    // only shows venue codes. So we list it here: one row per performance with
    // date, time, cast name, and the buy link for THAT performance. The
    // schedule block only renders when double_cast is true AND at least one
    // valid performance row exists, so a non-double-cast show (or a
    // double-cast one with nothing entered yet) shows nothing. The two cast
    // names are stored once and only used as hint text in the CMS form.
    // Everything is optional and tolerant by design: item fields are optional
    // so one half-filled row doesn't discard the whole list; the page template
    // filters rows missing the essentials before rendering. The outer catch()
    // guards against a wholly malformed value failing the build.
    double_cast: z.boolean().optional().catch(undefined),
    cast_a_name: z.string().optional(),
    cast_b_name: z.string().optional(),
    performances: z
      .array(
        z.object({
          date_label: z.string().optional(),
          time_label: z.string().optional(),
          cast: z.string().optional(),
          buy_url: z.string().optional(),
        })
      )
      .optional()
      .catch(undefined),
  }),
});
 
// --- PROGRAMS ---
// One Markdown file per program (class, camp, intensive).
// Note: "Stories on Stage" was previously a program type. It now
// has its own dedicated section and collection — see below.
const programs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/programs" }),
  schema: z.object({
    name: z.string(),
    eyebrow: z.string().optional(),
    program_type: z.enum(["Class", "Camp", "Studio Intensive"]),
    age_range: z.string(),
    season: z.enum(["Fall", "Spring", "Summer", "Year-round"]),
    description: z.string(),
    schedule: z.string().optional(),
    tuition: z.string().optional(),
    registration_url: z.string().optional(),
    scholarships_available: z.boolean().default(false),
  }),
});
 
// --- STORIES ON STAGE PRODUCTIONS ---
// Stories on Stage is a parallel season to Mainstage: 6 productions
// per year, all cast from a single annual audition. Each production
// is short, often touring to schools as well as performing in-house.
// Unlike Mainstage shows, productions live entirely on the
// /stories-on-stage page (no per-production detail pages), so the
// schema is intentionally smaller than the Shows schema.
const storiesOnStage = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories-on-stage" }),
  schema: z.object({
    title: z.string(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    date_display: z.string(),
    venue: z.string(),
    synopsis: z.string(),
    poster: z.string().optional(),
    public_ticketing_url: z.string().optional(),
    school_bookings_url: z.string().optional(),
  }),
});
 
// --- CAST PAGES ---
// One entry per show's cast page. These live at unguessable URLs
// (/cast/<slug>) and are NOT in the site nav — they're linked only
// from newsletters sent to the cast. A soft client-side password
// gate keeps casual visitors out. IMPORTANT: this gate is NOT real
// security — the content is still delivered to the browser. It is
// only appropriate for non-sensitive info (first names, roles,
// general rehearsal times, production notes). No addresses, medical
// info, or other sensitive data should go here.
//
// Each page can embed up to two Google Sheets: a cast list (set once)
// and a rehearsal schedule (updated through the run). Either is
// optional; a page renders fine with one, both, or neither.
const castPages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cast-pages" }),
  schema: z.object({
    show_title: z.string(),
    password: z.string(),
    intro: z.string().optional(),
    cast_list_sheet_url: z.string().optional(),
    rehearsal_sheet_url: z.string().optional(),
    // Repeatable list of resource links (Google Drive folders etc.).
    // Tolerant by design: missing/empty is fine. Item fields are optional at
    // the schema level so one incomplete entry doesn't discard the whole list;
    // the page template filters out any item missing a label or url before
    // rendering. The outer catch guards against a wholly malformed value.
    resources: z
      .array(
        z.object({
          label: z.string().optional(),
          url: z.string().optional(),
        })
      )
      .optional()
      .catch(undefined),
    body: z.string().optional(),
  }),
});
 
// Expose the collections so Astro can discover them.
export const collections = { shows, programs, storiesOnStage, castPages };
