import { Types } from "mongoose";

import { WorkspaceMember } from "../workspaceMember/model.js";
import { Workspace } from "../workspace/model.js";
import { Project } from "../project/model.js";
import { Task } from "../task/model.js";
import { Activity } from "../activity/model.js";
import { workspaceInvitation } from "../workspaceInvitation/model.js";

class DashboardRepository {
  async getUserWorkspaceIds(userId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const memberships = await WorkspaceMember.find({
      userId,
    }).select("workspaceId");

    return memberships.map((membership) => membership.workspaceId);
  }

  async countWorkspaces(workspaceIds: Types.ObjectId[]) {
    if (workspaceIds.length === 0) {
      return 0;
    }

    return Workspace.countDocuments({
      _id: {
        $in: workspaceIds,
      },
      deletedAt: null,
    });
  }

  async countProjects(workspaceIds: Types.ObjectId[]) {
    if (workspaceIds.length === 0) {
      return 0;
    }

    return Project.countDocuments({
      workspaceId: {
        $in: workspaceIds,
      },
    });
  }

  private async getProjectIds(workspaceIds: Types.ObjectId[]) {
    if (workspaceIds.length === 0) {
      return [];
    }

    const projects = await Project.find({
      workspaceId: {
        $in: workspaceIds,
      },
    }).select("_id");

    return projects.map((project) => project._id);
  }

  async countMyOpenTasks(
    workspaceIds: Types.ObjectId[],
    userId: Types.ObjectId,
  ) {
    const projectIds = await this.getProjectIds(workspaceIds);

    if (projectIds.length === 0) {
      return 0;
    }

    return Task.countDocuments({
      projectId: {
        $in: projectIds,
      },
      assignedTo: userId,
      status: {
        $ne: "DONE",
      },
      deletedAt: null,
    });
  }

  async countPendingInvitations(userId: Types.ObjectId) {
    return workspaceInvitation.countDocuments({
      userId,
      status: "PENDING",
    });
  }

  async findMyTasks(
    workspaceIds: Types.ObjectId[],
    userId: Types.ObjectId,
    limit = 6,
  ) {
    const projectIds = await this.getProjectIds(workspaceIds);

    if (projectIds.length === 0) {
      return [];
    }

    const tasks = await Task.find({
      projectId: {
        $in: projectIds,
      },
      assignedTo: userId,
      deletedAt: null,
      status: {
        $ne: "DONE",
      },
    })
      .sort({
        dueDate: 1,
        updatedAt: -1,
      })
      .limit(limit)
      .select("_id projectId title status priority dueDate")
      .populate("projectId", "_id name workspaceId")
      .lean();

    return tasks.map((task) => {
      const project = task.projectId as unknown as {
        _id: Types.ObjectId;
        name: string;
        workspaceId: Types.ObjectId;
      };

      return {
        _id: task._id,
        workspaceId: project.workspaceId,
        projectId: project._id,
        projectName: project.name,
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ?? null,
      };
    });
  }

  async findUpcomingTasks(
    workspaceIds: Types.ObjectId[],
    userId: Types.ObjectId,
    limit = 5,
  ) {
    const projectIds = await this.getProjectIds(workspaceIds);

    if (projectIds.length === 0) {
      return [];
    }

    const tasks = await Task.find({
      projectId: {
        $in: projectIds,
      },
      assignedTo: userId,
      deletedAt: null,
      dueDate: {
        $ne: null,
      },
      status: {
        $ne: "DONE",
      },
    })
      .sort({
        dueDate: 1,
      })
      .limit(limit)
      .select("_id projectId title status priority dueDate")
      .populate("projectId", "_id name workspaceId")
      .lean();

    return tasks.map((task) => {
      const project = task.projectId as unknown as {
        _id: Types.ObjectId;
        name: string;
        workspaceId: Types.ObjectId;
      };

      return {
        _id: task._id,
        workspaceId: project.workspaceId,
        projectId: project._id,
        projectName: project.name,
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ?? null,
      };
    });
  }

  async findRecentActivity(workspaceIds: Types.ObjectId[], limit = 10) {
    if (workspaceIds.length === 0) {
      return [];
    }

    return Activity.find({
      workspaceId: {
        $in: workspaceIds,
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .populate("actorId", "_id name email avatar")
      .lean();
  }

  async findMyWorkspaces(workspaceIds: Types.ObjectId[], limit = 6) {
    if (workspaceIds.length === 0) {
      return [];
    }

    return Workspace.find({
      _id: {
        $in: workspaceIds,
      },
      deletedAt: null,
    })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .select("_id name slug description")
      .lean();
  }
}

export const dashboardRepository = new DashboardRepository();
