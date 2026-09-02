"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitPullRequest, Loader2 } from "lucide-react";

import { useGitPullRequests } from "@/hooks/projectGit/useProjectGit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function PullRequestsPage({ params }: Props) {
  const { workspaceId, projectId } = use(params);

  const { data, isLoading, isError } = useGitPullRequests(
    workspaceId,
    projectId,
  );

  const pullRequests = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={
            <Link
              href={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/git`}
            />
          }
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-semibold">Pull Requests</h1>

          <p className="text-sm text-muted-foreground">
            Repository pull requests
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5" />
            Pull Requests
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {isError && (
            <p className="py-8 text-center text-sm text-destructive">
              Failed to load pull requests.
            </p>
          )}

          {!isLoading && !isError && pullRequests.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No pull requests found.
            </p>
          )}

          {!isLoading && !isError && pullRequests.length > 0 && (
            <div className="divide-y">
              {pullRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{pr.number}
                      </span>

                      <span className="truncate font-medium">{pr.title}</span>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {pr.user.login} · {pr.head.ref} → {pr.base.ref}
                    </p>

                    <span className="mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs capitalize">
                      {pr.state}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    nativeButton={false}
                    render={
                      <a href={pr.html_url} target="_blank" rel="noreferrer" />
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
