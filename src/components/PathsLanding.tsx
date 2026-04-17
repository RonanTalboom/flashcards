import type { Section, MasteryLevel } from "../types";

interface PathsLandingProps {
  sections: Section[];
  lessonMastery: Record<string, MasteryLevel>;
  onSelectPath: (sectionId: string) => void;
  onBack: () => void;
}

const MASTERY_RANK: Record<MasteryLevel, number> = {
  locked: 0,
  available: 1,
  familiar: 2,
  proficient: 3,
  mastered: 4,
};

function isCompleted(m: MasteryLevel): boolean {
  return MASTERY_RANK[m] >= MASTERY_RANK.proficient;
}

function isStarted(m: MasteryLevel): boolean {
  return MASTERY_RANK[m] >= MASTERY_RANK.familiar;
}

export function PathsLanding({
  sections,
  lessonMastery,
  onSelectPath,
  onBack,
}: PathsLandingProps) {
  const totalLessons = sections.reduce((s, sec) => s + sec.lessons.length, 0);
  const completedLessons = sections.reduce(
    (s, sec) =>
      s + sec.lessons.filter((l) => isCompleted(lessonMastery[l.id] ?? "locked")).length,
    0
  );
  const overallPct = totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;

  return (
    <div className="container">
      <header>
        <button className="back-btn" onClick={onBack} aria-label="Back">
          &#8592;
        </button>
        <h1>Learning Paths</h1>
        <span />
      </header>

      <div className="path-overview">
        <div className="path-overview-row">
          <span className="path-overview-label">Overall progress</span>
          <span className="path-overview-count">
            {completedLessons} / {totalLessons} lessons
          </span>
        </div>
        <div className="path-overview-track">
          <div
            className="path-overview-fill"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      <div className="paths-grid">
        {sections.map((section) => {
          const total = section.lessons.length;
          const completed = section.lessons.filter((l) =>
            isCompleted(lessonMastery[l.id] ?? "locked")
          ).length;
          const started = section.lessons.filter((l) =>
            isStarted(lessonMastery[l.id] ?? "locked")
          ).length;
          const pct = total === 0 ? 0 : (completed / total) * 100;
          const inProgress = started > 0 && completed < total;

          return (
            <button
              key={section.id}
              className="path-card"
              onClick={() => onSelectPath(section.id)}
              style={{
                borderColor: `${section.color}55`,
                background: `linear-gradient(140deg, ${section.color}1a, transparent 60%)`,
              }}
            >
              <div className="path-card-header">
                <span
                  className="path-card-icon"
                  style={{ color: section.color }}
                  dangerouslySetInnerHTML={{ __html: section.icon }}
                />
                <span
                  className="path-card-count"
                  style={{
                    color: section.color,
                    borderColor: `${section.color}55`,
                    background: `${section.color}14`,
                  }}
                >
                  {completed}/{total}
                </span>
              </div>
              <span className="path-card-title">{section.title}</span>
              <span className="path-card-desc">{section.description}</span>
              <div className="path-card-bar" aria-hidden="true">
                <div
                  className="path-card-bar-fill"
                  style={{ width: `${pct}%`, background: section.color }}
                />
              </div>
              <span
                className="path-card-status"
                style={{ color: section.color }}
              >
                {completed === total && total > 0
                  ? "Complete"
                  : inProgress
                    ? "In progress"
                    : "Start path"}
                <span className="path-card-arrow">&#8594;</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
