"use client";

import { use } from "react";
import { FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useDocuments } from "@/hooks/document/useDocument";

import { CreateDocumentDialog } from "@/components/document/CreateDocumentDialog";
import { DocumentList } from "@/components/document/DocumentList";

interface DocumentationPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function DocumentationPage({ params }: DocumentationPageProps) {
  const { workspaceId, projectId } = use(params);

  const { data, isLoading, isError } = useDocuments(workspaceId, projectId);

  const documents = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Documentation</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage documentation for this project.
            </p>
          </div>
        </div>

        <CreateDocumentDialog workspaceId={workspaceId} projectId={projectId} />
      </div>

      {/* Documents */}
      <DocumentList
        documents={documents}
        workspaceId={workspaceId}
        projectId={projectId}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
