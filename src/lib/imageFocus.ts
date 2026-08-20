/*
  IMAGE FOCUS — shared helper for cropped photos.

  THE PROBLEM THIS SOLVES:
  Photos on this site sit in fixed-shape frames and are cropped to fill
  them (CSS `object-fit: cover`, or `background-size: cover`). By
  default the browser keeps the MIDDLE of the photo and throws away the
  rest — which slices the top off anything where the subject sits high
  in the frame, faces especially. In a wide banner the crop is severe:
  a 21:6 frame keeps only about a third of a typical landscape photo's
  height, so "just centre it" is often wrong.

  WHAT THIS DOES:
  Turns a single CMS number (0-100) into a CSS position value:
      0   = keep the TOP of the photo
      50  = keep the middle  (the default, and how the site behaved
            before this existed)
      100 = keep the BOTTOM

  WHY A NUMBER AND NOT A "TOP / CENTRE / BOTTOM" DROPDOWN:
  Named stops are too coarse for the wide frames. A real example: the
  Auditions hero photo needs roughly 15 to keep the whole face — which
  sits between "Top" (0) and "Upper third" (33), so neither option
  would have fixed it. A number gives staff the precision the wide
  crops actually require.

  TOLERANT BY DESIGN: anything missing, blank, non-numeric or out of
  range falls back to 50, so a half-filled or mistyped CMS field can
  never produce broken CSS — it just behaves the way the site did
  before.
*/

export const DEFAULT_FOCUS = 50;

/** Clamp any CMS value to a usable 0-100 number. */
export function focusValue(raw: unknown): number {
  const n = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
  if (!Number.isFinite(n)) return DEFAULT_FOCUS;
  return Math.min(100, Math.max(0, n));
}

/**
 * For an <img> using `object-fit: cover`.
 * Horizontal stays centred: the wide frames on this site crop
 * vertically, so a horizontal control would be a field staff have to
 * think about without it changing anything.
 */
export function objectPosition(raw: unknown): string {
  return `50% ${focusValue(raw)}%`;
}

/** For an element using `background-size: cover`. Same idea. */
export function backgroundPosition(raw: unknown): string {
  return `50% ${focusValue(raw)}%`;
}
