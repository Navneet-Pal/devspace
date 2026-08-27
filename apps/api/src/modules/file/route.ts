import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { projectMiddleware } from "../../middlewares/project.js";
import { projectAuthorize } from "../../middlewares/projectPermission.js";
import { upload } from "../../middlewares/upload.js";

import { PROJECT_PERMISSION } from "../../constants/projectPermission.js";

import {
  uploadProjectFile,
  getProjectFiles,
  getProjectFile,
  deleteProjectFile,
} from "./controller.js";

const router = Router();

router.post(
  "/workspaces/:workspaceId/projects/:projectId/files",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.FILE_UPLOAD),
  upload.single("file"),
  uploadProjectFile,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/files",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.FILE_READ),
  getProjectFiles,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/files/:fileId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.FILE_READ),
  getProjectFile,
);

router.delete(
  "/workspaces/:workspaceId/projects/:projectId/files/:fileId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.FILE_DELETE),
  deleteProjectFile,
);

export default router;
