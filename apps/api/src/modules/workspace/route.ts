import { Router } from "express";

import {
  createWorkspace,
  getWorkspace,
  getMyWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  updateWorkspaceLogo,
} from "./controller.js";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { authorize } from "../../middlewares/authorize.js";

import { PERMISSION } from "../../constants/permission.js";

import { upload } from "../../middlewares/upload.js";

const router = Router();

/*
 * Create workspace
 *
 * Authenticated users can create a workspace.
 * The creator becomes the OWNER.
 */
router.post("/", authenticate, createWorkspace);

/*
 * Get all workspaces for current user
 *
 * Includes workspaces where the user is:
 * - OWNER
 * - ADMIN
 * - MEMBER
 */
router.get("/me", authenticate, getMyWorkspaces);

/*
 * Get single workspace
 *
 * Requires:
 * - authenticated user
 * - workspace membership
 * - WORKSPACE_READ permission
 */
router.get(
  "/:workspaceId",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.WORKSPACE_READ),
  getWorkspace,
);

/*
 * Update workspace settings
 *
 * Used by Workspace Settings for:
 * - workspace name
 * - workspace description
 * - other editable workspace fields
 *
 * Owner/Admin are allowed according to the
 * existing workspace permission system.
 * Members are denied by backend authorization.
 */
router.patch(
  "/:workspaceId",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.WORKSPACE_UPDATE),
  updateWorkspace,
);

/*
 * Delete / soft-delete workspace
 *
 * This is a workspace-level destructive action.
 * Backend authorization decides whether the current
 * workspace role is allowed to perform it.
 */
router.delete(
  "/:workspaceId",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.WORKSPACE_DELETE),
  deleteWorkspace,
);

/*
 * Update workspace logo
 *
 * Requires WORKSPACE_UPDATE permission.
 * Multer processes the uploaded file before the
 * controller receives req.file.
 */
router.patch(
  "/:workspaceId/logo",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.WORKSPACE_UPDATE),
  upload.single("logo"),
  updateWorkspaceLogo,
);

export default router;
