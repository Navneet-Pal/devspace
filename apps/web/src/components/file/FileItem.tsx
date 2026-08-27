"use client";

import {
  Download,
  File,
  FileImage,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProjectFile } from "@/services/file/types";

interface FileItemProps {
  file: ProjectFile;
  canDelete: boolean;
  onDelete: (file: ProjectFile) => void;
  onPreview: (file: ProjectFile) => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return FileImage;
  }

  if (mimeType === "application/pdf" || mimeType.startsWith("text/")) {
    return FileText;
  }

  return File;
};

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const FileItem = ({
  file,
  canDelete,
  onDelete,
  onPreview,
}: FileItemProps) => {
  const Icon = getFileIcon(file.mimeType);

  const isPreviewable =
    file.mimeType.startsWith("image/") ||
    file.mimeType === "application/pdf" ||
    file.mimeType.startsWith("text/");

  return (
    <Card className="border-border/60 shadow-none transition-colors hover:bg-accent/30">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() =>
              isPreviewable
                ? onPreview(file)
                : window.open(file.secureUrl, "_blank", "noopener,noreferrer")
            }
            className="block max-w-full truncate text-left text-sm font-medium hover:underline"
          >
            {file.originalName}
          </button>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>

            <span>•</span>

            <span>
              {formatDistanceToNow(new Date(file.createdAt), {
                addSuffix: true,
              })}
            </span>

            <span>•</span>

            <div className="flex min-w-0 items-center gap-1">
              <Avatar className="h-4 w-4">
                {file.uploadedBy.avatar && (
                  <AvatarImage
                    src={file.uploadedBy.avatar}
                    alt={file.uploadedBy.name}
                  />
                )}

                <AvatarFallback className="text-[8px]">
                  {file.uploadedBy.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="max-w-[140px] truncate">
                {file.uploadedBy.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={file.secureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
          >
            <Download className="h-4 w-4" />

            <span className="sr-only">Open {file.originalName}</span>
          </a>

          {(canDelete || isPreviewable) && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreHorizontal className="h-4 w-4" />

                    <span className="sr-only">File actions</span>
                  </Button>
                }
              />

              <DropdownMenuContent align="end">
                {isPreviewable && (
                  <DropdownMenuItem onClick={() => onPreview(file)}>
                    Preview
                  </DropdownMenuItem>
                )}

                {canDelete && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(file)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
