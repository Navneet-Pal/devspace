import { Button } from "../ui/button";

import { SectionCard } from "@/components/common/SectionCard";

import { ActivityItem } from "./ActivityItem";

export const RecentActivity = () => {
  return (
    <SectionCard
      title="Recent Activity"
      description="Latest updates from your workspace."
      action={
        <Button variant="ghost" size="sm">
          View All
        </Button>
      }
    >
      <div className="space-y-4">
        <ActivityItem
          title="Navneet"
          description="Created a new project."
          time="2 minutes ago"
        />

        <ActivityItem
          title="Rahul"
          description="Completed Task #24."
          time="20 minutes ago"
        />

        <ActivityItem
          title="Priya"
          description="Invited a new member."
          time="1 hour ago"
        />
      </div>
    </SectionCard>
  );
};
