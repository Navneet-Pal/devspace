import { Clock3 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  avatar?: string;
}

export const ActivityItem = ({
  title,
  description,
  time,
  avatar,
}: ActivityItemProps) => {
  return (
    <div className="flex items-start gap-4 rounded-xl p-2 transition-colors hover:bg-accent/50">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} />

        <AvatarFallback>{title.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium">{title}</h4>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>

        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="h-3 w-3" />
          {time}
        </div>
      </div>
    </div>
  );
};
