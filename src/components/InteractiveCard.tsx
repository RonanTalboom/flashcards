import { useState } from "react";
import type { Card } from "../types";
import { Latex } from "./Latex";
import {
  KellyCurvePlot,
  EVCalculatorPlot,
  BayesUpdaterPlot,
  BrierScorePlot,
  VPINGaugePlot,
} from "./plots";

interface InteractiveCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onRate: (grade: number) => void;
}

const PLOT_COMPONENTS: Record<string, React.FC> = {
  "kelly-curve": KellyCurvePlot,
  "ev-calculator": EVCalculatorPlot,
  "bayes-updater": BayesUpdaterPlot,
  "brier-score": BrierScorePlot,
  "vpin-gauge": VPINGaugePlot,
};

export function InteractiveCard({
  card,
  currentIndex,
  queueLength,
  onRate,
}: InteractiveCardProps) {
  const [explored, setExplored] = useState(false);

  const PlotComponent = card.plotType ? PLOT_COMPONENTS[card.plotType] : null;

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="category-badge">{card.category}</span>
      </header>

      <div className="interactive-question">
        <Latex text={card.front} className="interactive-prompt" as="p" />
      </div>

      <div className="interactive-plot-area">
        {PlotComponent ? <PlotComponent /> : <p className="text-muted">Unknown plot type</p>}
      </div>

      {!explored ? (
        <div className="interactive-explore-cta">
          <p className="interactive-explore-hint">Drag the sliders to explore</p>
          <button className="fill-continue" onClick={() => setExplored(true)}>
            I've explored — show insight
          </button>
        </div>
      ) : (
        <div className="fill-feedback">
          <Latex text={card.back} className="fill-explanation" as="p" />
          {card.keyPoints.length > 0 && (
            <ul className="key-points">
              {card.keyPoints.map((kp, i) => (
                <li key={i}><Latex text={kp} /></li>
              ))}
            </ul>
          )}
          <p className="interactive-rate-prompt">How well did you understand this?</p>
          <div className="rating-buttons">
            <button className="rate-btn rate-again" onClick={() => onRate(0)}>
              <span className="rate-label">Again</span>
            </button>
            <button className="rate-btn rate-hard" onClick={() => onRate(2)}>
              <span className="rate-label">Hard</span>
            </button>
            <button className="rate-btn rate-good" onClick={() => onRate(4)}>
              <span className="rate-label">Good</span>
            </button>
            <button className="rate-btn rate-easy" onClick={() => onRate(5)}>
              <span className="rate-label">Easy</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
