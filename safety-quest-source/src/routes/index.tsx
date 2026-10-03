import { createFileRoute, Link } from "@tanstack/react-router";
import { LEVELS, scenariosForLevel } from "@/lib/gameData";
import { exportSafetyQuestDoc } from "@/lib/exportContent";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Safety Quest — Become a Risk Detective" },
      {
        name: "description",
        content:
          "A fun educational adventure game that teaches children aged 5–15 to spot risks, make safer choices and prevent everyday accidents.",
      },
      { property: "og:title", content: "Safety Quest — Become a Risk Detective" },
      {
        property: "og:description",
        content:
          "Explore SafeTown, solve safety mysteries and become a Risk Detective. Three age levels, playful missions, real safety skills.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const LEVEL_STYLES: Record<string, string> = {
  sky: "bg-sky text-sky-foreground",
  grass: "bg-grass text-grass-foreground",
  berry: "bg-berry text-berry-foreground",
};

function Home() {
  const { totalStars, badges, progress } = useProgress();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-sky/40 to-background px-4 pb-10 pt-14 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 text-7xl animate-float-slow">🔎</div>
          <h1 className="font-display text-5xl font-extrabold leading-tight sm:text-6xl">
            Safety <span className="text-primary">Quest</span>
          </h1>
          <p className="mt-3 text-xl font-bold text-muted-foreground">
            Become a Risk Detective! Spot hazards, solve mysteries and learn how to
            keep yourself and others safe.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="card-pop flex items-center gap-2 px-5 py-2 font-extrabold">
              ⭐ {totalStars} safety points
            </div>
            <div className="card-pop flex items-center gap-2 px-5 py-2 font-extrabold">
              🏆 {badges.length} badges
            </div>
          </div>
          <button
            onClick={() => void exportSafetyQuestDoc()}
            className="card-pop mt-4 inline-flex items-center gap-2 px-5 py-2 font-extrabold transition-transform hover:-translate-y-0.5"
          >
            📄 Export all missions as a document
          </button>
        </div>
      </header>

      {/* Levels */}
      <main className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="mb-6 text-center font-display text-3xl font-extrabold">
          Choose your adventure
        </h2>
        <div className="grid gap-5">
          {LEVELS.map((level) => {
            const scenarios = scenariosForLevel(level.id);
            const done = scenarios.filter((s) => progress.completed.includes(s.id)).length;
            return (
              <Link
                key={level.id}
                to="/level/$levelId"
                params={{ levelId: String(level.id) }}
                className="card-pop group flex items-center gap-5 p-5 transition-transform hover:-translate-y-1"
              >
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-4xl ${LEVEL_STYLES[level.color]}`}
                >
                  {level.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                    Level {level.id} · {level.ages}
                  </div>
                  <h3 className="font-display text-2xl font-extrabold">{level.name}</h3>
                  <p className="text-sm font-bold text-muted-foreground">{level.tagline}</p>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(done / scenarios.length) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs font-bold text-muted-foreground">
                    {done} / {scenarios.length} missions complete
                  </div>
                </div>
                <div className="text-3xl transition-transform group-hover:translate-x-1">➡️</div>
              </Link>
            );
          })}
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-center font-display text-2xl font-extrabold">Your badges</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((b) => (
                <div key={b.id} className="card-pop animate-pop-in px-4 py-3 text-center">
                  <div className="text-3xl">{b.emoji}</div>
                  <div className="text-sm font-extrabold">{b.name}</div>
                  <div className="text-xs font-bold text-muted-foreground">{b.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-14 rounded-3xl bg-secondary p-5 text-center text-sm font-bold text-secondary-foreground">
          🛡️ Safety Quest is supported by <strong>LähiTapiola</strong> as a safety partner.
          <br />
          Insurance helps when something goes wrong — safety skills help prevent it from
          going wrong in the first place.
        </footer>
      </main>
    </div>
  );
}
