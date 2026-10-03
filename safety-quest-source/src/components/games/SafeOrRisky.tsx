import { useMemo, useState } from "react";
import type { Scenario, SortCard } from "@/lib/gameData";

interface Props {
  scenario: Scenario;
  onComplete: (stars: number) => void;
}

export function SafeOrRisky({ scenario, onComplete }: Props) {
  const cards = useMemo(() => {
    const list = [...(scenario.sortCards ?? [])];
    // deterministic-ish shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j]!, list[i]!];
    }
    return list;
  }, [scenario]);

  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<{ card: SortCard; correct: boolean } | null>(null);

  const done = index >= cards.length;

  const answer = (saidSafe: boolean) => {
    const card = cards[index]!;
    const correct = card.safe === saidSafe;
    if (!correct) setMistakes((m) => m + 1);
    setFeedback({ card, correct });
    setTimeout(() => {
      setFeedback(null);
      setIndex((i) => i + 1);
    }, 1800);
  };

  if (done) {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    setTimeout(() => onComplete(stars), 0);
    return null;
  }

  const card = cards[index];
  if (!card) return null;

  return (
    <div>
      <div className="mb-4 rounded-2xl bg-secondary px-4 py-2 text-center text-sm font-bold text-secondary-foreground">
        Card {index + 1} of {cards.length}
      </div>

      <div className="card-pop mx-auto max-w-md p-8 text-center">
        <div className="mb-4 text-7xl animate-float-slow">{card.emoji}</div>
        <p className="text-xl font-extrabold">{card.text}</p>

        {feedback ? (
          <div
            className={`mt-6 animate-pop-in rounded-2xl px-4 py-3 font-bold ${
              feedback.correct ? "bg-grass/25 text-accent-foreground" : "bg-sun/40 text-foreground"
            }`}
          >
            {feedback.correct ? "✅ Correct! " : "💡 Actually… "}
            {feedback.card.why}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => answer(true)}
              className="btn-chunky bg-grass px-4 py-4 text-lg text-grass-foreground"
            >
              🟢 SAFE
            </button>
            <button
              onClick={() => answer(false)}
              className="btn-chunky bg-destructive px-4 py-4 text-lg text-destructive-foreground"
            >
              🔴 RISKY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
