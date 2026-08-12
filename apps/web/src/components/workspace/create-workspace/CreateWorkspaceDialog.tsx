"use client";

import { Plus } from "lucide-react";
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

import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

export const CreateWorkspaceDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>

          <DialogDescription>
            Create a new workspace for your team. You can customize it later
            from the workspace settings.
          </DialogDescription>
        </DialogHeader>

        <CreateWorkspaceForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
