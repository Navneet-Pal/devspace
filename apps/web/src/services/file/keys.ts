export const fileKeys = {
  all: ["files"] as const,

  projectList: (workspaceId: string, projectId: string) =>
    [...fileKeys.all, "project", workspaceId, projectId] as const,

  detail: (workspaceId: string, projectId: string, fileId: string) =>
    [...fileKeys.all, "detail", workspaceId, projectId, fileId] as const,
};
