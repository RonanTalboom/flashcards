import { renderMarkdown } from "../lib/markdown";

interface MarkdownProps {
  text: string;
  className?: string;
}

export function Markdown({ text, className }: MarkdownProps) {
  return (
    <div
      className={className ? `markdown ${className}` : "markdown"}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
}
