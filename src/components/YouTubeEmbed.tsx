import { useState } from "react";

function parseYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.slice(7);
      if (u.pathname.startsWith("/shorts/")) return u.pathname.slice(8);
    }
  } catch {
    return null;
  }
  return null;
}

export function YouTubeEmbed({ url }: { url: string }) {
  const [active, setActive] = useState(false);
  const videoId = parseYouTubeId(url);
  if (!videoId) return null;

  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="yt-embed" onClick={(e) => e.stopPropagation()}>
      {active ? (
        <iframe
          src={embedSrc}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="yt-embed-facade"
          style={{ backgroundImage: `url(${thumb})` }}
          onClick={() => setActive(true)}
          aria-label="Play video"
        >
          <span className="yt-embed-play">&#9654;</span>
        </button>
      )}
    </div>
  );
}
