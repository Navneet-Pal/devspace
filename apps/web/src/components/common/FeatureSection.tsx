import Container from "./container";

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24">
      <Container>
        <div className="mt-32 flex flex-col items-center gap-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-5xl font-semibold tracking-tight">
            Why DevSpace?
          </h3>

          <h4 className="text-zinc-400">
            One workspace. Endless possibilities.
          </h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-zinc-800 bg-[#18181B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl">
                📋
              </div>

              <h3 className="mb-3 text-xl font-semibold">Project Management</h3>

              <p className="text-sm leading-7 text-zinc-400">
                Organize projects, manage tasks, and keep every milestone on
                track from a single workspace.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-[#18181B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl">
                👥
              </div>

              <h3 className="mb-3 text-xl font-semibold">Team Collaboration</h3>

              <p className="text-sm leading-7 text-zinc-400">
                Collaborate with your team using comments, mentions, and shared
                workspaces.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-[#18181B] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl">
                📊
              </div>

              <h3 className="mb-3 text-xl font-semibold">Progress Tracking</h3>

              <p className="text-sm leading-7 text-zinc-400">
                Visualize your team's progress with Kanban boards, analytics,
                and real-time updates.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
