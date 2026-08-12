import { FolderKanban, ListTodo, Mail, Users } from "lucide-react";

import { MetricCard } from "./MetricCard";

export const MetricsSection = () => {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Members"
        value={24}
        description="+3 this week"
        icon={Users}
      />

      <MetricCard
        title="Projects"
        value={12}
        description="2 active"
        icon={FolderKanban}
      />

      <MetricCard
        title="Tasks"
        value={187}
        description="18 due today"
        icon={ListTodo}
      />

      <MetricCard
        title="Invitations"
        value={5}
        description="Pending response"
        icon={Mail}
      />
    </section>
  );
};
