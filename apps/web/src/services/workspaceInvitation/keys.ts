export const workspaceInvitationKeys = {
  all: ["workspace-invitations"] as const,

  list: (workspaceId: string) =>
    [...workspaceInvitationKeys.all, "list", workspaceId] as const,

  my: () => [...workspaceInvitationKeys.all, "my"] as const,
};
