interface ConfidencePromptProps {
  question: string;
  onSelect: (confidence: "low" | "medium" | "high") => void;
}

export function ConfidencePrompt({ question, onSelect }: ConfidencePromptProps) {
  return (
    <div className="confidence-prompt">
      <p className="confidence-question">{question}</p>
      <p className="confidence-label">How confident are you?</p>
      <div className="confidence-buttons">
        <button
          className="confidence-btn confidence-low"
          onClick={() => onSelect("low")}
        >
          Low
        </button>
        <button
          className="confidence-btn confidence-medium"
          onClick={() => onSelect("medium")}
        >
          Medium
        </button>
        <button
          className="confidence-btn confidence-high"
          onClick={() => onSelect("high")}
        >
          High
        </button>
      </div>
    </div>
  );
}
