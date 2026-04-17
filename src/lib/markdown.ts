import { renderLatex } from "./katex";

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ESCAPE_MAP[c] ?? c);
}

function applyInline(s: string): string {
  // inline code first (so ** inside backticks isn't treated as bold)
  let out = s.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);

  // Escape the rest (splitting to avoid double-escaping code)
  const parts = out.split(/(<code>[\s\S]*?<\/code>)/);
  out = parts
    .map((p) => (p.startsWith("<code>") ? p : escapeHtml(p)))
    .join("");

  // Bold **x**, italic *x*, in that order
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");

  // Soft line break: two trailing spaces + newline, or single newline inside paragraph
  out = out.replace(/ {2,}\n/g, "<br />");

  return out;
}

/**
 * Renders a small markdown subset: paragraphs, bold, italic, inline code, unordered lists.
 * LaTeX delimiters `\(...\)` and `\[...\]` are preserved and rendered via katex at the end.
 * Keep it minimal — concept steps should be 1-2 sentences.
 */
export function renderMarkdown(text: string): string {
  if (!text) return "";
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  const html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Unordered list: every line starts with "- " or "* "
      const lines = trimmed.split("\n");
      if (lines.every((l) => /^[-*]\s+/.test(l))) {
        const items = lines
          .map((l) => l.replace(/^[-*]\s+/, ""))
          .map((l) => `<li>${applyInline(l)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      // Heading: "## foo"
      if (/^#{1,3}\s+/.test(trimmed)) {
        const level = trimmed.match(/^(#{1,3})/)?.[1].length ?? 2;
        const content = trimmed.replace(/^#{1,3}\s+/, "");
        return `<h${level}>${applyInline(content)}</h${level}>`;
      }

      // Paragraph — collapse internal newlines to soft breaks
      const joined = lines.join("\n").replace(/\n/g, "  \n");
      return `<p>${applyInline(joined)}</p>`;
    })
    .filter(Boolean)
    .join("");

  return renderLatex(html);
}
