import katex from "katex";

/**
 * Renders LaTeX delimiters in text to HTML.
 * Uses \(...\) for inline math and \[...\] for display math.
 * Avoids $ delimiters to prevent conflicts with dollar amounts in quant cards.
 */
export function renderLatex(text: string): string {
  // Process display math first: \[...\]
  let result = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `\\[${tex}\\]`;
    }
  });

  // Then inline math: \(...\)
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `\\(${tex}\\)`;
    }
  });

  return result;
}

/** Check if text contains any LaTeX delimiters */
export function hasLatex(text: string): boolean {
  return /\\\(.*?\\\)/.test(text) || /\\\[.*?\\\]/.test(text);
}
