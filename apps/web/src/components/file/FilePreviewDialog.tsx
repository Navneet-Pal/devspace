"use client";

import { Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ProjectFile } from "@/services/file/types";

interface FilePreviewDialogProps {
  file: ProjectFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const isImage = (mimeType: string) => mimeType.startsWith("image/");

const isPdf = (mimeType: string) => mimeType === "application/pdf";

const isText = (mimeType: string) => mimeType.startsWith("text/");

export const FilePreviewDialog = ({
  file,
  open,
  onOpenChange,
}: FilePreviewDialogProps) => {
  if (!file) {
    return null;
  }

  const previewAvailable =
    isImage(file.mimeType) || isPdf(file.mimeType) || isText(file.mimeType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="truncate pr-6">
            {file.originalName}
          </DialogTitle>

          <DialogDescription>File preview</DialogDescription>
        </DialogHeader>

        <div className="min-h-[300px] overflow-auto p-6">
          {isImage(file.mimeType) && (
            <div className="flex max-h-[65vh] items-center justify-center overflow-auto rounded-lg bg-muted/20 p-4">
              <img
                src={file.secureUrl}
                alt={file.originalName}
                className="max-h-[60vh] max-w-full rounded-md object-contain"
              />
            </div>
          )}

          {isPdf(file.mimeType) && (
            <div className="h-[65vh] overflow-hidden rounded-lg border">
              <iframe
                src={file.secureUrl}
                title={file.originalName}
                className="h-full w-full"
              />
            </div>
          )}

          {isText(file.mimeType) && (
            <div className="rounded-lg border bg-muted/20 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Text file
              </div>

              <p className="text-sm text-muted-foreground">
                This file can be opened directly from the download button below.
              </p>
            </div>
          )}

          {!previewAvailable && (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>

              <p className="mt-4 text-sm font-medium">Preview not available</p>

              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                This file type cannot be previewed in DevSpace. Download the
                file to open it.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t bg-muted/10 px-6 py-4">
          <a href={file.secureUrl} className="...">
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
