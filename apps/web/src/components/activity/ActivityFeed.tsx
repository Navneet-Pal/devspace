"use client";

import { Activity as ActivityIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { ActivityItem } from "./ActivityItem";

import type { Activity } from "@/services/activity/types";

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
  isError?: boolean;
}

export const ActivityFeed = ({
  activities,
  isLoading = false,
  isError = false,
}: ActivityFeedProps) => {
  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-none">
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading activity...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 shadow-none">
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <p className="text-sm text-destructive">Failed to load activity.</p>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="border-dashed shadow-none">
        <CardContent className="flex min-h-[200px] flex-col items-center justify-center text-center">
          <ActivityIcon className="h-8 w-8 text-muted-foreground/60" />

          <p className="mt-3 text-sm font-medium">No activity yet</p>

          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Task and collaboration activity will appear here as your team works.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-none">
      <CardContent className="p-5">
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
