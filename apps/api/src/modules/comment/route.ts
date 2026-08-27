import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { projectMiddleware } from "../../middlewares/project.js";
import { projectAuthorize } from "../../middlewares/projectPermission.js";
import { validate } from "../../middlewares/validate.js";

import { PROJECT_PERMISSION } from "../../constants/projectPermission.js";

import { createCommentSchema, updateCommentSchema } from "./validation.js";

import {
  createProjectComment,
  createTaskComment,
  deleteComment,
  getProjectComments,
  getTaskComments,
  updateComment,
} from "./controller.js";

const router = Router();

/*
 * Project comments
 */

router.post(
  "/workspaces/:workspaceId/projects/:projectId/comments",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.COMMENT_CREATE),
  validate(createCommentSchema),
  createProjectComment,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/comments",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.MEMBER_READ),
  getProjectComments,
);

/*
 * Task comments
 */

router.post(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.COMMENT_CREATE),
  validate(createCommentSchema),
  createTaskComment,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.TASK_READ),
  getTaskComments,
);

/*
 * Update / Delete
 */

router.patch(
  "/workspaces/:workspaceId/projects/:projectId/comments/:commentId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.COMMENT_UPDATE),
  validate(updateCommentSchema),
  updateComment,
);

router.delete(
  "/workspaces/:workspaceId/projects/:projectId/comments/:commentId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.COMMENT_DELETE),
  deleteComment,
);

export default router;
