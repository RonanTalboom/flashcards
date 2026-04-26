import type { Section, MasteryLevel } from "../types";

interface LearningPathProps {
  section: Section;
  lessonMastery: Record<string, MasteryLevel>;
  onSelectLesson: (lessonId: string) => void;
  onBack: () => void;
}

const MASTERY_RANK: Record<MasteryLevel, number> = {
  locked: 0,
  available: 1,
  familiar: 2,
  proficient: 3,
  mastered: 4,
};

function isStarted(m: MasteryLevel): boolean {
  return MASTERY_RANK[m] >= MASTERY_RANK.familiar;
}

function isCompleted(m: MasteryLevel): boolean {
  return MASTERY_RANK[m] >= MASTERY_RANK.proficient;
}

function NodeGlyph({
  mastery,
  index,
  color,
}: {
  mastery: MasteryLevel;
  index: number;
  color: string;
}) {
  if (isCompleted(mastery)) {
    return (
      <svg
        className="lp-ico lp-ico-sm"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12l4.5 4.5L20 6" />
      </svg>
    );
  }
  if (mastery === "locked") {
    return (
      <svg
        className="lp-ico lp-ico-sm"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    );
  }
  return <span className="lp-node-num">{index + 1}</span>;
}

export function LearningPath({
  section,
  lessonMastery,
  onSelectLesson,
  onBack,
}: LearningPathProps) {
  const sectionTotal = section.lessons.length;
  const sectionCompleted = section.lessons.filter((l) =>
    isCompleted(lessonMastery[l.id] ?? "locked")
  ).length;
  const sectionStarted = section.lessons.filter((l) =>
    isStarted(lessonMastery[l.id] ?? "locked")
  ).length;

  const nextLesson = (() => {
    for (const l of section.lessons) {
      if ((lessonMastery[l.id] ?? "locked") === "available") return l;
    }
    for (const l of section.lessons) {
      const m = lessonMastery[l.id] ?? "locked";
      if (m !== "locked" && m !== "mastered") return l;
    }
    return null;
  })();

  const hue = section.color;
  const tint = `color-mix(in oklch, ${hue} 14%, transparent)`;
  const ring = `color-mix(in oklch, ${hue} 22%, transparent)`;
  const nextBorder = `color-mix(in oklch, ${hue} 50%, var(--border))`;

  return (
    <div className="container lp-container">
      <header className="lp-topbar">
        <button className="lp-icon-btn" onClick={onBack} aria-label="Back">
          <svg
            className="lp-ico"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <span className="lp-brand">{section.title}</span>
        <span className="lp-topbar-spacer" />
      </header>

      <div className="lp-context">
        <div
          className="lp-context-glyph"
          style={{ color: hue, background: tint }}
        >
          <span
            className="lp-context-icon"
            dangerouslySetInnerHTML={{ __html: section.icon }}
          />
        </div>
        <div className="lp-context-body">
          <span className="lp-eyebrow" style={{ color: hue }}>
            {section.description}
          </span>
          <span className="lp-context-meta">
            {sectionCompleted} of {sectionTotal} lessons
            {sectionStarted > sectionCompleted
              ? ` · ${sectionStarted - sectionCompleted} in progress`
              : ""}
          </span>
        </div>
      </div>

      {nextLesson && (
        <button
          className="lp-next"
          onClick={() => onSelectLesson(nextLesson.id)}
          style={{ borderColor: nextBorder }}
        >
          <div className="lp-next-body">
            <span className="lp-eyebrow" style={{ color: hue }}>
              Up next
            </span>
            <span className="lp-next-title">{nextLesson.title}</span>
            <span className="lp-next-desc">{nextLesson.description}</span>
          </div>
          <svg
            className="lp-ico lp-next-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      )}

      <div className="lp-divider" />

      <ol className="lp-list">
        {section.lessons.map((lesson, i) => {
          const mastery = lessonMastery[lesson.id] ?? "locked";
          const isLocked = mastery === "locked";
          const isAvailable = mastery === "available";
          const completed = isCompleted(mastery);
          const isLast = i === section.lessons.length - 1;

          const nodeStyle =
            !isLocked && (isAvailable || completed)
              ? {
                  borderColor: hue,
                  color: hue,
                  boxShadow: isAvailable ? `0 0 0 4px ${ring}` : undefined,
                  background: completed ? tint : undefined,
                }
              : undefined;

          return (
            <li
              key={lesson.id}
              className={`lp-item lp-item--${mastery} ${isLocked ? "is-locked" : ""}`}
            >
              <div className="lp-spine">
                <div
                  className={`lp-node lp-node--${mastery}`}
                  style={nodeStyle}
                >
                  <NodeGlyph mastery={mastery} index={i} color={hue} />
                </div>
                {!isLast && <div className="lp-spine-line" />}
              </div>
              <button
                className="lp-row"
                disabled={isLocked}
                onClick={() => !isLocked && onSelectLesson(lesson.id)}
              >
                <div className="lp-row-body">
                  <span className="lp-row-title">{lesson.title}</span>
                  <span className="lp-row-desc">{lesson.description}</span>
                </div>
                {!isLocked && (
                  <svg
                    className="lp-ico lp-row-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
