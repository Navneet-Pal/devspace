"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  ExternalLink,
  Loader2,
  Unplug,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAuthStore } from "@/store/auth";
import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";

import {
  useProjectGit,
  useInstallGitHub,
  useGitHubRepositories,
  useConnectGitHubRepository,
  useDisconnectGitHub,
} from "@/hooks/projectGit/useProjectGit";

interface ProjectGitPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function ProjectGitPage({ params }: ProjectGitPageProps) {
  const { workspaceId, projectId } = use(params);

  const [selectedRepositoryId, setSelectedRepositoryId] = useState("");

  const user = useAuthStore((state) => state.user);

  const {
    data: gitResponse,
    isLoading: isGitLoading,
    isError: isGitError,
  } = useProjectGit(workspaceId, projectId);

  const { data: membersResponse } = useWorkspaceMembers(workspaceId);

  const integration = gitResponse?.data;

  const members = membersResponse?.data ?? [];

  const currentMember = user
    ? members.find((member) => member.userId._id === user._id)
    : undefined;

  const canManageGit = currentMember?.role === "OWNER";

  /*
   * GitHub installation exists after returning
   * from GitHub, even before a repository is selected.
   */
  const isInstalled = Boolean(integration?.installationId);

  const repository = integration?.repository;

  const isRepositoryConnected = Boolean(repository);

  const installGitHub = useInstallGitHub();

  const repositoriesQuery = useGitHubRepositories(
    workspaceId,
    projectId,
    isInstalled && !isRepositoryConnected,
  );

  const connectRepository = useConnectGitHubRepository();

  const disconnectGitHub = useDisconnectGitHub();

  const repositories = repositoriesQuery.data?.data?.repositories ?? [];

  const handleConnectGitHub = () => {
    installGitHub.mutate(
      {
        workspaceId,
        projectId,
      },
      {
        onSuccess: (response) => {
          window.location.href = response.data.url;
        },
      },
    );
  };

  const handleConnectRepository = () => {
    const repositoryId = Number(selectedRepositoryId);

    if (!repositoryId) {
      return;
    }

    connectRepository.mutate({
      workspaceId,
      projectId,
      data: {
        repositoryId,
      },
    });
  };

  const handleDisconnect = () => {
    const confirmed = window.confirm(
      "Are you sure you want to disconnect GitHub from this project?",
    );

    if (!confirmed) {
      return;
    }

    disconnectGitHub.mutate({
      workspaceId,
      projectId,
    });
  };

  if (isGitLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />

        <span className="text-sm text-muted-foreground">
          Loading Git integration...
        </span>
      </div>
    );
  }

  if (isGitError || !integration) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-destructive">
          Failed to load Git integration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Git Integration
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Connect this project with its GitHub repository.
        </p>
      </div>

      {/* ========================================================== */}
      {/* 1. NOTHING CONNECTED                                      */}
      {/* ========================================================== */}

      {!isInstalled && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border">
                <GitBranch className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>GitHub</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Connect a GitHub repository to this project.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {canManageGit ? (
              <div className="space-y-4">
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Connect your GitHub account and select a repository for this
                  project.
                </p>

                <Button
                  onClick={handleConnectGitHub}
                  disabled={installGitHub.isPending}
                >
                  {installGitHub.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <GitBranch className="mr-2 h-4 w-4" />
                      Connect GitHub
                    </>
                  )}
                </Button>

                {installGitHub.isError && (
                  <p className="text-sm text-destructive">
                    Unable to start GitHub connection. Please try again.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-5">
                <p className="text-sm font-medium">GitHub is not connected</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Only the project owner can connect a GitHub repository.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================== */}
      {/* 2. GITHUB INSTALLED - SELECT REPOSITORY                  */}
      {/* ========================================================== */}

      {isInstalled && !isRepositoryConnected && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border">
                <GitBranch className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>GitHub</CardTitle>

                  <Badge>Installed</Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  GitHub is connected. Select the repository you want to use for
                  this project.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {repositoriesQuery.isLoading ? (
              <div className="flex items-center py-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                <span className="text-sm text-muted-foreground">
                  Loading repositories...
                </span>
              </div>
            ) : repositoriesQuery.isError ? (
              <div className="space-y-3">
                <p className="text-sm text-destructive">
                  Failed to load GitHub repositories.
                </p>

                <Button
                  variant="outline"
                  onClick={() => repositoriesQuery.refetch()}
                >
                  Try again
                </Button>
              </div>
            ) : repositories.length === 0 ? (
              <div className="rounded-lg border border-dashed p-5">
                <p className="text-sm font-medium">No repositories available</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  No repository is available through this GitHub App
                  installation.
                </p>
              </div>
            ) : (
              <div className="max-w-xl space-y-4">
                <div>
                  <label
                    htmlFor="github-repository"
                    className="mb-2 block text-sm font-medium"
                  >
                    Select repository
                  </label>

                  <select
                    id="github-repository"
                    value={selectedRepositoryId}
                    onChange={(event) =>
                      setSelectedRepositoryId(event.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a repository</option>

                    {repositories.map((repo) => (
                      <option key={repo.id} value={repo.id}>
                        {repo.full_name}
                        {repo.private ? " • Private" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleConnectRepository}
                  disabled={
                    !selectedRepositoryId || connectRepository.isPending
                  }
                >
                  {connectRepository.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting repository...
                    </>
                  ) : (
                    <>
                      <GitBranch className="mr-2 h-4 w-4" />
                      Connect Repository
                    </>
                  )}
                </Button>

                {connectRepository.isError && (
                  <p className="text-sm text-destructive">
                    Failed to connect repository. Please try again.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================== */}
      {/* 3. REPOSITORY CONNECTED                                   */}
      {/* ========================================================== */}

      {isRepositoryConnected && repository && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border">
                    <GitBranch className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="truncate">
                        {repository.fullName}
                      </CardTitle>

                      <Badge>Connected</Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      GitHub repository connected to this project.
                    </p>
                  </div>
                </div>

                {repository.url && (
                  <a
                    href={repository.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Open GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Repository</p>

                  <p className="mt-2 truncate text-sm font-medium">
                    {repository.name}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Owner</p>

                  <p className="mt-2 truncate text-sm font-medium">
                    {repository.owner}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Default branch
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium">
                    {repository.defaultBranch ?? "Not available"}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Visibility</p>

                  <p className="mt-2 text-sm font-medium">
                    {repository.private ? "Private" : "Public"}
                  </p>
                </div>
              </div>

              {canManageGit && (
                <div className="mt-6 flex justify-end border-t pt-5">
                  <Button
                    variant="destructive"
                    onClick={handleDisconnect}
                    disabled={disconnectGitHub.isPending}
                  >
                    {disconnectGitHub.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <Unplug className="mr-2 h-4 w-4" />
                        Disconnect
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Git Resources */}

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/git/branches`}
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                    <GitBranch className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium">Branches</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      View repository branches
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link
              href={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/git/commits`}
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                    <GitCommit className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium">Commits</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      View recent commits
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link
              href={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/git/pull-requests`}
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                    <GitPullRequest className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium">Pull Requests</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      View repository pull requests
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
