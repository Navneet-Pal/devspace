import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { projectMiddleware } from "../../middlewares/project.js";
import { projectAuthorize } from "../../middlewares/projectPermission.js";
import { validate } from "../../middlewares/validate.js";

import { PROJECT_PERMISSION } from "../../constants/projectPermission.js";

import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  updateTaskPrioritySchema,
  updateTaskAssigneeSchema,
  updateTaskPositionSchema,
} from "./validation.js";

import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  updateTaskPriority,
  updateTaskAssignee,
  updateTaskPosition,
  deleteTask,
  getWorkspaceTasks,
} from "./controller.js";

const router = Router();

router.post(
  "/workspaces/:workspaceId/projects/:projectId/tasks",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_CREATE),
  validate(createTaskSchema),
  createTask,
);

router.get(
  "/workspaces/:workspaceId/tasks",
  authenticate,
  workspaceMiddleware,
  getWorkspaceTasks,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_READ),
  getTasks,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_READ),
  getTask,
);

router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_UPDATE),
  validate(updateTaskSchema),
  updateTask,
);

router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/status",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_CHANGE_STATUS),
  validate(updateTaskStatusSchema),
  updateTaskStatus,
);

router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/priority",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_CHANGE_PRIORITY),
  validate(updateTaskPrioritySchema),
  updateTaskPriority,
);

router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/assignee",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_ASSIGN),
  validate(updateTaskAssigneeSchema),
  updateTaskAssignee,
);

router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/position",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_UPDATE),
  validate(updateTaskPositionSchema),
  updateTaskPosition,
);

router.delete(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_DELETE),
  deleteTask,
);

export default router;
