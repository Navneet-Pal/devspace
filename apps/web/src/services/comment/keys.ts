export const commentKeys = {
  all: ["comments"] as const,

  projectList: (workspaceId: string, projectId: string) =>
    [...commentKeys.all, "project", workspaceId, projectId] as const,

  taskList: (workspaceId: string, projectId: string, taskId: string) =>
    [...commentKeys.all, "task", workspaceId, projectId, taskId] as const,

  detail: (workspaceId: string, projectId: string, commentId: string) =>
    [...commentKeys.all, "detail", workspaceId, projectId, commentId] as const,
};
