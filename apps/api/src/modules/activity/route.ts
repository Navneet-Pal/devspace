import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { projectMiddleware } from "../../middlewares/project.js";
import { projectAuthorize } from "../../middlewares/projectPermission.js";

import { PROJECT_PERMISSION } from "../../constants/projectPermission.js";

import { getProjectActivity, getTaskActivity } from "./controller.js";

const router = Router();

router.get(
  "/workspaces/:workspaceId/projects/:projectId/activity",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.ACTIVITY_READ),
  getProjectActivity,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/activity",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.ACTIVITY_READ),
  getTaskActivity,
);

export default router;
