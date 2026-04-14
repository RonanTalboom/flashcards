import { renderLatex, hasLatex } from "../lib/katex";

interface LatexProps {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Latex({ text, className, as: Tag = "span" }: LatexProps) {
  if (!hasLatex(text)) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: renderLatex(text) }}
    />
  );
}
