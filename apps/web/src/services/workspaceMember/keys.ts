export const workspaceMemberKeys = {
  all: ["workspace-members"] as const,

  list: (workspaceId: string) =>
    [...workspaceMemberKeys.all, "list", workspaceId] as const,
};