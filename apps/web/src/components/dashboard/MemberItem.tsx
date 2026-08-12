import { ShieldCheck, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberItemProps {
  name: string;
  email: string;
  role?: "Owner" | "Admin" | "Member";
  avatar?: string;
}

const roleStyles = {
  Owner: "text-green-600 dark:text-green-400",
  Admin: "text-blue-600 dark:text-blue-400",
  Member: "text-muted-foreground",
} as const;

export const MemberItem = ({ name, email, role, avatar }: MemberItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <h4 className="text-sm font-medium">{name}</h4>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <Badge
        variant={role === "Owner" ? "default" : "secondary"}
        className="gap-1"
      >
        {role === "Owner" ? (
          <ShieldCheck className="h-3 w-3" />
        ) : (
          <User className="h-3 w-3" />
        )}

        {role}
      </Badge>
    </div>
  );
};
