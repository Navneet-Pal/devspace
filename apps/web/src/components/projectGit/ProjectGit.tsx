"use client";

import {
  CheckCircle2,
  GitBranch,
  GitPullRequest,
  ExternalLink,
  Loader2,
  RefreshCw,
  Unplug,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useConnectGitHubRepository,
  useDisconnectGitHub,
  useGitBranches,
  useGitCommits,
  useGitHubRepositories,
  useGitPullRequests,
  useInstallGitHub,
  useProjectGit,
} from "@/hooks/projectGit/useProjectGit";

interface ProjectGitProps {
  workspaceId: string;
  projectId: string;
  isOwner: boolean;
}

export const ProjectGit = ({
  workspaceId,
  projectId,
  isOwner,
}: ProjectGitProps) => {
  const {
    data: integrationResponse,
    isLoading: isIntegrationLoading,
    isError: isIntegrationError,
  } = useProjectGit(workspaceId, projectId);

  const integration = integrationResponse?.data;

  const isConnected = Boolean(integration?.connected && integration.repository);

  const installGitHub = useInstallGitHub();
  const connectRepository = useConnectGitHubRepository();
  const disconnectGitHub = useDisconnectGitHub();

  const {
    data: repositoriesResponse,
    isLoading: isRepositoriesLoading,
    refetch: refetchRepositories,
  } = useGitHubRepositories(
    workspaceId,
    projectId,
    Boolean(integration?.connected && !isConnected && isOwner),
  );

  const { data: branchesResponse, isLoading: isBranchesLoading } =
    useGitBranches(workspaceId, projectId, isConnected);

  const { data: commitsResponse, isLoading: isCommitsLoading } = useGitCommits(
    workspaceId,
    projectId,
    isConnected,
  );

  const { data: pullRequestsResponse, isLoading: isPullRequestsLoading } =
    useGitPullRequests(workspaceId, projectId, isConnected);

  const repositories = repositoriesResponse?.data?.repositories ?? [];
  const branches = branchesResponse?.data ?? [];
  const commits = commitsResponse?.data ?? [];
  const pullRequests = pullRequestsResponse?.data ?? [];

  const handleInstall = async () => {
    const response = await installGitHub.mutateAsync({
      workspaceId,
      projectId,
    });

    window.location.href = response.data.url;
  };

  const handleConnectRepository = async (repositoryId: number) => {
    await connectRepository.mutateAsync({
      workspaceId,
      projectId,
      data: {
        repositoryId,
      },
    });
  };

  const handleDisconnect = async () => {
    const confirmed = window.confirm("Disconnect GitHub from this project?");

    if (!confirmed) {
      return;
    }

    await disconnectGitHub.mutateAsync({
      workspaceId,
      projectId,
    });
  };

  if (isIntegrationLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Loading Git integration...
        </p>
      </div>
    );
  }

  if (isIntegrationError || !integration) {
    return (
      <Card>
        <CardContent className="flex min-h-[250px] items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load Git integration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">Git Integration</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Connect this project with its GitHub repository.
        </p>
      </div>

      {/* Not connected */}
      {!integration.connected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              GitHub
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect a GitHub repository to view branches, commits and pull
              requests inside DevSpace.
            </p>

            {!isOwner ? (
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">
                  Only the project owner can connect GitHub.
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You can view Git information after the owner connects a
                  repository.
                </p>
              </div>
            ) : (
              <Button
                onClick={handleInstall}
                disabled={installGitHub.isPending}
              >
                {installGitHub.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GitBranch className="mr-2 h-4 w-4" />
                )}
                Connect GitHub
              </Button>
            )}

            {installGitHub.isError && (
              <p className="text-sm text-destructive">
                Unable to start GitHub connection.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* GitHub installed but repository not selected */}
      {integration.connected && !isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              GitHub Connected
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              GitHub is connected. Select the repository you want to associate
              with this project.
            </p>

            {!isOwner ? (
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">
                  Only the project owner can select the repository.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Available repositories</p>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchRepositories()}
                    disabled={isRepositoriesLoading}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${
                        isRepositoriesLoading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                </div>

                {isRepositoriesLoading ? (
                  <div className="flex min-h-[150px] items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Loading repositories...
                    </span>
                  </div>
                ) : repositories.length === 0 ? (
                  <div className="rounded-lg border p-6 text-center">
                    <p className="text-sm font-medium">
                      No repositories available.
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Make sure the GitHub App has access to at least one
                      repository.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {repositories.map((repository) => (
                      <div
                        key={repository.id}
                        className="flex items-center justify-between gap-4 rounded-lg border p-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                            {repository.owner?.avatar_url ? (
                              <img
                                src={repository.owner.avatar_url}
                                alt={repository.owner.login}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <GitBranch className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {repository.full_name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {repository.private ? "Private" : "Public"}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleConnectRepository(repository.id)}
                          disabled={connectRepository.isPending}
                        >
                          {connectRepository.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  disabled={disconnectGitHub.isPending}
                >
                  <Unplug className="mr-2 h-4 w-4" />
                  Disconnect GitHub
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Connected repository */}
      {isConnected && integration.repository && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Connected Repository
                </span>

                {isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={disconnectGitHub.isPending}
                  >
                    {disconnectGitHub.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Unplug className="mr-2 h-4 w-4" />
                    )}
                    Disconnect
                  </Button>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {integration.repository.fullName}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Default branch:{" "}
                    {integration.repository.defaultBranch ?? "Not available"}
                  </p>
                </div>

                <a
                  href={integration.repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Branches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Branches
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isBranchesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading branches...
                  </span>
                </div>
              ) : branches.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No branches found.
                </p>
              ) : (
                <div className="space-y-2">
                  {branches.map((branch) => (
                    <div
                      key={branch.name}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <GitBranch className="h-4 w-4 shrink-0 text-muted-foreground" />

                        <span className="truncate text-sm font-medium">
                          {branch.name}
                        </span>
                      </div>

                      {branch.protected && (
                        <span className="rounded-full border px-2 py-1 text-xs">
                          Protected
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commits */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Commits</CardTitle>
            </CardHeader>

            <CardContent>
              {isCommitsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading commits...
                  </span>
                </div>
              ) : commits.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No commits found.
                </p>
              ) : (
                <div className="space-y-3">
                  {commits.map((commit) => (
                    <div key={commit.sha} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium">
                            {commit.commit.message}
                          </p>

                          <p className="mt-2 text-xs text-muted-foreground">
                            {commit.author?.login ??
                              commit.commit.author?.name ??
                              "Unknown author"}
                          </p>
                        </div>

                        <a
                          href={commit.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0"
                        >
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pull Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5" />
                Pull Requests
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isPullRequestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading pull requests...
                  </span>
                </div>
              ) : pullRequests.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No pull requests found.
                </p>
              ) : (
                <div className="space-y-3">
                  {pullRequests.map((pullRequest) => (
                    <div key={pullRequest.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            #{pullRequest.number} {pullRequest.title}
                          </p>

                          <p className="mt-2 text-xs text-muted-foreground">
                            {pullRequest.user.login} · {pullRequest.head.ref} →{" "}
                            {pullRequest.base.ref}
                          </p>
                        </div>

                        <a
                          href={pullRequest.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0"
                        >
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
