const ACCENTS = ["é", "è", "ê", "ë", "à", "â", "ç", "ù", "û", "ô", "î", "ï", "œ", "æ"];

interface AccentKeyboardProps {
  onInsert: (char: string) => void;
}

export function AccentKeyboard({ onInsert }: AccentKeyboardProps) {
  return (
    <div className="accent-keyboard">
      {ACCENTS.map((char) => (
        <button
          key={char}
          type="button"
          className="accent-key"
          onClick={() => onInsert(char)}
        >
          {char}
        </button>
      ))}
    </div>
  );
}
