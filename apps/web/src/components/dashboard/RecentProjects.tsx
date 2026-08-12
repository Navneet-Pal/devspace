import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";

import { ProjectCard } from "./ProjectCard";

const recentProjects = [
  {
    title: "DevSpace Backend",
    description: "Authentication & Workspace Module",
    status: "In Progress" as const,
    progress: 68,
    members: 5,
  },
  {
    title: "Landing Page",
    description: "Marketing website redesign",
    status: "Planning" as const,
    progress: 25,
    members: 3,
  },
  {
    title: "Mobile App",
    description: "React Native implementation",
    status: "Completed" as const,
    progress: 100,
    members: 7,
  },
];

export const RecentProjects = () => {
  return (
    <SectionCard
      title="Recent Projects"
      description="Projects you're currently working on."
      action={
        <Button variant="ghost" size="sm">
          View All
        </Button>
      }
    >
      <div className="space-y-4">
        {recentProjects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            status={project.status}
            progress={project.progress}
            members={project.members}
          />
        ))}
      </div>
    </SectionCard>
  );
};
