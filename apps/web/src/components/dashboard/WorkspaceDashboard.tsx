"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Activity, FolderKanban, ListTodo, Mail, Users } from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/auth";

import { useWorkspace } from "@/hooks/workspace/useWorkspace";
import { useProjects } from "@/hooks/project/useProject";
import { useWorkspaceTasks } from "@/hooks/task/useTask";
import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";
import { useWorkspaceInvitations } from "@/hooks/workspaceInvitation/workspaceInvitation";

import { activityService } from "@/services/activity/service";

import type { Activity as WorkspaceActivity } from "@/services/activity/types";

interface WorkspaceDashboardProps {
  workspaceId: string;
}

const getStringMetadata = (metadata: Record<string, unknown>, key: string) => {
  const value = metadata[key];

  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

const getChangedValue = (metadata: Record<string, unknown>, field: string) => {
  const changes = metadata.changes;

  if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
    return null;
  }

  const change = (changes as Record<string, unknown>)[field];

  if (!change || typeof change !== "object" || Array.isArray(change)) {
    return null;
  }

  const value = (change as Record<string, unknown>).to;

  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

const formatActivityValue = (value: string) => {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getActivityMessage = (activity: WorkspaceActivity) => {
  const actor = activity.actorId.name;
  const metadata = activity.metadata ?? {};

  const title =
    getStringMetadata(metadata, "title") ??
    getStringMetadata(metadata, "taskTitle") ??
    getStringMetadata(metadata, "documentTitle");

  const projectName =
    getStringMetadata(metadata, "projectName") ??
    getStringMetadata(metadata, "name");

  const fileName = getStringMetadata(metadata, "fileName");
  const memberName = getStringMetadata(metadata, "memberName");
  const from = getStringMetadata(metadata, "from");
  const to = getStringMetadata(metadata, "to");

  const updatedTitle = getChangedValue(metadata, "title");
  const updatedProjectName = getChangedValue(metadata, "name");

  switch (activity.type) {
    case "TASK_CREATED":
      return title
        ? `${actor} created task "${title}"`
        : `${actor} created a task`;

    case "TASK_UPDATED":
      return title
        ? `${actor} updated task "${title}"`
        : updatedTitle
          ? `${actor} updated task "${updatedTitle}"`
          : `${actor} updated a task`;

    case "TASK_STATUS_CHANGED":
      if (title && from && to) {
        return (
          <span className="flex flex-wrap items-center gap-1.5">
            <span>
              {actor} changed status of "{title}"
            </span>

            <span className="font-medium">{formatActivityValue(from)}</span>

            <span className="text-muted-foreground">→</span>

            <span className="font-medium">{formatActivityValue(to)}</span>
          </span>
        );
      }

      return title
        ? `${actor} changed status of "${title}"`
        : `${actor} changed task status`;

    case "TASK_PRIORITY_CHANGED":
      if (title && from && to) {
        return (
          <span className="flex flex-wrap items-center gap-1.5">
            <span>
              {actor} changed priority of "{title}"
            </span>

            <span className="font-medium">{formatActivityValue(from)}</span>

            <span className="text-muted-foreground">→</span>

            <span className="font-medium">{formatActivityValue(to)}</span>
          </span>
        );
      }

      return title
        ? `${actor} changed priority of "${title}"`
        : `${actor} changed task priority`;

    case "TASK_ASSIGNED":
      return title
        ? `${actor} assigned task "${title}"`
        : `${actor} assigned a task`;

    case "TASK_UNASSIGNED":
      return title
        ? `${actor} unassigned task "${title}"`
        : `${actor} unassigned a task`;

    case "TASK_MOVED":
      return title ? `${actor} moved task "${title}"` : `${actor} moved a task`;

    case "TASK_DELETED":
      return title
        ? `${actor} deleted task "${title}"`
        : `${actor} deleted a task`;

    case "COMMENT_CREATED":
      return title
        ? `${actor} commented on "${title}"`
        : `${actor} added a comment`;

    case "COMMENT_UPDATED":
      return title
        ? `${actor} edited a comment on "${title}"`
        : `${actor} edited a comment`;

    case "COMMENT_DELETED":
      return title
        ? `${actor} deleted a comment on "${title}"`
        : `${actor} deleted a comment`;

    case "PROJECT_CREATED":
      return projectName
        ? `${actor} created project "${projectName}"`
        : `${actor} created a project`;

    case "PROJECT_UPDATED":
      return projectName
        ? `${actor} updated project "${projectName}"`
        : updatedProjectName
          ? `${actor} updated project "${updatedProjectName}"`
          : `${actor} updated a project`;

    case "MEMBER_ADDED":
      return memberName
        ? `${actor} added ${memberName} to the project`
        : `${actor} added a project member`;

    case "MEMBER_REMOVED":
      return memberName
        ? `${actor} removed ${memberName} from the project`
        : `${actor} removed a project member`;

    case "MEMBER_ROLE_CHANGED":
      if (memberName && from && to) {
        return (
          <span className="flex flex-wrap items-center gap-1.5">
            <span>
              {actor} changed {memberName}'s role
            </span>

            <span className="font-medium">{formatActivityValue(from)}</span>

            <span className="text-muted-foreground">→</span>

            <span className="font-medium">{formatActivityValue(to)}</span>
          </span>
        );
      }

      return memberName
        ? `${actor} changed ${memberName}'s role`
        : `${actor} changed a member's role`;

    case "DOCUMENT_CREATED":
      return title
        ? `${actor} created document "${title}"`
        : `${actor} created a document`;

    case "DOCUMENT_UPDATED":
      return title
        ? `${actor} updated document "${title}"`
        : updatedTitle
          ? `${actor} updated document "${updatedTitle}"`
          : `${actor} updated a document`;

    case "DOCUMENT_DELETED":
      return title
        ? `${actor} deleted document "${title}"`
        : `${actor} deleted a document`;

    case "FILE_UPLOADED":
      return fileName
        ? `${actor} uploaded file "${fileName}"`
        : `${actor} uploaded a file`;

    case "FILE_DELETED":
      return fileName
        ? `${actor} deleted file "${fileName}"`
        : `${actor} deleted a file`;

    default:
      return `${actor} performed an activity`;
  }
};

const getActivityDestination = (
  workspaceId: string,
  activity: WorkspaceActivity,
) => {
  if (activity.taskId) {
    return `/dashboard/workspaces/${workspaceId}/projects/${activity.projectId}/tasks`;
  }

  switch (activity.type) {
    case "PROJECT_CREATED":
    case "PROJECT_UPDATED":
      return `/dashboard/workspaces/${workspaceId}/projects/${activity.projectId}`;

    case "DOCUMENT_CREATED":
    case "DOCUMENT_UPDATED":
    case "DOCUMENT_DELETED":
      return `/dashboard/workspaces/${workspaceId}/projects/${activity.projectId}/documentation`;

    case "FILE_UPLOADED":
    case "FILE_DELETED":
      return `/dashboard/workspaces/${workspaceId}/projects/${activity.projectId}/files`;

    case "MEMBER_ADDED":
    case "MEMBER_REMOVED":
    case "MEMBER_ROLE_CHANGED":
      return `/dashboard/workspaces/${workspaceId}/members`;

    default:
      return null;
  }
};

export const WorkspaceDashboard = ({
  workspaceId,
}: WorkspaceDashboardProps) => {
  const user = useAuthStore((state) => state.user);

  const workspaceQuery = useWorkspace(workspaceId);

  const projectsQuery = useProjects(workspaceId);

  const tasksQuery = useWorkspaceTasks(workspaceId);

  const membersQuery = useWorkspaceMembers(workspaceId);

  const members = membersQuery.data?.data ?? [];

  const currentMember = user
    ? members.find((member) => member.userId._id === user._id)
    : undefined;

  const canManageInvitations =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const invitationsQuery = useWorkspaceInvitations(
    workspaceId,
    canManageInvitations,
  );

  const workspace = workspaceQuery.data?.data;

  const projects = projectsQuery.data?.data ?? [];

  const tasks = tasksQuery.data?.data ?? [];

  const invitations = invitationsQuery.data?.data ?? [];

  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === "PENDING",
  );

  const activityQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["workspace-dashboard-activity", workspaceId, project._id],

      queryFn: () =>
        activityService.getProjectActivity(workspaceId, project._id),

      enabled: !!workspaceId && !!project._id,
    })),
  });

  const recentActivity = useMemo(() => {
    return activityQueries
      .flatMap((query) => query.data?.data ?? [])
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 8);
  }, [activityQueries]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const dueToday = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    const dueDate = new Date(task.dueDate);

    return dueDate >= todayStart && dueDate < tomorrowStart;
  });

  const activeProjects = projects.filter(
    (project) => project.status === "Active",
  );

  const openTasks = tasks.filter((task) => task.status !== "DONE");

  if (
    workspaceQuery.isLoading ||
    projectsQuery.isLoading ||
    tasksQuery.isLoading ||
    membersQuery.isLoading ||
    (canManageInvitations && invitationsQuery.isLoading)
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading workspace dashboard...
        </p>
      </div>
    );
  }

  if (
    workspaceQuery.isError ||
    projectsQuery.isError ||
    tasksQuery.isError ||
    membersQuery.isError ||
    (canManageInvitations && invitationsQuery.isError) ||
    !workspace
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-destructive">
          Failed to load workspace dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>

        <p className="mt-1 text-muted-foreground">
          {workspace.description || "Overview of your workspace."}
        </p>
      </div>

      {/* Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Members</p>

                <p className="mt-2 text-3xl font-semibold">{members.length}</p>
              </div>

              <div className="rounded-lg bg-muted p-2.5">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>

                <p className="mt-2 text-3xl font-semibold">{projects.length}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {activeProjects.length} active
                </p>
              </div>

              <div className="rounded-lg bg-muted p-2.5">
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks</p>

                <p className="mt-2 text-3xl font-semibold">
                  {openTasks.length}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {dueToday.length} due today
                </p>
              </div>

              <div className="rounded-lg bg-muted p-2.5">
                <ListTodo className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {canManageInvitations && (
          <Card className="border-border/60 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Invitations</p>

                  <p className="mt-2 text-3xl font-semibold">
                    {pendingInvitations.length}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Pending response
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-2.5">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Recent Activity + Recent Projects */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border/60 shadow-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />

              <CardTitle>Recent Activity</CardTitle>
            </div>

            <p className="text-sm text-muted-foreground">
              Latest activity in this workspace.
            </p>
          </CardHeader>

          <CardContent>
            {activityQueries.some((query) => query.isLoading) ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded-lg bg-muted/50"
                  />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  No activity yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((activity) => {
                  const destination = getActivityDestination(
                    workspaceId,
                    activity,
                  );

                  const content = (
                    <>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {activity.actorId.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5">
                          {getActivityMessage(activity)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </>
                  );

                  if (destination) {
                    return (
                      <Link
                        key={activity._id}
                        href={destination}
                        className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent/40"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={activity._id}
                      className="flex items-start gap-3 rounded-lg p-2"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="border-border/60 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Projects in this workspace.
                </p>
              </div>

              <Link href={`/dashboard/workspaces/${workspaceId}/projects`}>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {projects.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  No projects yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.slice(0, 4).map((project) => (
                  <Link
                    key={project._id}
                    href={`/dashboard/workspaces/${workspaceId}/projects/${project._id}`}
                    className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {project.name}
                      </p>

                      {project.description && (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <Badge
                      variant={
                        project.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {project.status === "Active" ? "Active" : "Archived"}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Members + Invitations */}
      <div
        className={
          canManageInvitations ? "grid gap-6 xl:grid-cols-2" : "grid gap-6"
        }
      >
        {/* Members */}
        <Card className="border-border/60 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Members</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  People working in this workspace.
                </p>
              </div>

              <Link href={`/dashboard/workspaces/${workspaceId}/members`}>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {members.length === 0 ? (
              <div className="flex min-h-[160px] items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  No members found.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {members.slice(0, 5).map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.userId.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {member.userId.email}
                      </p>
                    </div>

                    <Badge variant="secondary">{member.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {canManageInvitations && (
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Invitations</CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    People waiting to join.
                  </p>
                </div>

                <Link href={`/dashboard/workspaces/${workspaceId}/invitations`}>
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent>
              {pendingInvitations.length === 0 ? (
                <div className="flex min-h-[160px] items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">
                    No pending invitations.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingInvitations.slice(0, 5).map((invitation) => (
                    <div
                      key={invitation._id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {invitation.userId.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {invitation.userId.email}
                        </p>
                      </div>

                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Navigation */}
      <Card className="border-border/60 shadow-none">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>

          <p className="text-sm text-muted-foreground">
            Quickly navigate to common workspace areas.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={`/dashboard/workspaces/${workspaceId}/projects`}>
              <Button variant="outline" className="w-full">
                <FolderKanban className="mr-2 h-4 w-4" />
                Projects
              </Button>
            </Link>

            <Link href={`/dashboard/workspaces/${workspaceId}/tasks`}>
              <Button variant="outline" className="w-full">
                <ListTodo className="mr-2 h-4 w-4" />
                Tasks
              </Button>
            </Link>

            <Link href={`/dashboard/workspaces/${workspaceId}/members`}>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Members
              </Button>
            </Link>

            {canManageInvitations && (
              <Link href={`/dashboard/workspaces/${workspaceId}/invitations`}>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Invitations
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
