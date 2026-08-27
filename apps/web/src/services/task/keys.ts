export const taskKeys = {
  all: ["tasks"] as const,

  workspaceList: (workspaceId: string) =>
    [...taskKeys.all, "workspace-list", workspaceId] as const,

  projectList: (workspaceId: string, projectId: string) =>
    [...taskKeys.all, "project-list", workspaceId, projectId] as const,

  detail: (workspaceId: string, projectId: string, taskId: string) =>
    [...taskKeys.all, "detail", workspaceId, projectId, taskId] as const,
};
