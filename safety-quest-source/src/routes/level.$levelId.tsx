import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LEVELS, scenariosForLevel } from "@/lib/gameData";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/level/$levelId")({
  loader: ({ params }) => {
    const level = LEVELS.find((l) => l.id === Number(params.levelId));
    if (!level) throw notFound();
    return { level };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.level.name} — Safety Quest` },
      { name: "description", content: loaderData?.level.tagline ?? "" },
      { property: "og:title", content: `${loaderData?.level.name} — Safety Quest` },
      { property: "og:description", content: loaderData?.level.tagline ?? "" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LevelPage,
});

function LevelPage() {
  const { level } = Route.useLoaderData();
  const { progress } = useProgress();
  const scenarios = scenariosForLevel(level.id);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="font-extrabold text-muted-foreground hover:text-foreground">
          ← Back to map
        </Link>

        <div className="mt-4 text-center">
          <div className="text-6xl">{level.emoji}</div>
          <div className="mt-1 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            Level {level.id} · {level.ages}
          </div>
          <h1 className="font-display text-4xl font-extrabold">{level.name}</h1>
          <p className="mt-2 rounded-2xl bg-accent/40 px-4 py-2 font-bold text-accent-foreground">
            🎯 {level.skill}
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {scenarios.map((s) => {
            const completed = progress.completed.includes(s.id);
            const stars = progress.stars[s.id] ?? 0;
            return (
              <Link
                key={s.id}
                to="/play/$scenarioId"
                params={{ scenarioId: s.id }}
                className="card-pop flex items-center gap-4 p-4 transition-transform hover:-translate-y-1"
              >
                <div className="text-4xl">{s.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-extrabold">{s.title}</h3>
                  <div className="text-sm font-bold text-muted-foreground">
                    🎮 {s.mechanicLabel}
                  </div>
                </div>
                <div className="text-right">
                  {completed ? (
                    <div className="text-lg">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
                  ) : (
                    <div className="rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground">
                      Play!
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
