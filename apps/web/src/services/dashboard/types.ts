import type { ApiResponse } from "@/types/apiTypes";

export interface DashboardStats {
  workspaces: number;
  projects: number;
  myOpenTasks: number;
  pendingInvitations: number;
}

export interface DashboardTask {
  _id: string;
  workspaceId: string;
  projectId: string;
  projectName: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
}

export interface DashboardActivityActor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DashboardActivity {
  _id: string;
  workspaceId: string;
  projectId: string;
  taskId: string | null;
  actorId: DashboardActivityActor;
  type: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardWorkspace {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  myTasks: DashboardTask[];
  upcomingTasks: DashboardTask[];
  recentActivity: DashboardActivity[];
  workspaces: DashboardWorkspace[];
}

export type GetDashboardResponse = ApiResponse<DashboardData>;
