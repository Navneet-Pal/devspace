import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { projectMiddleware } from "../../middlewares/project.js";
import { projectAuthorize } from "../../middlewares/projectPermission.js";

import { PROJECT_PERMISSION } from "../../constants/projectPermission.js";

import {
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
} from "./controller.js";

const router = Router();

/**
 * Get all members of a project
 */
router.get(
  "/workspaces/:workspaceId/projects/:projectId/members",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.MEMBER_READ),
  getProjectMembers,
);

/**
 * Add member to project
 */
router.post(
  "/workspaces/:workspaceId/projects/:projectId/members",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.MEMBER_ADD),
  addProjectMember,
);

/**
 * Update project member role
 */
router.patch(
  "/workspaces/:workspaceId/projects/:projectId/members/:memberId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.MEMBER_UPDATE_ROLE),
  updateProjectMemberRole,
);

/**
 * Remove member from project
 */
router.delete(
  "/workspaces/:workspaceId/projects/:projectId/members/:memberId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.MEMBER_REMOVE),
  removeProjectMember,
);

export default router;
