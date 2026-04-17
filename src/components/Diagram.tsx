import { useEffect, useState } from "react";

interface DiagramProps {
  src: string;
  caption?: string;
  alt?: string;
}

/**
 * Renders a bundled SVG/PNG diagram with an optional caption.
 * Tap to open a fullscreen overlay. Press Escape to close.
 */
export function Diagram({ src, caption, alt }: DiagramProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <figure className="diagram" onClick={() => setOpen(true)}>
        <img
          className="diagram-img"
          src={src}
          alt={alt ?? caption ?? "diagram"}
          loading="lazy"
        />
        {caption && <figcaption className="diagram-caption">{caption}</figcaption>}
      </figure>
      {open && (
        <div
          className="diagram-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Expanded diagram"
        >
          <img
            className="diagram-overlay-img"
            src={src}
            alt={alt ?? caption ?? "diagram"}
          />
          {caption && (
            <div className="diagram-overlay-caption">{caption}</div>
          )}
          <button
            type="button"
            className="diagram-overlay-close"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
