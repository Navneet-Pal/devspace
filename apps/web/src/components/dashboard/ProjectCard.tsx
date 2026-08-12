import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  title: string;
  description: string;
  status: "Planning" | "In Progress" | "Completed";
  progress: number;
  members: number;
}

const statusVariants = {
  Planning: "secondary",
  "In Progress": "default",
  Completed: "outline",
} as const;

export const ProjectCard = ({
  title,
  description,
  status,
  progress,
  members,
}: ProjectCardProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">{title}</h3>

            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>

          <Badge variant={statusVariants[status]}>{status}</Badge>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{members} Members</span>
          </div>

          <span className="font-medium">{progress}%</span>
        </div>
      </CardContent>
    </Card>
  );
};
