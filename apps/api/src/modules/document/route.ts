import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { projectMiddleware } from "../../middlewares/project.js";
import { projectAuthorize } from "../../middlewares/projectPermission.js";

import { PROJECT_PERMISSION } from "../../constants/projectPermission.js";

import { createDocumentSchema, updateDocumentSchema } from "./validation.js";

import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from "./controller.js";

import { validate } from "../../middlewares/validate.js";

const router = Router();

router.post(
  "/workspaces/:workspaceId/projects/:projectId/documents",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.DOCUMENT_CREATE),
  validate(createDocumentSchema),
  createDocument,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/documents",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.DOCUMENT_READ),
  getDocuments,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/documents/:documentId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.DOCUMENT_READ),
  getDocument,
);

router.patch(
  "/workspaces/:workspaceId/projects/:projectId/documents/:documentId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.DOCUMENT_UPDATE),
  validate(updateDocumentSchema),
  updateDocument,
);

router.delete(
  "/workspaces/:workspaceId/projects/:projectId/documents/:documentId",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  projectAuthorize(PROJECT_PERMISSION.DOCUMENT_DELETE),
  deleteDocument,
);

export default router;
