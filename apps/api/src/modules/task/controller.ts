import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { StatusCode } from "../../constants/statusCode.js";

import { taskService } from "./service.js";

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(
    req.params.workspaceId as string,
    req.params.projectId as string,
    req.user._id.toString(),
    req.body,
  );

  return res
    .status(StatusCode.CREATED)
    .json(
      new ApiResponse(StatusCode.CREATED, task, "Task created successfully."),
    );
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.getTasks(req.params.projectId as string);

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, tasks, "Tasks fetched successfully."));
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.getTask(
    req.params.projectId as string,
    req.params.taskId as string,
  );

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, task, "Task fetched successfully."));
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.updateTask(
    req.params.workspaceId as string,
    req.params.projectId as string,
    req.params.taskId as string,
    req.user._id.toString(),
    req.projectMember.role,
    req.body,
  );

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, task, "Task updated successfully."));
});

export const updateTaskStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await taskService.updateTaskStatus(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.user._id.toString(),
      req.projectMember.role,
      req.body.status,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          task,
          "Task status updated successfully.",
        ),
      );
  },
);

export const updateTaskPriority = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await taskService.updateTaskPriority(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.user._id.toString(),
      req.body.priority,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          task,
          "Task priority updated successfully.",
        ),
      );
  },
);

export const updateTaskAssignee = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await taskService.updateTaskAssignee(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.user._id.toString(),
      req.body.assignedTo ?? null,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          task,
          "Task assignee updated successfully.",
        ),
      );
  },
);

export const updateTaskPosition = asyncHandler(
  async (req: Request, res: Response) => {
    const task = await taskService.updateTaskPosition(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.user._id.toString(),
      req.projectMember.role,
      req.body.position,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          task,
          "Task position updated successfully.",
        ),
      );
  },
);

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  await taskService.deleteTask(
    req.params.workspaceId as string,
    req.params.projectId as string,
    req.params.taskId as string,
    req.user._id.toString(),
  );

  return res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, null, "Task deleted successfully."));
});

export const getWorkspaceTasks = asyncHandler(
  async (req: Request, res: Response) => {
    const tasks = await taskService.getWorkspaceTasks(
      req.params.workspaceId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          tasks,
          "Workspace tasks fetched successfully.",
        ),
      );
  },
);
