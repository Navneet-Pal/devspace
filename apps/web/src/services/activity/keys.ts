export const activityKeys = {
  all: ["activity"] as const,

  projectList: (workspaceId: string, projectId: string) =>
    [...activityKeys.all, "project", workspaceId, projectId] as const,

  taskList: (workspaceId: string, projectId: string, taskId: string) =>
    [...activityKeys.all, "task", workspaceId, projectId, taskId] as const,
};
