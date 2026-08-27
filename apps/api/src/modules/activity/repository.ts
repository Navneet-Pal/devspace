import { Types } from "mongoose";

import { Activity } from "./model.js";
import type { ActivityType, IActivity } from "./types.js";

class ActivityRepository {
  async create(
    workspaceId: Types.ObjectId,
    projectId: Types.ObjectId,
    taskId: Types.ObjectId | null,
    actorId: Types.ObjectId,
    type: ActivityType,
    metadata: Record<string, unknown> = {},
  ): Promise<IActivity> {
    return Activity.create({
      workspaceId,
      projectId,
      taskId,
      actorId,
      type,
      metadata,
    });
  }

  async findByProject(projectId: Types.ObjectId): Promise<IActivity[]> {
    return Activity.find({
      projectId,
    })
      .sort({
        createdAt: -1,
      })
      .populate("actorId", "_id name email avatar");
  }

  async findByTask(
    projectId: Types.ObjectId,
    taskId: Types.ObjectId,
  ): Promise<IActivity[]> {
    return Activity.find({
      projectId,
      taskId,
    })
      .sort({
        createdAt: -1,
      })
      .populate("actorId", "_id name email avatar");
  }
}

export const activityRepository = new ActivityRepository();
