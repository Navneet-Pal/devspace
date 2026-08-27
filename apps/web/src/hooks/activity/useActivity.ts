import { useQuery } from "@tanstack/react-query";

import { activityKeys } from "@/services/activity/keys";
import { activityService } from "@/services/activity/service";

export const useProjectActivity = (workspaceId: string, projectId: string) => {
  return useQuery({
    queryKey: activityKeys.projectList(workspaceId, projectId),

    queryFn: () => activityService.getProjectActivity(workspaceId, projectId),

    enabled: !!workspaceId && !!projectId,
  });
};

export const useTaskActivity = (
  workspaceId: string,
  projectId: string,
  taskId: string,
) => {
  return useQuery({
    queryKey: activityKeys.taskList(workspaceId, projectId, taskId),

    queryFn: () =>
      activityService.getTaskActivity(workspaceId, projectId, taskId),

    enabled: !!workspaceId && !!projectId && !!taskId,
  });
};
