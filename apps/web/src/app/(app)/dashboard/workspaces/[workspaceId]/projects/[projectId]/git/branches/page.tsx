"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, GitBranch, Loader2 } from "lucide-react";

import { useGitBranches } from "@/hooks/projectGit/useProjectGit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function BranchesPage({ params }: Props) {
  const { workspaceId, projectId } = use(params);

  const { data, isLoading, isError } = useGitBranches(workspaceId, projectId);

  const branches = data?.data ?? [];

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
          <h1 className="text-2xl font-semibold">Branches</h1>
          <p className="text-sm text-muted-foreground">Repository branches</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Branches
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
              Failed to load branches.
            </p>
          )}

          {!isLoading && !isError && branches.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No branches found.
            </p>
          )}

          {!isLoading && !isError && branches.length > 0 && (
            <div className="divide-y">
              {branches.map((branch) => (
                <div
                  key={branch.name}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{branch.name}</span>
                  </div>

                  {branch.protected && (
                    <span className="rounded-full border px-2.5 py-1 text-xs">
                      Protected
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
