import { Clock3, Mail, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InvitationItemProps {
  name: string;
  email: string;
  avatar?: string;
  sentDate?: string;
  status?: string;
  onCancel?: () => void;
  isCancelling?: boolean;
}

export const InvitationItem = ({
  name,
  email,
  avatar,
  sentDate,
  status = "PENDING",
  onCancel,
  isCancelling,
}: InvitationItemProps) => {
  const formattedStatus = status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <div className="flex flex-col gap-4 rounded-lg p-2 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between">
      {/* Invitation Info */}
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={avatar} alt={name} />

          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium">{name}</h4>

          <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />

            <span className="truncate">{email}</span>
          </div>

          {sentDate && (
            <p className="mt-1 text-xs text-muted-foreground">
              Sent {sentDate}
            </p>
          )}
        </div>
      </div>

      {/* Status + Action */}
      <div className="flex shrink-0 items-center justify-end gap-2">
        <Badge
          variant={status === "PENDING" ? "secondary" : "outline"}
          className="gap-1"
        >
          {status === "PENDING" && <Clock3 className="h-3.5 w-3.5" />}

          {formattedStatus}
        </Badge>

        {status === "PENDING" && onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isCancelling}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />

            {isCancelling ? "Cancelling..." : "Cancel"}
          </Button>
        )}
      </div>
    </div>
  );
};
