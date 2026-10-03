import { useState } from "react";
import type { Scenario } from "@/lib/gameData";

interface Props {
  scenario: Scenario;
  onComplete: (stars: number) => void;
}

export function DecisionStory({ scenario, onComplete }: Props) {
  const steps = scenario.storySteps ?? [];
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
    if (!step.choices[i]?.correct) setMistakes((m) => m + 1);
    setTimeout(() => {
      setPicked(null);
      setIndex((v) => v + 1);
    }, 2600);
  };

  return (
    <div>
      <div className="mb-4 rounded-2xl bg-secondary px-4 py-2 text-center text-sm font-bold text-secondary-foreground">
        Chapter {index + 1} of {steps.length}
      </div>

      <div className="mx-auto max-w-lg">
        <div className="card-pop mb-4 p-5">
          {step.speaker && (
            <div className="mb-2 inline-block rounded-full bg-berry/15 px-3 py-1 text-sm font-extrabold text-berry">
              {step.speaker}
            </div>
          )}
          <p className="text-lg font-bold leading-relaxed">{step.text}</p>
        </div>

        <p className="mb-2 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
          What do you say?
        </p>
        <div className="grid gap-3">
          {step.choices.map((c, i) => {
            const isPicked = picked === i;
            const showResult = picked !== null;
            const style = showResult
              ? c.correct
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
                💬 {c.text}
                {showResult && (c.correct || isPicked) && (
                  <span className="mt-1 block text-sm font-bold opacity-90">{c.feedback}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
