"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitCommit, Loader2 } from "lucide-react";

import { useGitCommits } from "@/hooks/projectGit/useProjectGit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function CommitsPage({ params }: Props) {
  const { workspaceId, projectId } = use(params);

  const { data, isLoading, isError } = useGitCommits(workspaceId, projectId);

  const commits = data?.data ?? [];

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
          <h1 className="text-2xl font-semibold">Commits</h1>
          <p className="text-sm text-muted-foreground">
            Recent repository commits
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Recent Commits
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
              Failed to load commits.
            </p>
          )}

          {!isLoading && !isError && commits.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No commits found.
            </p>
          )}

          {!isLoading && !isError && commits.length > 0 && (
            <div className="divide-y">
              {commits.map((commit) => (
                <div
                  key={commit.sha}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {commit.commit.message.split("\n")[0]}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {commit.author?.login ??
                        commit.commit.author?.name ??
                        "Unknown author"}
                    </p>

                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {commit.sha.slice(0, 7)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    nativeButton={false}
                    render={
                      <a
                        href={commit.html_url}
                        target="_blank"
                        rel="noreferrer"
                      />
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
