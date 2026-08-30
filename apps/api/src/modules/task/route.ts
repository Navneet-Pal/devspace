import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { Types } from "mongoose";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { projectMiddleware } from "../../middlewares/project.js";
import { projectAuthorize } from "../../middlewares/projectPermission.js";
import { validate } from "../../middlewares/validate.js";

import { PROJECT_PERMISSION } from "../../constants/projectPermission.js";
import { PROJECT_ROLE } from "../../constants/projectRole.js";
import { StatusCode } from "../../constants/statusCode.js";
import { ApiError } from "../../utils/ApiError.js";

import { taskRepository } from "./repository.js";

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

/*
 * Only the current task assignee, workspace OWNER/ADMIN,
 * or PROJECT_ADMIN can change task status / position.
 *
 * This middleware is intentionally used only for:
 * - task status changes
 * - task drag/drop position changes
 *
 * It does NOT grant generic task-edit permission.
 */
const authorizeTaskWork = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user._id.toString();
  const workspaceMember = req.workspaceMember;
  const projectMember = req.projectMember;

  /*
   * Workspace owner/admin can work on every task.
   */
  if (workspaceMember?.role === "OWNER" || workspaceMember?.role === "ADMIN") {
    next();
    return;
  }

  /*
   * If the user has an explicit project membership,
   * respect the project role.
   */
  if (projectMember) {
    if (projectMember.role === PROJECT_ROLE.ADMIN) {
      next();
      return;
    }

    if (projectMember.role === PROJECT_ROLE.VIEWER) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "Project viewers cannot modify tasks.",
      );
    }
  }

  /*
   * Anyone reaching this point must at least be a
   * valid workspace member.
   */
  if (!workspaceMember) {
    throw new ApiError(
      StatusCode.FORBIDDEN,
      "You are not a member of this workspace.",
    );
  }

  const taskId = req.params.taskId as string;
  const projectId = req.params.projectId as string;

  if (!Types.ObjectId.isValid(taskId)) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid task ID.");
  }

  if (!Types.ObjectId.isValid(projectId)) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Invalid project ID.");
  }

  const task = await taskRepository.findById(
    new Types.ObjectId(taskId),
    new Types.ObjectId(projectId),
  );

  if (!task) {
    throw new ApiError(StatusCode.NOT_FOUND, "Task not found.");
  }

  const assignedUserId = task.assignedTo
    ? task.assignedTo._id.toString()
    : null;

  /*
   * Normal MEMBER can only work on a task assigned to them.
   */
  if (assignedUserId !== userId) {
    throw new ApiError(
      StatusCode.FORBIDDEN,
      "You can only modify tasks assigned to you.",
    );
  }

  next();
};

/*
 * Create task
 */
router.post(
  "/workspaces/:workspaceId/projects/:projectId/tasks",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_CREATE),
  validate(createTaskSchema),
  createTask,
);

/*
 * Workspace tasks
 */
router.get(
  "/workspaces/:workspaceId/tasks",
  authenticate,
  workspaceMiddleware,
  getWorkspaceTasks,
);

/*
 * Project tasks
 */
router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_READ),
  getTasks,
);

/*
 * Single task
 */
router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_READ),
  getTask,
);

/*
 * Edit task
 *
 * IMPORTANT:
 * This remains protected by TASK_UPDATE.
 * Normal workspace MEMBER does not get generic task-edit access.
 */
router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_UPDATE),
  validate(updateTaskSchema),
  updateTask,
);

/*
 * Change task status
 *
 * OWNER / ADMIN / PROJECT_ADMIN:
 *   can change any task.
 *
 * MEMBER:
 *   can change only tasks assigned to them.
 */
router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/status",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  authorizeTaskWork,
  validate(updateTaskStatusSchema),
  updateTaskStatus,
);

/*
 * Change task priority
 *
 * This remains a separate permission-controlled action.
 * We are NOT giving normal MEMBER generic priority-edit access
 * through this fix.
 */
router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/priority",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_CHANGE_PRIORITY),
  validate(updateTaskPrioritySchema),
  updateTaskPriority,
);

/*
 * Assign / unassign task
 *
 * Still restricted by TASK_ASSIGN.
 */
router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/assignee",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_ASSIGN),
  validate(updateTaskAssigneeSchema),
  updateTaskAssignee,
);

/*
 * Move / reorder task
 *
 * OWNER / ADMIN / PROJECT_ADMIN:
 *   can move any task.
 *
 * MEMBER:
 *   can move only tasks assigned to them.
 */
router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/position",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  authorizeTaskWork,
  validate(updateTaskPositionSchema),
  updateTaskPosition,
);

/*
 * Delete task
 */
router.delete(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_DELETE),
  deleteTask,
);

export default router;
