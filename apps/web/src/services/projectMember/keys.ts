export const projectMemberKeys = {
  all: ["project-members"] as const,

  list: (workspaceId: string, projectId: string) =>
    [...projectMemberKeys.all, "list", workspaceId, projectId] as const,
};
