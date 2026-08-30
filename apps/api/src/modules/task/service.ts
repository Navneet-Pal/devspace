import { Types } from "mongoose";

import { StatusCode } from "../../constants/statusCode.js";
import { PROJECT_ROLE, ProjectRole } from "../../constants/projectRole.js";
import { ApiError } from "../../utils/ApiError.js";

import { workspaceMemberRepository } from "../workspaceMember/repository.js";
import { activityService } from "../activity/service.js";
import { ACTIVITY_TYPE } from "../activity/types.js";

import { taskRepository } from "./repository.js";
import type {
  CreateTaskInput,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from "./types.js";

class TaskService {
  async createTask(
    workspaceId: string,
    projectId: string,
    userId: string,
    data: CreateTaskInput,
  ) {
    /*
     * A task can be assigned to any member of the workspace.
     * Project membership is not required for task assignment.
     */
    if (data.assignedTo) {
      const workspaceMember =
        await workspaceMemberRepository.findByUserAndWorkspace(
          workspaceId,
          data.assignedTo,
        );

      if (!workspaceMember) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Assigned user is not a member of this workspace.",
        );
      }
    }

    const task = await taskRepository.create(
      new Types.ObjectId(projectId),
      new Types.ObjectId(userId),
      {
        ...data,
        position: data.position ?? Date.now(),
      },
    );

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.TASK_CREATED,
      {
        taskId: task._id.toString(),
        taskTitle: task.title,
      },
      task._id,
    );

    return task;
  }

  async getTasks(projectId: string) {
    return taskRepository.findByProject(new Types.ObjectId(projectId));
  }

  async getWorkspaceTasks(workspaceId: string) {
    return taskRepository.findByWorkspace(new Types.ObjectId(workspaceId));
  }

  async getTask(projectId: string, taskId: string) {
    const task = await taskRepository.findById(
      new Types.ObjectId(taskId),
      new Types.ObjectId(projectId),
    );

    if (!task) {
      throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
    }

    return task;
  }

  async updateTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    projectRole: ProjectRole,
    data: UpdateTaskInput,
  ) {
    const task = await this.getTask(projectId, taskId);

    this.checkTaskModificationPermission(task, userId, projectRole);

    const titleChanged = data.title !== undefined && data.title !== task.title;

    const descriptionChanged =
      data.description !== undefined &&
      data.description !== (task.description ?? "");

    const dueDateChanged =
      data.dueDate !== undefined &&
      this.normalizeDate(data.dueDate) !== this.normalizeDate(task.dueDate);

    const updatedTask = await taskRepository.updateById(
      new Types.ObjectId(taskId),
      new Types.ObjectId(projectId),
      data,
    );

    if (!updatedTask) {
      throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
    }

    if (titleChanged || descriptionChanged || dueDateChanged) {
      await activityService.record(
        workspaceId,
        projectId,
        userId,
        ACTIVITY_TYPE.TASK_UPDATED,
        {
          taskId,
          taskTitle: task.title,
          changes: {
            ...(titleChanged && {
              title: {
                from: task.title,
                to: data.title,
              },
            }),

            ...(descriptionChanged && {
              description: {
                from: task.description ?? null,
                to: data.description ?? null,
              },
            }),

            ...(dueDateChanged && {
              dueDate: {
                from: task.dueDate,
                to: data.dueDate,
              },
            }),
          },
        },
        taskId,
      );
    }

    return updatedTask;
  }

  async updateTaskStatus(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    projectRole: ProjectRole,
    status: TaskStatus,
  ) {
    const task = await this.getTask(projectId, taskId);

    this.checkTaskModificationPermission(task, userId, projectRole);

    if (task.status === status) {
      return task;
    }

    const updatedTask = await taskRepository.updateStatus(
      new Types.ObjectId(taskId),
      new Types.ObjectId(projectId),
      status,
    );

    if (!updatedTask) {
      throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
    }

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.TASK_STATUS_CHANGED,
      {
        taskId,
        taskTitle: task.title,
        from: task.status,
        to: status,
      },
      taskId,
    );

    return updatedTask;
  }

  async updateTaskPriority(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    priority: TaskPriority,
  ) {
    const task = await this.getTask(projectId, taskId);

    if (task.priority === priority) {
      return task;
    }

    const updatedTask = await taskRepository.updatePriority(
      new Types.ObjectId(taskId),
      new Types.ObjectId(projectId),
      priority,
    );

    if (!updatedTask) {
      throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
    }

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.TASK_PRIORITY_CHANGED,
      {
        taskId,
        taskTitle: task.title,
        from: task.priority,
        to: priority,
      },
      taskId,
    );

    return updatedTask;
  }

  async updateTaskAssignee(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    assignedTo: string | null,
  ) {
    const task = await this.getTask(projectId, taskId);

    /*
     * A task can be assigned to any workspace member.
     */
    if (assignedTo) {
      const workspaceMember =
        await workspaceMemberRepository.findByUserAndWorkspace(
          workspaceId,
          assignedTo,
        );

      if (!workspaceMember) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Assigned user is not a member of this workspace.",
        );
      }
    }

    const previousAssigneeId = task.assignedTo
      ? task.assignedTo._id.toString()
      : null;

    if (previousAssigneeId === assignedTo) {
      return task;
    }

    const updatedTask = await taskRepository.updateAssignee(
      new Types.ObjectId(taskId),
      new Types.ObjectId(projectId),
      assignedTo ? new Types.ObjectId(assignedTo) : null,
    );

    if (!updatedTask) {
      throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
    }

    if (assignedTo) {
      await activityService.record(
        workspaceId,
        projectId,
        userId,
        ACTIVITY_TYPE.TASK_ASSIGNED,
        {
          taskId,
          taskTitle: task.title,
          from: previousAssigneeId,
          to: assignedTo,
        },
        taskId,
      );
    } else {
      await activityService.record(
        workspaceId,
        projectId,
        userId,
        ACTIVITY_TYPE.TASK_UNASSIGNED,
        {
          taskId,
          taskTitle: task.title,
          from: previousAssigneeId,
          to: null,
        },
        taskId,
      );
    }

    return updatedTask;
  }

  async updateTaskPosition(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    projectRole: ProjectRole,
    position: number,
  ) {
    const task = await this.getTask(projectId, taskId);

    this.checkTaskModificationPermission(task, userId, projectRole);

    if (task.position === position) {
      return task;
    }

    const updatedTask = await taskRepository.updatePosition(
      new Types.ObjectId(taskId),
      new Types.ObjectId(projectId),
      position,
    );

    if (!updatedTask) {
      throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
    }

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.TASK_MOVED,
      {
        taskId,
        taskTitle: task.title,
        from: task.position,
        to: position,
      },
      taskId,
    );

    return updatedTask;
  }

  async deleteTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
  ) {
    const task = await this.getTask(projectId, taskId);

    const deletedTask = await taskRepository.softDelete(
      new Types.ObjectId(taskId),
      new Types.ObjectId(projectId),
    );

    if (!deletedTask) {
      throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
    }

    await activityService.record(
      workspaceId,
      projectId,
      userId,
      ACTIVITY_TYPE.TASK_DELETED,
      {
        taskId,
        taskTitle: task.title,
      },
      taskId,
    );

    return deletedTask;
  }

  private normalizeDate(value: Date | string | null | undefined) {
    if (!value) {
      return null;
    }

    return new Date(value).getTime();
  }

  private checkTaskModificationPermission(
    task: {
      assignedTo: {
        _id: Types.ObjectId;
      } | null;
    },
    userId: string,
    projectRole: ProjectRole,
  ) {
    if (projectRole === PROJECT_ROLE.ADMIN) {
      return;
    }

    if (projectRole === PROJECT_ROLE.VIEWER) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "Project viewers cannot modify tasks.",
      );
    }

    if (!task.assignedTo || task.assignedTo._id.toString() !== userId) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You can only modify tasks assigned to you.",
      );
    }
  }
}

export const taskService = new TaskService();
