import { Types } from "mongoose";

export interface DashboardStats {
  workspaces: number;
  projects: number;
  myOpenTasks: number;
  pendingInvitations: number;
}

export interface DashboardTask {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  projectName: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
}

export interface DashboardActivity {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  taskId: Types.ObjectId | null;
  actorId: Types.ObjectId;
  type: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface DashboardWorkspace {
  _id: Types.ObjectId;
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
