"use client";

import { FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { Document } from "@/services/document/types";

import { DocumentListItem } from "./DocumentListItem";

interface DocumentListProps {
  documents: Document[];
  workspaceId: string;
  projectId: string;
  isLoading?: boolean;
  isError?: boolean;
}

export const DocumentList = ({
  documents,
  workspaceId,
  projectId,
  isLoading = false,
  isError = false,
}: DocumentListProps) => {
  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-none">
        <CardContent className="flex min-h-[220px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 shadow-none">
        <CardContent className="flex min-h-[220px] items-center justify-center">
          <p className="text-sm text-destructive">Failed to load documents.</p>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="border-dashed shadow-none">
        <CardContent className="flex min-h-[220px] flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-3">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>

          <p className="mt-3 text-sm font-medium">No documents yet</p>

          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Create your first project document to start building your
            documentation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <DocumentListItem
          key={document._id}
          document={document} 
          href={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/documentation/${document._id}`}
        />
      ))}
    </div>
  );
};
