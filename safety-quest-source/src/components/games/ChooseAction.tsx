import { useState } from "react";
import type { Scenario } from "@/lib/gameData";

interface Props {
  scenario: Scenario;
  onComplete: (stars: number) => void;
}

export function ChooseAction({ scenario, onComplete }: Props) {
  const steps = scenario.actionSteps ?? [];
  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const step = steps[index];
  const done = index >= steps.length;

  if (done) {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    setTimeout(() => onComplete(stars), 0);
    return null;
  }

  if (!step) return null;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (!step.options[i]?.correct) setMistakes((m) => m + 1);
    setTimeout(() => {
      setPicked(null);
      setIndex((v) => v + 1);
    }, 2200);
  };

  return (
    <div>
      <div className="mb-4 rounded-2xl bg-secondary px-4 py-2 text-center text-sm font-bold text-secondary-foreground">
        Situation {index + 1} of {steps.length}
      </div>

      <div className="card-pop mx-auto max-w-lg p-6 text-center">
        <div className="mb-3 text-6xl">{step.emoji}</div>
        <p className="mb-6 text-lg font-extrabold">{step.situation}</p>

        <div className="grid gap-3">
          {step.options.map((opt, i) => {
            const isPicked = picked === i;
            const showResult = picked !== null;
            const style = showResult
              ? opt.correct
                ? "bg-grass text-grass-foreground"
                : isPicked
                  ? "bg-sun/60 text-foreground"
                  : "bg-muted text-muted-foreground opacity-50"
              : "bg-card text-card-foreground";
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={picked !== null}
                className={`btn-chunky px-4 py-3 text-left font-bold ${style}`}
              >
                {opt.text}
                {showResult && (opt.correct || isPicked) && (
                  <span className="mt-1 block text-sm font-bold opacity-90">{opt.feedback}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
