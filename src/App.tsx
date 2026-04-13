import { useFlashcards } from "./hooks/useFlashcards";
import { Dashboard } from "./components/Dashboard";
import { StudyCard } from "./components/StudyCard";
import { DoneScreen } from "./components/DoneScreen";
import { LearningPath } from "./components/LearningPath";
import { LessonIntro } from "./components/LessonIntro";
import { MCQCard } from "./components/MCQCard";
import { FillBlankCard } from "./components/FillBlankCard";
import { LessonComplete } from "./components/LessonComplete";
import { ClozeCard } from "./components/ClozeCard";
import { SECTIONS, getSectionByLessonId } from "./data/lessons";
import "./index.css";

export function App() {
  const fc = useFlashcards();

  if (fc.loading) {
    return (
      <div className="container">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  switch (fc.view) {
    case "dashboard":
      return (
        <Dashboard
          streak={fc.streak}
          dueCount={fc.dueCount}
          learnedCount={fc.learnedCount}
          totalCards={fc.totalCards}
          studyCount={fc.studyCount}
          xp={fc.xp}
          level={fc.level}
          levelProgress={fc.levelProgress}
          onLearn={fc.viewPath}
          onReview={() => fc.startStudy()}
        />
      );

    case "path":
      return (
        <LearningPath
          sections={SECTIONS}
          lessonMastery={fc.lessonMastery}
          onSelectLesson={fc.selectLesson}
        />
      );

    case "lesson-intro": {
      if (!fc.currentLesson) return null;
      const section = getSectionByLessonId(fc.currentLesson.id);
      return (
        <LessonIntro
          lesson={fc.currentLesson}
          sectionColor={section?.color ?? "#38b2ac"}
          sectionIcon={section?.icon ?? ""}
          masteryLevel={fc.lessonMastery[fc.currentLesson.id] ?? "available"}
          cardCount={fc.currentLesson.cards.length}
          onStart={fc.startLesson}
          onBack={fc.backToPath}
        />
      );
    }

    case "study": {
      if (!fc.currentCard) return null;
      const exerciseType = fc.currentCard.exerciseType ?? "flashcard";

      if (exerciseType === "mcq") {
        return (
          <MCQCard
            key={fc.currentCard.id}
            card={fc.currentCard}
            currentIndex={fc.currentIndex}
            queueLength={fc.queueLength}
            onAnswer={fc.answerCard}
          />
        );
      }

      if (exerciseType === "fill-blank") {
        return (
          <FillBlankCard
            key={fc.currentCard.id}
            card={fc.currentCard}
            currentIndex={fc.currentIndex}
            queueLength={fc.queueLength}
            onAnswer={fc.answerCard}
          />
        );
      }

      if (exerciseType === "cloze") {
        return (
          <ClozeCard
            key={fc.currentCard.id}
            card={fc.currentCard}
            currentIndex={fc.currentIndex}
            queueLength={fc.queueLength}
            onAnswer={fc.answerCard}
          />
        );
      }

      // Default: flashcard
      return (
        <StudyCard
          key={fc.currentCard.id}
          card={fc.currentCard}
          isFlipped={fc.isFlipped}
          currentIndex={fc.currentIndex}
          queueLength={fc.queueLength}
          onFlip={fc.flipCard}
          onRate={fc.rateCard}
          onBack={fc.isLessonMode ? fc.backToPath : undefined}
        />
      );
    }

    case "lesson-complete":
      return (
        <LessonComplete
          lessonTitle={fc.currentLesson?.title ?? "Lesson"}
          correctCount={fc.lessonCorrectCount}
          totalCount={fc.lessonTotalCount}
          xpEarned={fc.sessionXp}
          onContinue={fc.completeLesson}
        />
      );

    case "done":
      return (
        <DoneScreen
          streak={fc.streak}
          learnedCount={fc.learnedCount}
          totalReviews={fc.totalReviews}
          sessionXp={fc.sessionXp}
          onBack={fc.backToDashboard}
        />
      );
  }
}
