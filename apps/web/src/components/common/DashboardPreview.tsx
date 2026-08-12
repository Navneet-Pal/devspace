import Button from "./button";
import Container from "./container";

export default function DashboardPreview() {
  return (
    <Container>
      <div className=" mt-10 rounded-3xl border flex flex-col gap-10 border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between ">
          <h3 className="text-2xl font-bold text-zinc-300">
            DevSpace DashBoard
          </h3>
          <div className="flex items-center gap-4">
            <input
              className="w-72 h-11 rounded-xl border border-zinc-700 bg-[#18181B] px-4 outline-none placeholder:text-zinc-500"
              placeholder="Search Task...."
            />
            <Button variant="primary">+ New Task</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-[#18181B] p-4">
            <h4 className="mb-4 text-sm font-semibold text-zinc-300">
              Todo (2)
            </h4>
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-700 bg-[#222225] p-3">
                <p className="font-medium">Login UI</p>
                <span className="text-xs text-zinc-400">High • Today</span>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-[#222225] p-3">
                <p className="font-medium">Dashboard</p>
                <span className="text-xs text-zinc-400">Medium • Tomorrow</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-4">
            <h4 className="mb-4 text-sm font-semibold text-zinc-300">
              Progress (2)
            </h4>
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-700 bg-[#222225] p-3">
                <p className="font-medium">Login UI</p>
                <span className="text-xs text-zinc-400">High • Today</span>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-[#222225] p-3">
                <p className="font-medium">Dashboard</p>
                <span className="text-xs text-zinc-400">Medium • Tomorrow</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-4">
            <h4 className="mb-4 text-sm font-semibold text-zinc-300">
              Review (2)
            </h4>
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-700 bg-[#222225] p-3">
                <p className="font-medium">Login UI</p>
                <span className="text-xs text-zinc-400">High • Today</span>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-[#222225] p-3">
                <p className="font-medium">Dashboard</p>
                <span className="text-xs text-zinc-400">Medium • Tomorrow</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-4">
            <h4 className="mb-4 text-sm font-semibold text-zinc-300">
              Done (2)
            </h4>
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-700 bg-[#222225] p-3">
                <p className="font-medium">Login UI</p>
                <span className="text-xs text-zinc-400">High • Today</span>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-[#222225] p-3">
                <p className="font-medium">Dashboard</p>
                <span className="text-xs text-zinc-400">Medium • Tomorrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
