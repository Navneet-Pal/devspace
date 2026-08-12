import { ArrowRight, LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
}: QuickActionCardProps) => {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-md">
      <CardContent className="flex items-center justify-between p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h3 className="font-semibold">{title}</h3>

            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
      </CardContent>
    </Card>
  );
};
