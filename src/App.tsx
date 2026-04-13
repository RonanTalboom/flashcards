import { useFlashcards } from "./hooks/useFlashcards";
import { Dashboard } from "./components/Dashboard";
import { StudyCard } from "./components/StudyCard";
import { DoneScreen } from "./components/DoneScreen";
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
          categoryBreakdown={fc.categoryBreakdown}
          xp={fc.xp}
          level={fc.level}
          levelProgress={fc.levelProgress}
          onStartStudy={fc.startStudy}
        />
      );

    case "study":
      return fc.currentCard ? (
        <StudyCard
          key={fc.currentCard.id}
          card={fc.currentCard}
          isFlipped={fc.isFlipped}
          currentIndex={fc.currentIndex}
          queueLength={fc.queueLength}
          onFlip={fc.flipCard}
          onRate={fc.rateCard}
        />
      ) : null;

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
