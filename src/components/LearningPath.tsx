import type { Section, MasteryLevel } from "../types";

interface LearningPathProps {
  sections: Section[];
  lessonMastery: Record<string, MasteryLevel>;
  onSelectLesson: (lessonId: string) => void;
  onBack?: () => void;
}

function MasteryNode({
  mastery,
  color,
}: {
  mastery: MasteryLevel;
  color: string;
}) {
  const size = 40;
  const cx = size / 2;
  const cy = size / 2;
  const r = 14;

  if (mastery === "locked") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#1a2332" stroke="#7a8a99" strokeWidth="2" />
        {/* Lock icon */}
        <rect x="15" y="19" width="10" height="8" rx="1.5" fill="#7a8a99" />
        <path
          d="M17 19v-3a3 3 0 0 1 6 0v3"
          fill="none"
          stroke="#7a8a99"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (mastery === "available") {
    return (
      <svg
        className="path-node-pulse"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={color} strokeWidth="2.5" />
        <circle cx={cx} cy={cy} r="4" fill={color} />
      </svg>
    );
  }

  if (mastery === "familiar") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={color} strokeWidth="2" />
        {/* Half fill */}
        <clipPath id="half-clip">
          <rect x="0" y={cy} width={size} height={cy} />
        </clipPath>
        <circle
          cx={cx}
          cy={cy}
          r={r - 1}
          fill={color}
          opacity="0.6"
          clipPath="url(#half-clip)"
        />
      </svg>
    );
  }

  if (mastery === "proficient") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={color} stroke={color} strokeWidth="2" />
        {/* Checkmark */}
        <path
          d="M14 20l4 4 8-8"
          fill="none"
          stroke="#070b0d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // mastered
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r + 3} fill="transparent" stroke="#d4a843" strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={color} strokeWidth="2" />
      {/* Star */}
      <path
        d="M20 13l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z"
        fill="#d4a843"
      />
    </svg>
  );
}

export function LearningPath({
  sections,
  lessonMastery,
  onSelectLesson,
  onBack,
}: LearningPathProps) {
  return (
    <div className="container">
      <header>
        {onBack && (
          <button className="back-btn" onClick={onBack} aria-label="Back">
            &#8592;
          </button>
        )}
        <h1>Learning Path</h1>
        <span />
      </header>

      <div className="path-map">
        {sections.map((section) => (
          <div className="path-section" key={section.id}>
            <div className="path-section-header">
              <span
                className="path-section-icon"
                style={{ color: section.color }}
                dangerouslySetInnerHTML={{ __html: section.icon }}
              />
              <span className="path-section-title">{section.title}</span>
            </div>

            <div className="path-lessons">
              {section.lessons.map((lesson, lessonIndex) => {
                const mastery = lessonMastery[lesson.id] || "locked";
                const isClickable = mastery !== "locked";
                const isLast = lessonIndex === section.lessons.length - 1;

                return (
                  <div className="path-lesson" key={lesson.id}>
                    <div className="path-node-col">
                      <button
                        className={`path-node path-node--${mastery}`}
                        disabled={!isClickable}
                        onClick={() => isClickable && onSelectLesson(lesson.id)}
                        aria-label={`${lesson.title} - ${mastery}`}
                      >
                        <MasteryNode mastery={mastery} color={section.color} />
                      </button>
                      {!isLast && (
                        <div
                          className="path-line"
                          style={{
                            borderColor:
                              mastery !== "locked"
                                ? section.color
                                : "#1a2332",
                          }}
                        />
                      )}
                    </div>
                    <div
                      className={`path-label ${!isClickable ? "path-label--locked" : ""}`}
                      onClick={() => isClickable && onSelectLesson(lesson.id)}
                    >
                      <span className="path-lesson-title">{lesson.title}</span>
                      <span className="path-lesson-desc">{lesson.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
