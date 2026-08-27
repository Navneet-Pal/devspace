import { Types } from "mongoose";

import { activityRepository } from "./repository.js";
import type { ActivityType } from "./types.js";

class ActivityService {
  async record(
    workspaceId: string | Types.ObjectId,
    projectId: string | Types.ObjectId,
    actorId: string | Types.ObjectId,
    type: ActivityType,
    metadata: Record<string, unknown> = {},
    taskId?: string | Types.ObjectId | null,
  ) {
    return activityRepository.create(
      this.toObjectId(workspaceId),
      this.toObjectId(projectId),
      taskId ? this.toObjectId(taskId) : null,
      this.toObjectId(actorId),
      type,
      metadata,
    );
  }

  async getProjectActivity(projectId: string) {
    return activityRepository.findByProject(new Types.ObjectId(projectId));
  }

  async getTaskActivity(projectId: string, taskId: string) {
    return activityRepository.findByTask(
      new Types.ObjectId(projectId),
      new Types.ObjectId(taskId),
    );
  }

  private toObjectId(value: string | Types.ObjectId) {
    return value instanceof Types.ObjectId ? value : new Types.ObjectId(value);
  }
}

export const activityService = new ActivityService();
