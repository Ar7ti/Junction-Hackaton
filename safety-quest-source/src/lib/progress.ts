import { useCallback, useEffect, useState } from "react";
import { BADGES, SCENARIOS, scenariosForLevel } from "./gameData";

const KEY = "safety-quest-progress-v1";

export interface Progress {
  stars: Record<string, number>; // scenarioId -> stars earned (best)
  completed: string[]; // scenario ids finished at least once
}

const EMPTY: Progress = { stars: {}, completed: [] };

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return { stars: parsed.stars ?? {}, completed: parsed.completed ?? [] };
  } catch {
    return EMPTY;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);

  useEffect(() => {
    setProgress(load());
  }, []);

  const recordResult = useCallback((scenarioId: string, stars: number) => {
    setProgress((prev) => {
      const next: Progress = {
        stars: { ...prev.stars, [scenarioId]: Math.max(prev.stars[scenarioId] ?? 0, stars) },
        completed: prev.completed.includes(scenarioId)
          ? prev.completed
          : [...prev.completed, scenarioId],
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // storage unavailable — keep in-memory progress
      }
      return next;
    });
  }, []);

  const totalStars = Object.values(progress.stars).reduce((a, b) => a + b, 0);

  const badges = BADGES.filter((b) => {
    if (b.id === "first-find") return progress.completed.length > 0;
    if (b.id === "level1") return scenariosForLevel(1).every((s) => progress.completed.includes(s.id));
    if (b.id === "level2") return scenariosForLevel(2).every((s) => progress.completed.includes(s.id));
    if (b.id === "level3") return scenariosForLevel(3).every((s) => progress.completed.includes(s.id));
    if (b.id === "all") return SCENARIOS.every((s) => progress.completed.includes(s.id));
    return false;
  });

  return { progress, recordResult, totalStars, badges };
}
