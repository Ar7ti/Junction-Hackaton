import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SCENARIOS, scenariosForLevel, type Scenario } from "@/lib/gameData";
import { useProgress } from "@/lib/progress";
import { SpotTheRisk } from "@/components/games/SpotTheRisk";
import { SafeOrRisky } from "@/components/games/SafeOrRisky";
import { RiskChain } from "@/components/games/RiskChain";
import { ChooseAction } from "@/components/games/ChooseAction";
import { DecisionStory } from "@/components/games/DecisionStory";

export const Route = createFileRoute("/play/$scenarioId")({
  loader: ({ params }) => {
    const scenario = SCENARIOS.find((s) => s.id === params.scenarioId);
    if (!scenario) throw notFound();
    return { scenario };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.scenario.title} — Safety Quest` },
      { name: "description", content: loaderData?.scenario.intro ?? "" },
      { property: "og:title", content: `${loaderData?.scenario.title} — Safety Quest` },
      { property: "og:description", content: loaderData?.scenario.intro ?? "" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlayPage,
});

function GameFor({ scenario, onComplete }: { scenario: Scenario; onComplete: (stars: number) => void }) {
  switch (scenario.mechanic) {
    case "spot":
      return <SpotTheRisk scenario={scenario} onComplete={onComplete} />;
    case "sort":
      return <SafeOrRisky scenario={scenario} onComplete={onComplete} />;
    case "chain":
      return <RiskChain scenario={scenario} onComplete={onComplete} />;
    case "action":
      return <ChooseAction scenario={scenario} onComplete={onComplete} />;
    case "story":
      return <DecisionStory scenario={scenario} onComplete={onComplete} />;
  }
}

function PlayPage() {
  const { scenario } = Route.useLoaderData();
  const { recordResult } = useProgress();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [earnedStars, setEarnedStars] = useState(0);

  const siblings = scenariosForLevel(scenario.levelId);
  const next = siblings[siblings.findIndex((s) => s.id === scenario.id) + 1];

  const complete = (stars: number) => {
    setEarnedStars(stars);
    recordResult(scenario.id, stars);
    setPhase("done");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/level/$levelId"
          params={{ levelId: String(scenario.levelId) }}
          className="font-extrabold text-muted-foreground hover:text-foreground"
        >
          ← Back to level
        </Link>

        {phase === "intro" && (
          <div className="mt-6 text-center">
            <div className="text-7xl animate-float-slow">{scenario.emoji}</div>
            <div className="mt-2 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-extrabold text-secondary-foreground">
              🎮 {scenario.mechanicLabel}
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold">{scenario.title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg font-bold text-muted-foreground">
              {scenario.intro}
            </p>
            <p className="mx-auto mt-3 max-w-xl rounded-2xl bg-accent/40 px-4 py-2 font-bold text-accent-foreground">
              🎯 {scenario.objective}
            </p>
            <button
              onClick={() => setPhase("play")}
              className="btn-chunky mt-8 bg-primary px-10 py-4 text-2xl text-primary-foreground"
            >
              Start mission! 🚀
            </button>
          </div>
        )}

        {phase === "play" && (
          <div className="mt-6">
            <h1 className="mb-4 text-center font-display text-3xl font-extrabold">
              {scenario.emoji} {scenario.title}
            </h1>
            <GameFor scenario={scenario} onComplete={complete} />
          </div>
        )}

        {phase === "done" && (
          <div className="mt-10 text-center">
            <div className="animate-pop-in text-7xl">🎉</div>
            <h1 className="mt-3 font-display text-4xl font-extrabold">Mission complete!</h1>
            <div className="mt-3 text-5xl">
              {"⭐".repeat(earnedStars)}
              <span className="opacity-30">{"⭐".repeat(3 - earnedStars)}</span>
            </div>

            <div className="card-pop mx-auto mt-8 max-w-xl p-6 text-left">
              <h2 className="font-display text-xl font-extrabold">
                👨‍👩‍👧 Talk About It <span className="text-sm text-muted-foreground">(for parents & guardians)</span>
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 font-bold text-muted-foreground">
                {scenario.talkAboutIt.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setPhase("intro");
                  setEarnedStars(0);
                }}
                className="btn-chunky bg-secondary px-6 py-3 text-lg text-secondary-foreground"
              >
                🔁 Play again
              </button>
              {next ? (
                <button
                  onClick={() =>
                    navigate({ to: "/play/$scenarioId", params: { scenarioId: next.id } })
                  }
                  className="btn-chunky bg-primary px-6 py-3 text-lg text-primary-foreground"
                >
                  Next mission: {next.emoji} {next.title}
                </button>
              ) : (
                <Link
                  to="/"
                  className="btn-chunky inline-block bg-primary px-6 py-3 text-lg text-primary-foreground"
                >
                  🏠 Back to the map
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
