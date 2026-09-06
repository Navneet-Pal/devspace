export const projectGitKeys = {
  all: ["project-git"] as const,

  integration: (workspaceId: string, projectId: string) =>
    [...projectGitKeys.all, "integration", workspaceId, projectId] as const,

  repositories: (workspaceId: string, projectId: string) =>
    [...projectGitKeys.all, "repositories", workspaceId, projectId] as const,

  branches: (workspaceId: string, projectId: string) =>
    [...projectGitKeys.all, "branches", workspaceId, projectId] as const,

  commits: (workspaceId: string, projectId: string) =>
    [...projectGitKeys.all, "commits", workspaceId, projectId] as const,

  pullRequests: (workspaceId: string, projectId: string) =>
    [...projectGitKeys.all, "pull-requests", workspaceId, projectId] as const,
};
