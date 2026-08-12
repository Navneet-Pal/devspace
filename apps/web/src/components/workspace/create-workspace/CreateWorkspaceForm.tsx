"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { WorkspaceLogoUpload } from "./WorkspaceLogoUpload";
import {
  CreateWorkspaceFormValues,
  createWorkspaceSchema,
} from "@/schemas/workspace";
import { useCreateWorkspace, useUpdateWorkspaceLogo } from "@/hooks/workspace/useWorkspace";
import { workspaceKeys } from "@/services/workspace/keys";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateWorkspaceFormProps {
  onSuccess: () => void;
}

export const CreateWorkspaceForm = ({ onSuccess, }: CreateWorkspaceFormProps) => {
  
  const { register, handleSubmit,  watch, setValue, formState: { errors },  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: undefined,
    },
  });

  const queryClient = useQueryClient();
  const createWorkspaceMutation = useCreateWorkspace();
  const updateWorkspaceLogoMutation  = useUpdateWorkspaceLogo();

  const isSubmitting = createWorkspaceMutation.isPending || updateWorkspaceLogoMutation.isPending;

  const onSubmit = async (data: CreateWorkspaceFormValues) => {
    try{
      const response = await createWorkspaceMutation.mutateAsync({
        name : data.name,
        description : data.description
      });

      const workspace = response.data;

      if(data.logo){
        await updateWorkspaceLogoMutation.mutateAsync({
          workspaceId: workspace._id,
          logo : data.logo
        });
      }

      await queryClient.invalidateQueries({
        queryKey : workspaceKeys.list()
      });

      toast.success("Workspace Created successfully");
      
      onSuccess();

    }
    catch(error){
      toast.error("Failed to create workspace");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <WorkspaceLogoUpload
        value={watch("logo")}
        onChange={(file) =>
          setValue("logo", file, { shouldValidate: true, shouldDirty: true })
        }
      />

      {errors.logo && (
        <p className="text-sm text-destructive">
          {errors.logo.message}
        </p>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Workspace Name
        </label>

        <Input id="name" placeholder="DevSpace" disabled={isSubmitting} {...register("name")} />

        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>

        <Textarea
          id="description"
          rows={4}
          disabled ={isSubmitting}
          placeholder="Describe your workspace..."
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting}  onClick={onSuccess}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting} >
          {isSubmitting ? "Creating...." : "Create Workspace"}
        </Button>
      </div>
    </form>
  );
};
