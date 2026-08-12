export const workspaceKeys = {
  all: ["workspaces"] as const,

  lists: () => [...workspaceKeys.all, "list"] as const,

  list: () => [...workspaceKeys.lists(), "me"] as const,

  details: () => [...workspaceKeys.all, "detail"] as const,

  detail: (workspaceId: string) =>
    [...workspaceKeys.details(), workspaceId] as const,
};