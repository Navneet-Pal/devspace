"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { Document } from "@/services/document/types";

interface DocumentListItemProps {
  document: Document;
  href: string;
}

export const DocumentListItem = ({ document, href }: DocumentListItemProps) => {
  return (
    <Link href={href} className="block">
      <Card className="border-border/60 shadow-none transition-colors hover:bg-accent/40">
        <CardContent className="p-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 rounded-md bg-muted p-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium">{document.title}</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Updated {new Date(document.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
