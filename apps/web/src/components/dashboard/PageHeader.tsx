"use client";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export const PageHeader = ({
  title,
  description,
  actions,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        <p className="text-muted-foreground">{description}</p>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
