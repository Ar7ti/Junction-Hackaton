import { useMemo, useState } from "react";
import type { Scenario } from "@/lib/gameData";

interface Props {
  scenario: Scenario;
  onComplete: (stars: number) => void;
}

export function RiskChain({ scenario, onComplete }: Props) {
  const correct = scenario.chain ?? [];
  const shuffled = useMemo(() => {
    const list = correct.map((text, i) => ({ text, correctIndex: i }));
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j]!, list[i]!];
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const [picked, setPicked] = useState<{ text: string; correctIndex: number }[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);

  const done = picked.length === correct.length;

  const pick = (card: { text: string; correctIndex: number }) => {
    if (done || picked.some((p) => p.text === card.text)) return;
    if (card.correctIndex === picked.length) {
      setPicked([...picked, card]);
      if (picked.length + 1 === correct.length) {
        const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        setTimeout(() => onComplete(stars), 1600);
      }
    } else {
      setMistakes((m) => m + 1);
      setFlash(card.text);
      setTimeout(() => setFlash(null), 600);
    }
  };

  return (
    <div>
      {scenario.chainHint && (
        <div className="mb-4 rounded-2xl bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground">
          🕵️ Case notes: {scenario.chainHint}
        </div>
      )}

      <div className="mb-6">
        <h3 className="mb-3 font-display text-lg font-bold">Your risk chain:</h3>
        <div className="flex flex-col items-center gap-1">
          {picked.map((p, i) => (
            <div key={p.text} className="flex flex-col items-center">
              <div className="animate-pop-in rounded-2xl bg-grass/25 px-4 py-2 font-bold text-accent-foreground">
                {p.text}
              </div>
              {i < correct.length - 1 && <div className="text-2xl leading-none">⬇️</div>}
            </div>
          ))}
          {picked.length === 0 && (
            <div className="rounded-2xl border-3 border-dashed border-border px-4 py-3 text-muted-foreground font-bold">
              Tap the clues below in the order they happened…
            </div>
          )}
          {done && (
            <div className="mt-2 animate-pop-in rounded-2xl bg-grass px-4 py-3 font-extrabold text-grass-foreground">
              🎉 Case solved! Every link in that chain could have been prevented.
            </div>
          )}
        </div>
      </div>

      <h3 className="mb-3 font-display text-lg font-bold">The evidence:</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {shuffled.map((card) => {
          const used = picked.some((p) => p.text === card.text);
          return (
            <button
              key={card.text}
              onClick={() => pick(card)}
              disabled={used || done}
              className={`btn-chunky px-4 py-3 text-left font-bold ${
                used
                  ? "bg-muted text-muted-foreground opacity-40"
                  : "bg-card text-card-foreground"
              } ${flash === card.text ? "animate-wiggle bg-sun/50" : ""}`}
            >
              {card.text}
            </button>
          );
        })}
      </div>
      {flash && (
        <p className="mt-3 text-center font-bold text-muted-foreground">
          Hmm, that doesn't come next in the chain. Think about cause and effect!
        </p>
      )}
    </div>
  );
}
