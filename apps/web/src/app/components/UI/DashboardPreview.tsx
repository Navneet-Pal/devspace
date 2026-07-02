import Button from "./Button";

export default function DashboardPreview() {
  return (
    <div className="rounded-3xl border flex flex-col gap-10 border-zinc-800 bg-zinc-900 p-6">
      <h3>DevSpace DashBoard</h3>

      <div>
        <input placeholder="Search Task...." />
        <Button variant="primary">+ New Task</Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="rounded-2xl border border-zinc-800 p-4">
          <h4>Todo (2)</h4>
        </div>
        <div className="rounded-2xl border border-zinc-800 p-4">
          <h4>Todo (2)</h4>
        </div>
        <div className="rounded-2xl border border-zinc-800 p-4">
          <h4>Todo (2)</h4>
        </div>
        <div className="rounded-2xl border border-zinc-800 p-4">
          <h4>Todo (2)</h4>
        </div>

      </div>
    </div>
  );
}
