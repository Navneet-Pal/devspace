"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInvitation } from "@/hooks/workspaceInvitation/workspaceInvitation";
 

interface InviteMemberDialogProps {
  workspaceId: string;
}

export const InviteMemberDialog = ({
  workspaceId,
}: InviteMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  const createInvitation = useCreateInvitation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) return;

    createInvitation.mutate(
      {
        workspaceId,
        data: {
          userId: userId.trim(),
          role,
        },
      },
      {
        onSuccess: () => {
          setUserId("");
          setRole("MEMBER");
          setOpen(false);
        },

        onError: (error) => {
          console.error("Failed to send invitation:", error);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>+ Invite Member</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>

          <DialogDescription>
            Invite a user to join this workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User ID */}
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium">
              User ID
            </label>

            <Input
              id="userId"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>

            <Select
              value={role}
              onValueChange={(value) => setRole(value as "ADMIN" | "MEMBER")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>

                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!userId.trim() || createInvitation.isPending}
            >
              {createInvitation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
