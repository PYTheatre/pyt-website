/*
  SHOW TYPE LABELS

  A show's `production_type` is stored as "Musical" or "Studio
  Production". Those stored values are load-bearing: musicals.astro and
  studio-productions.astro filter on them, and every existing show file
  already contains them. So they are NOT renamed.

  What visitors read is a separate concern, and as of 2026-08-20 the
  wording is "Center Stage Musical" and "Studio Show" — matching the
  nav, the CMS dropdown, and how PYT actually refers to them. This map
  is the single place that translation happens, so the site can't end
  up calling the same thing two different names on two different pages.

  If the wording changes again, change it HERE, not in the templates.
*/

export const PRODUCTION_TYPE_LABELS: Record<string, string> = {
  "Musical": "Center Stage Musical",
  "Studio Production": "Studio Show",
};

/**
 * Visitor-facing label for a stored production_type value.
 * Unknown or missing values fall through unchanged rather than
 * becoming blank, so a hand-edited show file can never render an
 * empty label.
 */
export function productionTypeLabel(value: string | undefined | null): string {
  const v = (value || "").trim();
  if (!v) return "";
  return PRODUCTION_TYPE_LABELS[v] || v;
}
