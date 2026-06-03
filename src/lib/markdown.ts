/*
  Markdown rendering for CMS "markdown"-widget fields.

  Decap's markdown widget saves real Markdown (e.g. **bold**, *italic*,
  bullet lists, [links](...)). Page templates that print those fields as
  raw text show the literal asterisks instead of formatting. Use this
  helper to convert a stored Markdown string into HTML, then inject it
  with `set:html`.

  Reusable: any field that uses the CMS "markdown" widget can be rendered
  through here, so formatting works consistently across the site.
*/
import { marked } from "marked";

marked.setOptions({
  breaks: false, // blank line = new paragraph (matches the CMS hint)
  gfm: true,
});

/** Convert a Markdown string to HTML. Empty/blank input returns "". */
export function renderMarkdown(input: string | undefined | null): string {
  if (!input || !input.trim()) return "";
  return marked.parse(input.trim()) as string;
}
