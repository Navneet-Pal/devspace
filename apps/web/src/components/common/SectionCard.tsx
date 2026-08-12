import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const SectionCard = ({
  title,
  description,
  action,
  children,
}: SectionCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {action}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
};
