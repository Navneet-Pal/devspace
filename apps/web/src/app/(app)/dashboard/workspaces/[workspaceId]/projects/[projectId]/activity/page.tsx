"use client";

import { use } from "react";
import { Activity as ActivityIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 

import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { useProjectActivity } from "@/hooks/activity/useActivity";

interface ActivityPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function ActivityPage({ params }: ActivityPageProps) {
  const { workspaceId, projectId } = use(params);

  const { data, isLoading, isError } = useProjectActivity(
    workspaceId,
    projectId,
  );

  const activities = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-muted p-2">
          <ActivityIcon className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">Activity</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            See what is happening across this project.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>

        <CardContent>
          <ActivityFeed
            activities={activities}
            isLoading={isLoading}
            isError={isError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
