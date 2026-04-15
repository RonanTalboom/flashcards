import { useEffect, useState } from "react";
import type { Achievement } from "../types";

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className={`achievement-toast ${visible ? "achievement-toast-visible" : ""}`}>
      <span className="achievement-toast-icon">{achievement.icon}</span>
      <div className="achievement-toast-content">
        <span className="achievement-toast-title">Achievement Unlocked!</span>
        <span className="achievement-toast-name">{achievement.title}</span>
        <span className="achievement-toast-desc">{achievement.description}</span>
      </div>
    </div>
  );
}
