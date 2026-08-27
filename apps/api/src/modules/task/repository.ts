import { Types } from "mongoose";
import { Task } from "./model.js";
import {
  CreateTaskInput,
  ITask,
  PopulatedTask,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from "./types.js";
import { Project } from "../project/model.js";

class TaskRepository {
  async create(
    projectId: Types.ObjectId,
    createdBy: Types.ObjectId,
    data: CreateTaskInput,
  ): Promise<ITask> {
    const task = await Task.create({
      projectId,
      createdBy,
      ...data,
    });

    return task;
  }

  async findById(
    taskId: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<PopulatedTask | null> {
    return Task.findOne({
      _id: taskId,
      projectId,
      deletedAt: null,
    }).populate<{ assignedTo: PopulatedTask["assignedTo"] }>(
      "assignedTo",
      "_id name email",
    );
  }

  async findByProject(projectId: Types.ObjectId): Promise<PopulatedTask[]> {
    return Task.find({
      projectId,
      deletedAt: null,
    })
      .populate<{ assignedTo: PopulatedTask["assignedTo"] }>(
        "assignedTo",
        "_id name email",
      )
      .sort({
        status: 1,
        position: 1,
      });
  }

  async updateById(
    taskId: Types.ObjectId,
    projectId: Types.ObjectId,
    data: UpdateTaskInput,
  ): Promise<ITask | null> {
    return Task.findOneAndUpdate(
      {
        _id: taskId,
        projectId,
        deletedAt: null,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateStatus(
    taskId: Types.ObjectId,
    projectId: Types.ObjectId,
    status: TaskStatus,
  ): Promise<ITask | null> {
    return Task.findOneAndUpdate(
      {
        _id: taskId,
        projectId,
        deletedAt: null,
      },
      {
        $set: { status },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updatePriority(
    taskId: Types.ObjectId,
    projectId: Types.ObjectId,
    priority: TaskPriority,
  ): Promise<ITask | null> {
    return Task.findOneAndUpdate(
      {
        _id: taskId,
        projectId,
        deletedAt: null,
      },
      {
        $set: { priority },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateAssignee(
    taskId: Types.ObjectId,
    projectId: Types.ObjectId,
    assignedTo: Types.ObjectId | null,
  ): Promise<ITask | null> {
    return Task.findOneAndUpdate(
      {
        _id: taskId,
        projectId,
        deletedAt: null,
      },
      {
        $set: { assignedTo },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updatePosition(
    taskId: Types.ObjectId,
    projectId: Types.ObjectId,
    position: number,
  ): Promise<ITask | null> {
    return Task.findOneAndUpdate(
      {
        _id: taskId,
        projectId,
        deletedAt: null,
      },
      {
        $set: { position },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async softDelete(
    taskId: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<ITask | null> {
    return Task.findOneAndUpdate(
      {
        _id: taskId,
        projectId,
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
      {
        new: true,
      },
    );
  }

  async findByWorkspace(workspaceId: Types.ObjectId): Promise<PopulatedTask[]> {
    const projects = await Project.find({
      workspaceId,
    }).select("_id");

    const projectIds = projects.map((project) => project._id);

    if (projectIds.length === 0) {
      return [];
    }

    return Task.find({
      projectId: {
        $in: projectIds,
      },
      deletedAt: null,
    })
      .populate<{ assignedTo: PopulatedTask["assignedTo"] }>(
        "assignedTo",
        "_id name email",
      )
      .sort({
        status: 1,
        position: 1,
      });
  }
}

export const taskRepository = new TaskRepository();
