import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { authorize } from "../../middlewares/permission.js";

import { PERMISSION } from "../../constants/permission.js";

import {
  createProject,
  getWorkspaceProjects,
  getProject,
  updateProject,
  deleteProject,
} from "./controller.js";

const router = Router();

// Create project
router.post(
  "/workspaces/:workspaceId/projects",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.PROJECT_CREATE),
  createProject,
);

// Get all projects of workspace
router.get(
  "/workspaces/:workspaceId/projects",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.PROJECT_READ),
  getWorkspaceProjects,
);

// Get single project
router.get(
  "/workspaces/:workspaceId/projects/:projectId",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.PROJECT_READ),
  getProject,
);

// Update project
router.patch(
  "/workspaces/:workspaceId/projects/:projectId",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.PROJECT_UPDATE),
  updateProject,
);

// Delete project
router.delete(
  "/workspaces/:workspaceId/projects/:projectId",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.PROJECT_DELETE),
  deleteProject,
);

export default router;
