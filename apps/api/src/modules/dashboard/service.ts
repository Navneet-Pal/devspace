import { Types } from "mongoose";

import { dashboardRepository } from "./repository.js";

class DashboardService {
  async getDashboard(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const workspaceIds =
      await dashboardRepository.getUserWorkspaceIds(userObjectId);

    const [
      workspaceCount,
      projectCount,
      myOpenTasksCount,
      pendingInvitationsCount,
      myTasks,
      upcomingTasks,
      recentActivity,
      workspaces,
    ] = await Promise.all([
      dashboardRepository.countWorkspaces(workspaceIds),

      dashboardRepository.countProjects(workspaceIds),

      dashboardRepository.countMyOpenTasks(workspaceIds, userObjectId),

      dashboardRepository.countPendingInvitations(userObjectId),

      dashboardRepository.findMyTasks(workspaceIds, userObjectId),

      dashboardRepository.findUpcomingTasks(workspaceIds, userObjectId),

      dashboardRepository.findRecentActivity(workspaceIds),

      dashboardRepository.findMyWorkspaces(workspaceIds),
    ]);

    return {
      stats: {
        workspaces: workspaceCount,
        projects: projectCount,
        myOpenTasks: myOpenTasksCount,
        pendingInvitations: pendingInvitationsCount,
      },

      myTasks,

      upcomingTasks,

      recentActivity,

      workspaces,
    };
  }
}

export const dashboardService = new DashboardService();
