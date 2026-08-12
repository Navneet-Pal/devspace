import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export const MetricCard = ({
  title,
  value,
  description,
  icon: Icon,
}: MetricCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm font-medium">
            {title}
          </span>

          <Icon className="text-primary h-5 w-5" />
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {value}
          </h2>

          <p className="text-muted-foreground mt-1 text-sm">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};