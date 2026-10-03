import { useMemo, useState } from "react";
import type { Scenario } from "@/lib/gameData";

interface Props {
  scenario: Scenario;
  onComplete: (stars: number) => void;
}

export function SpotTheRisk({ scenario, onComplete }: Props) {
  const items = useMemo(
    () => (scenario.spotItems ?? []).map((it, i) => ({ ...it, key: `${i}` })),
    [scenario],
  );
  const hazards = items.filter((i) => i.hazard);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [misses, setMisses] = useState(0);
  const [message, setMessage] = useState<{ text: string; kind: "good" | "oops" } | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);

  const allFound = found.size === hazards.length;

  const tap = (key: string, hazard: boolean, praise?: string, fix?: string) => {
    if (allFound) return;
    if (hazard) {
      if (found.has(key)) return;
      const next = new Set(found);
      next.add(key);
      setFound(next);
      setMessage({ text: `${praise} ${fix ? `👉 ${fix}` : ""}`, kind: "good" });
      if (next.size === hazards.length) {
        const stars = misses === 0 ? 3 : misses <= 2 ? 2 : 1;
        setTimeout(() => onComplete(stars), 1400);
      }
    } else {
      setMisses((m) => m + 1);
      setShaking(key);
      setMessage({ text: "That one is actually fine! Look for things that could hurt someone.", kind: "oops" });
      setTimeout(() => setShaking(null), 500);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">
        <span>🔎 Hazards found: {found.size} / {hazards.length}</span>
        <span>{scenario.sceneLabel}</span>
      </div>

      <div className="card-pop relative h-[420px] overflow-hidden bg-gradient-to-b from-sky/30 to-grass/20 sm:h-[480px]">
        {items.map((it) => {
          const isFound = found.has(it.key);
          return (
            <button
              key={it.key}
              onClick={() => tap(it.key, it.hazard, it.praise, it.fix)}
              aria-label={it.label}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl p-1 text-4xl transition-all sm:text-5xl ${
                isFound
                  ? "scale-110 ring-4 ring-grass bg-grass/30"
                  : "hover:scale-125 cursor-pointer"
              } ${shaking === it.key ? "animate-wiggle" : ""}`}
              style={{ left: `${it.x}%`, top: `${it.y}%` }}
            >
              {it.emoji}
              {isFound && (
                <span className="absolute -right-2 -top-2 animate-pop-in text-xl">✅</span>
              )}
            </button>
          );
        })}
        {allFound && (
          <div className="absolute inset-x-4 top-4 animate-pop-in rounded-2xl bg-grass px-4 py-3 text-center text-lg font-extrabold text-grass-foreground shadow-lg">
            🎉 You found every hazard! Amazing detective work!
          </div>
        )}
      </div>

      {message && !allFound && (
        <div
          className={`mt-4 animate-pop-in rounded-2xl px-4 py-3 font-bold ${
            message.kind === "good"
              ? "bg-grass/25 text-accent-foreground"
              : "bg-sun/40 text-foreground"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
