import { useFlashcards } from "./hooks/useFlashcards";
import { Dashboard } from "./components/Dashboard";
import { StudyCard } from "./components/StudyCard";
import { DoneScreen } from "./components/DoneScreen";
import "./index.css";

export function App() {
  const fc = useFlashcards();

  switch (fc.view) {
    case "dashboard":
      return (
        <Dashboard
          streak={fc.state.stats.streak}
          dueCount={fc.dueCount}
          learnedCount={fc.learnedCount}
          totalCards={fc.totalCards}
          studyCount={fc.studyCount}
          categoryBreakdown={fc.categoryBreakdown}
          onStartStudy={fc.startStudy}
        />
      );

    case "study":
      return fc.currentCard ? (
        <StudyCard
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
          streak={fc.state.stats.streak}
          learnedCount={fc.learnedCount}
          totalReviews={fc.state.stats.totalReviews}
          onBack={fc.backToDashboard}
        />
      );
  }
}
