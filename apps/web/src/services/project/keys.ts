export const projectKeys = {
  all: ["projects"] as const,

  list: (workspaceId: string) =>
    [...projectKeys.all, "list", workspaceId] as const,

  detail: (workspaceId: string, projectId: string) =>
    [...projectKeys.all, "detail", workspaceId, projectId] as const,
};
