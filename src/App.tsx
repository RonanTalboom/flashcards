import { useEffect } from "react";
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
import { MathCard } from "./components/MathCard";
import { InteractiveCard } from "./components/InteractiveCard";
import { SpeedReview } from "./components/SpeedReview";
import { MatchGame } from "./components/MatchGame";
import { QuizMode } from "./components/QuizMode";
import { StatsView } from "./components/StatsView";
import { SessionProgressBar } from "./components/SessionProgressBar";
import { AchievementToast } from "./components/AchievementToast";
import { ConfidencePrompt } from "./components/ConfidencePrompt";
import { ListeningCard } from "./components/ListeningCard";
import { ConjugationCard } from "./components/ConjugationCard";
import { PretestCard } from "./components/PretestCard";
import { OrderingCard } from "./components/OrderingCard";
import { SECTIONS, getSectionByLessonId } from "./data/lessons";
import "./index.css";

export function App() {
  const fc = useFlashcards();

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (fc.view) {
        case "dashboard":
          if (e.key === "Enter" && fc.dueCount > 0) {
            e.preventDefault();
            fc.startStudy();
          }
          break;
        case "path":
          if (e.key === "Escape") fc.backToDashboard();
          break;
        case "lesson-intro":
          if (e.key === "Enter") {
            e.preventDefault();
            fc.startLesson();
          } else if (e.key === "Escape") {
            fc.backToPath();
          }
          break;
        case "lesson-complete":
          if (e.key === "Enter") {
            e.preventDefault();
            fc.completeLesson();
          }
          break;
        case "done":
          if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault();
            fc.backToDashboard();
          }
          break;
        case "speed-review":
        case "match-game":
        case "quiz-mode":
        case "stats":
          if (e.key === "Escape") fc.backToDashboard();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fc.view, fc.dueCount, fc.startStudy, fc.backToDashboard, fc.startLesson, fc.completeLesson, fc.backToPath]);

  if (fc.loading) {
    return (
      <div className="container">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <AchievementToast
        achievement={fc.pendingAchievement}
        onDismiss={fc.dismissAchievement}
      />
      {renderView()}
    </>
  );

  function renderView() {
    switch (fc.view) {
      case "dashboard":
        return (
          <Dashboard
            streak={fc.streak}
            longestStreak={fc.longestStreak}
            streakFreezes={fc.streakFreezes}
            dueCount={fc.dueCount}
            learnedCount={fc.learnedCount}
            totalCards={fc.totalCards}
            studyCount={fc.studyCount}
            xp={fc.xp}
            level={fc.level}
            levelProgress={fc.levelProgress}
            onLearn={fc.viewPath}
            onReview={() => fc.startStudy()}
            todayReviewCount={fc.todayReviewCount}
            dailyGoal={fc.dailyGoal}
            difficultCount={fc.difficultCount}
            reviewLog={fc.reviewLog}
            onDifficultReview={fc.startDifficultReview}
            onSpeedReview={fc.startSpeedReview}
            onMatchGame={fc.startMatchGame}
            onQuizMode={fc.startQuizMode}
            onStats={fc.viewStats}
            achievements={fc.achievements}
            calibrationAccuracy={fc.calibrationAccuracy}
          />
        );

      case "path":
        return (
          <LearningPath
            sections={SECTIONS}
            lessonMastery={fc.lessonMastery}
            onSelectLesson={fc.selectLesson}
            onBack={fc.backToDashboard}
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

        // Pretest: diagnostic question before teaching (no penalty, no confidence prompt)
        if (exerciseType === "pretest") {
          return (
            <>
              <SessionProgressBar current={fc.currentIndex} total={fc.queueLength} />
              <PretestCard
                key={fc.currentCard.id}
                card={fc.currentCard}
                currentIndex={fc.currentIndex}
                queueLength={fc.queueLength}
                onAnswer={fc.answerCard}
              />
            </>
          );
        }

        // Confidence prompt before interactive/answer cards (not flashcards)
        if (
          fc.pendingConfidence === null &&
          !fc.isFlipped &&
          (exerciseType === "mcq" || exerciseType === "fill-blank" || exerciseType === "math")
        ) {
          return (
            <>
              <SessionProgressBar current={fc.currentIndex} total={fc.queueLength} />
              <ConfidencePrompt
                question={fc.currentCard.front}
                onSelect={fc.setConfidence}
              />
            </>
          );
        }

        if (exerciseType === "mcq") {
          return (
            <>
              <SessionProgressBar current={fc.currentIndex} total={fc.queueLength} />
              <MCQCard
                key={fc.currentCard.id}
                card={fc.currentCard}
                currentIndex={fc.currentIndex}
                queueLength={fc.queueLength}
                onAnswer={fc.answerCard}
              />
            </>
          );
        }

        if (exerciseType === "ordering") {
          return (
            <>
              <SessionProgressBar current={fc.currentIndex} total={fc.queueLength} />
              <OrderingCard
                key={fc.currentCard.id}
                card={fc.currentCard}
                currentIndex={fc.currentIndex}
                queueLength={fc.queueLength}
                onAnswer={fc.answerCard}
              />
            </>
          );
        }

        if (exerciseType === "fill-blank") {
          return (
            <>
              <SessionProgressBar current={fc.currentIndex} total={fc.queueLength} />
              <FillBlankCard
                key={fc.currentCard.id}
                card={fc.currentCard}
                currentIndex={fc.currentIndex}
                queueLength={fc.queueLength}
                onAnswer={fc.answerCard}
              />
            </>
          );
        }

        if (exerciseType === "cloze") {
          return (
            <>
              <SessionProgressBar current={fc.currentIndex} total={fc.queueLength} />
              <ClozeCard
                key={fc.currentCard.id}
                card={fc.currentCard}
                currentIndex={fc.currentIndex}
                queueLength={fc.queueLength}
                onAnswer={fc.answerCard}
              />
            </>
          );
        }

        if (exerciseType === "math") {
          return (
            <>
              <SessionProgressBar current={fc.currentIndex} total={fc.queueLength} />
              <MathCard
                key={fc.currentCard.id}
                card={fc.currentCard}
                currentIndex={fc.currentIndex}
                queueLength={fc.queueLength}
                onAnswer={fc.answerCard}
              />
            </>
          );
        }

        if (exerciseType === "interactive") {
          return (
            <InteractiveCard
              key={fc.currentCard.id}
              card={fc.currentCard}
              currentIndex={fc.currentIndex}
              queueLength={fc.queueLength}
              onRate={fc.rateCard}
            />
          );
        }

        if (exerciseType === "listening") {
          return (
            <ListeningCard
              key={fc.currentCard.id}
              card={fc.currentCard}
              currentIndex={fc.currentIndex}
              queueLength={fc.queueLength}
              onAnswer={fc.answerCard}
            />
          );
        }

        if (exerciseType === "conjugation") {
          return (
            <ConjugationCard
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
            comboCount={fc.comboCount}
            schedulingIntervals={fc.schedulingIntervals}
            onFlip={fc.flipCard}
            onRate={fc.rateCard}
            onBack={fc.isLessonMode ? fc.backToPath : undefined}
          />
        );
      }

      case "speed-review": {
        return (
          <SpeedReview
            cards={fc.allCards.filter((c) => {
              const s = fc.cardStates[c.id];
              return s && s.nextReviewDate <= new Date().toISOString().slice(0, 10);
            }).slice(0, 20)}
            onRate={fc.rateCard}
            onBack={fc.backToDashboard}
            currentIndex={fc.currentIndex}
            queueLength={fc.queueLength}
          />
        );
      }

      case "match-game":
        return (
          <MatchGame
            cards={fc.allCards.filter((c) => fc.cardStates[c.id]?.reps > 0).slice(0, 30)}
            onBack={fc.backToDashboard}
            onComplete={fc.updateMatchBestTime}
            bestTime={fc.matchBestTime}
          />
        );

      case "quiz-mode":
        return (
          <QuizMode
            cards={fc.allCards.filter((c) => fc.cardStates[c.id]?.reps > 0)}
            onBack={fc.backToDashboard}
          />
        );

      case "stats":
        return (
          <StatsView
            reviewLog={fc.reviewLog}
            retentionRate={fc.retentionRate}
            cardStateCounts={fc.cardStateCounts}
            hardestCards={fc.hardestCards}
            cardStates={fc.cardStates}
            reviewForecast={fc.reviewForecast}
            streak={fc.streak}
            longestStreak={fc.longestStreak}
            totalReviews={fc.totalReviews}
            leechCount={fc.leechCount}
            onBack={fc.backToDashboard}
          />
        );

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
            bestCombo={fc.bestCombo}
            onBack={fc.backToDashboard}
          />
        );
    }
  }
}
