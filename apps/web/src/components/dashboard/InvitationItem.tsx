import { Mail, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface InvitationItemProps {
  name: string;
  email: string;
  avatar?: string;
  onCancel?: () => void;
  isCancelling?: boolean;
}

export const InvitationItem = ({
  name,
  email,
  avatar,
  onCancel,
  isCancelling,
}: InvitationItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />

          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <h4 className="text-sm font-medium">{name}</h4>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            {email}
          </div>
        </div>
      </div>

      {onCancel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isCancelling}
        >
          <X className="mr-1 h-3 w-3" />
          Cancel
        </Button>
      )}
    </div>
  );
};
