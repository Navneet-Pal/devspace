import { FolderPlus, FileText, Settings, UserPlus } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";

import { QuickActionCard } from "./QuickActionCard";

const actions = [
  {
    title: "Create Project",
    description: "Start a brand new project.",
    icon: FolderPlus,
  },
  {
    title: "Invite Member",
    description: "Invite teammates to your workspace.",
    icon: UserPlus,
  },
  {
    title: "Create Document",
    description: "Write documentation for your team.",
    icon: FileText,
  },
  {
    title: "Workspace Settings",
    description: "Manage workspace configuration.",
    icon: Settings,
  },
];

export const QuickActions = () => {
  return (
    <SectionCard
      title="Quick Actions"
      description="Frequently used workspace actions."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <QuickActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            icon={action.icon}
          />
        ))}
      </div>
    </SectionCard>
  );
};
