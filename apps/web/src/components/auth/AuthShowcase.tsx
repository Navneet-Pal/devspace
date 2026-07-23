import { KanbanSquare, MessageSquareText, Sparkles } from "lucide-react";
import Logo from "../common/Logo";

const features = [
  {
    icon: KanbanSquare,
    title: "Everything in one workspace",
    description:
      "Projects, tasks, docs and files — no more tool switching.",
  },
  {
    icon: MessageSquareText,
    title: "Collaboration that keeps up",
    description:
      "Comments, mentions and real-time updates for the whole team.",
  },
  {
    icon: Sparkles,
    title: "Ship faster, together",
    description:
      "Automations and insights that move work forward on autopilot.",
  },
];

export default function AuthShowcase() {
  return (
    <section className="relative hidden lg:flex h-full w-full overflow-hidden border-r border-border bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col justify-center px-12 py-10">
        <Logo />

        <div className="mt-5 max-w-md">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Build better software,
            <br />
            together.
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            One workspace to plan projects, collaborate with your team and ship
            products faster.
          </p>

          <div className="mt-10 space-y-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}