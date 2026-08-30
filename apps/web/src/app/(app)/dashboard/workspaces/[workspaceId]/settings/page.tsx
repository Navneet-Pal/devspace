"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  ImagePlus,
  Info,
  Loader2,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  useWorkspace,
  useDeleteWorkspace,
  useUpdateWorkspace,
  useUpdateWorkspaceLogo,
} from "@/hooks/workspace/useWorkspace";

import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";

import { workspaceKeys } from "@/services/workspace/keys";

import { useAuthStore } from "@/store/auth";

interface WorkspaceSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export default function WorkspaceSettingsPage({
  params,
}: WorkspaceSettingsPageProps) {
  const { workspaceId } = use(params);

  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const workspaceQuery = useWorkspace(workspaceId);

  const membersQuery = useWorkspaceMembers(workspaceId);

  const updateWorkspace = useUpdateWorkspace();

  const updateWorkspaceLogo = useUpdateWorkspaceLogo();

  const deleteWorkspace = useDeleteWorkspace();

  const workspace = workspaceQuery.data?.data;

  const members = membersQuery.data?.data ?? [];

  const currentMember = user
    ? members.find((member) => member.userId._id === user._id)
    : undefined;

  const role = currentMember?.role as WorkspaceRole | undefined;

  const ownerMember = members.find(
    (member) =>
      member.role === "OWNER" || member.userId._id === workspace?.ownerId,
  );

  const canEditWorkspace = role === "OWNER" || role === "ADMIN";

  const canDeleteWorkspace = role === "OWNER";

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [saved, setSaved] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [copiedField, setCopiedField] = useState<"id" | "slug" | null>(null);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    setName(workspace.name ?? "");
    setDescription(workspace.description ?? "");
  }, [workspace]);

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!workspace || !canEditWorkspace) {
      return;
    }

    const trimmedName = name.trim();

    const trimmedDescription = description.trim();

    if (!trimmedName) {
      return;
    }

    setSaved(false);

    updateWorkspace.mutate(
      {
        workspaceId,
        data: {
          name: trimmedName,
          description: trimmedDescription || undefined,
        },
      },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(workspaceKeys.detail(workspaceId), response);

          queryClient.invalidateQueries({
            queryKey: workspaceKeys.list(),
          });

          setName(response.data?.name ?? trimmedName);

          setDescription(response.data?.description ?? trimmedDescription);

          setSaved(true);

          window.setTimeout(() => {
            setSaved(false);
          }, 2500);
        },
      },
    );
  };

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEditWorkspace) {
      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedLogo(file);
    setLogoPreview(previewUrl);

    event.target.value = "";
  };

  const handleLogoUpload = () => {
    if (!selectedLogo || !canEditWorkspace) {
      return;
    }

    updateWorkspaceLogo.mutate(
      {
        workspaceId,
        logo: selectedLogo,
      },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(workspaceKeys.detail(workspaceId), response);

          queryClient.invalidateQueries({
            queryKey: workspaceKeys.list(),
          });

          setSelectedLogo(null);

          if (logoPreview) {
            URL.revokeObjectURL(logoPreview);
          }

          setLogoPreview(null);
        },
      },
    );
  };

  const handleCancelLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setSelectedLogo(null);
    setLogoPreview(null);
  };

  const handleDeleteWorkspace = () => {
    if (!canDeleteWorkspace) {
      return;
    }

    deleteWorkspace.mutate(workspaceId, {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: workspaceKeys.detail(workspaceId),
        });

        queryClient.invalidateQueries({
          queryKey: workspaceKeys.list(),
        });

        router.push("/dashboard/workspaces");
      },
    });
  };

  const handleCopy = async (value: string, field: "id" | "slug") => {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch {
      // Clipboard may be unavailable.
    }
  };

  const isLoading = workspaceQuery.isLoading || membersQuery.isLoading;

  const isError = workspaceQuery.isError || membersQuery.isError;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading workspace settings...
        </div>
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />

          <p className="mt-3 text-sm font-medium">
            Failed to load workspace settings.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const currentAvatar = logoPreview || workspace.avatar?.url || undefined;

  const workspaceInitial = workspace.name?.charAt(0)?.toUpperCase() || "W";

  const formattedCreatedAt = workspace.createdAt
    ? new Date(workspace.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const ownerName = ownerMember?.userId.name || "Workspace owner";

  const ownerEmail =
    ownerMember?.userId.email || "Owner information unavailable";

  const ownerAvatar = ownerMember?.userId.avatar;

  return (
    <>
      <div className="mx-auto w-full max-w-5xl space-y-10">
        {/* Header */}
        <div className="border-b pb-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-muted p-2.5">
              <Info className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Workspace Settings
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Manage your workspace information, branding, and workspace-level
                controls.
              </p>
            </div>
          </div>
        </div>

        {/* GENERAL */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">General</h2>

            <p className="text-sm text-muted-foreground">
              Update the basic information your team sees across the workspace.
            </p>
          </div>

          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Workspace information</CardTitle>

              <CardDescription>
                Keep your workspace identity clear and easy to recognize.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="workspace-name"
                    className="text-sm font-medium"
                  >
                    Workspace name
                  </label>

                  <Input
                    id="workspace-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={!canEditWorkspace || updateWorkspace.isPending}
                    placeholder="Enter workspace name"
                    maxLength={100}
                  />

                  <p className="text-xs text-muted-foreground">
                    This name is shown throughout your workspace.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label
                    htmlFor="workspace-description"
                    className="text-sm font-medium"
                  >
                    Description
                  </label>

                  <Textarea
                    id="workspace-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={!canEditWorkspace || updateWorkspace.isPending}
                    placeholder="Describe what this workspace is used for"
                    className="min-h-[120px] resize-y"
                    maxLength={1000}
                  />

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                      Add a short description for your team.
                    </p>

                    <span className="text-xs text-muted-foreground">
                      {description.length}/1000
                    </span>
                  </div>
                </div>

                {canEditWorkspace ? (
                  <div className="flex items-center justify-end gap-3 border-t pt-5">
                    {saved && (
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Check className="h-4 w-4" />
                        Saved
                      </span>
                    )}

                    <Button
                      type="submit"
                      disabled={!name.trim() || updateWorkspace.isPending}
                    >
                      {updateWorkspace.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                      <div>
                        <p className="text-sm font-medium">View only</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Members can view workspace information, but only
                          Owners and Admins can modify it.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </section>

        {/* BRANDING */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Branding</h2>

            <p className="text-sm text-muted-foreground">
              Give your workspace a recognizable visual identity.
            </p>
          </div>

          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Workspace logo</CardTitle>

              <CardDescription>
                Upload an image that represents your workspace.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar className="h-20 w-20 shrink-0 rounded-2xl">
                    <AvatarImage src={currentAvatar} alt={workspace.name} />

                    <AvatarFallback className="rounded-2xl text-xl">
                      {workspaceInitial}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-medium">{workspace.name}</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      JPG, PNG or another supported image
                    </p>

                    {selectedLogo && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        Selected: {selectedLogo.name}
                      </p>
                    )}
                  </div>
                </div>

                {canEditWorkspace && (
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoSelect}
                    />

                    {!selectedLogo ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Change logo
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelLogo}
                          disabled={updateWorkspaceLogo.isPending}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="button"
                          onClick={handleLogoUpload}
                          disabled={updateWorkspaceLogo.isPending}
                        >
                          {updateWorkspaceLogo.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload logo
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {!canEditWorkspace && (
                <div className="mt-5 rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Only Owners and Admins can change the workspace logo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ABOUT */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">About this workspace</h2>

            <p className="text-sm text-muted-foreground">
              Important workspace details and ownership information.
            </p>
          </div>

          <Card className="border-border/60 shadow-none">
            <CardContent className="p-0">
              <div className="divide-y">
                {/* Owner */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarImage src={ownerAvatar} alt={ownerName} />

                      <AvatarFallback>
                        {ownerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="text-sm font-medium">Workspace owner</p>

                      <p className="mt-1 truncate text-sm">{ownerName}</p>

                      <p className="truncate text-xs text-muted-foreground">
                        {ownerEmail}
                      </p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="w-fit shrink-0">
                    OWNER
                  </Badge>
                </div>

                {/* Members */}
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Users className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Members</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Current workspace membership count.
                      </p>
                    </div>
                  </div>

                  <span className="text-lg font-semibold">
                    {members.length}
                  </span>
                </div>

                {/* Created */}
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Created</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Workspace creation date.
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium">
                    {formattedCreatedAt}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* YOUR ROLE */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Your role</h2>

            <p className="text-sm text-muted-foreground">
              Your workspace role determines what you can manage.
            </p>
          </div>

          <Card className="border-border/60 shadow-none">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {role === "OWNER"
                      ? "Owner"
                      : role === "ADMIN"
                        ? "Admin"
                        : role === "MEMBER"
                          ? "Member"
                          : "Unknown"}
                  </p>

                  {role === "OWNER" && <CheckCircle2 className="h-4 w-4" />}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {role === "OWNER" &&
                    "You have full control over this workspace."}

                  {role === "ADMIN" &&
                    "You can manage workspace configuration, but cannot delete the workspace."}

                  {role === "MEMBER" &&
                    "You can use the workspace, but cannot change workspace configuration."}

                  {!role && "Your workspace role could not be determined."}
                </p>
              </div>

              <Badge
                variant={role === "OWNER" ? "default" : "secondary"}
                className="w-fit"
              >
                {role ?? "UNKNOWN"}
              </Badge>
            </CardContent>
          </Card>
        </section>

        {/* ADVANCED */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Advanced</h2>

            <p className="text-sm text-muted-foreground">
              Technical identifiers used by DevSpace.
            </p>
          </div>

          <Card className="border-border/60 shadow-none">
            <CardContent className="p-0">
              <div className="divide-y">
                {/* Workspace ID */}
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Workspace ID</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Internal identifier for this workspace.
                    </p>
                  </div>

                  <div className="flex min-w-0 max-w-full items-center gap-2">
                    <code className="max-w-[420px] truncate rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
                      {workspace._id}
                    </code>

                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleCopy(workspace._id, "id")}
                      aria-label="Copy workspace ID"
                    >
                      {copiedField === "id" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Slug */}
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">Workspace slug</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      URL-friendly identifier for the workspace.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
                      {workspace.slug}
                    </code>

                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleCopy(workspace.slug, "slug")}
                      aria-label="Copy workspace slug"
                    >
                      {copiedField === "slug" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* DANGER ZONE */}
        {canDeleteWorkspace && (
          <section className="space-y-4 pb-10">
            <div>
              <h2 className="text-lg font-semibold text-destructive">
                Danger Zone
              </h2>

              <p className="text-sm text-muted-foreground">
                Destructive workspace actions.
              </p>
            </div>

            <Card className="border-destructive/30 bg-destructive/[0.02] shadow-none">
              <CardContent className="p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">Delete workspace</p>

                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                      Remove this workspace from your active workspaces. Only
                      the workspace owner can perform this action.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    className="shrink-0"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete workspace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Member notice */}
        {role === "MEMBER" && (
          <div className="mb-8 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  You have view-only workspace settings
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Contact a workspace Owner or Admin if a workspace
                  configuration needs to be changed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workspace?</AlertDialogTitle>

            <AlertDialogDescription>
              You are about to delete{" "}
              <span className="font-medium text-foreground">
                {workspace.name}
              </span>
              . This will remove the workspace from your active workspace list.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteWorkspace.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteWorkspace}
              disabled={deleteWorkspace.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteWorkspace.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete workspace
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
