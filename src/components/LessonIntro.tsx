import type { Lesson, MasteryLevel } from "../types";

interface LessonIntroProps {
  lesson: Lesson;
  sectionColor: string;
  sectionIcon: string;
  masteryLevel: MasteryLevel;
  cardCount: number;
  onStart: () => void;
  onBack: () => void;
}

function masteryLabel(level: MasteryLevel): string {
  switch (level) {
    case "locked":
      return "Locked";
    case "available":
      return "New";
    case "familiar":
      return "Familiar";
    case "proficient":
      return "Proficient";
    case "mastered":
      return "Mastered";
  }
}

export function LessonIntro({
  lesson,
  sectionColor,
  sectionIcon,
  masteryLevel,
  cardCount,
  onStart,
  onBack,
}: LessonIntroProps) {
  return (
    <div className="container">
      <button className="intro-back" onClick={onBack}>
        &#8592; Back
      </button>

      <div className="intro-header">
        <span
          className="intro-icon"
          style={{ background: `${sectionColor}1a`, color: sectionColor }}
          dangerouslySetInnerHTML={{ __html: sectionIcon }}
        />
        <h1 className="intro-title">{lesson.title}</h1>
        <p className="intro-desc">{lesson.description}</p>
      </div>

      <div className="intro-meta">
        <span className="intro-mastery" style={{ color: sectionColor }}>
          {masteryLabel(masteryLevel)}
        </span>
        <span className="intro-dot">&#183;</span>
        <span className="intro-count">
          {cardCount} exercise{cardCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="intro-concepts">
        <h2 className="intro-concepts-title">Key Concepts</h2>
        <ul className="intro-concepts-list">
          {lesson.concepts.map((concept, i) => (
            <li key={i} className="intro-concept">{concept}</li>
          ))}
        </ul>
      </div>

      <button
        className="intro-start"
        style={{ background: sectionColor }}
        onClick={onStart}
      >
        Start Lesson
      </button>
    </div>
  );
}
