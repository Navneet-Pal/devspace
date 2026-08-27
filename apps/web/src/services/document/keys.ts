export const documentKeys = {
  all: ["documents"] as const,

  projectList: (workspaceId: string, projectId: string) =>
    [...documentKeys.all, "project", workspaceId, projectId] as const,

  detail: (workspaceId: string, projectId: string, documentId: string) =>
    [
      ...documentKeys.all,
      "detail",
      workspaceId,
      projectId,
      documentId,
    ] as const,
};
