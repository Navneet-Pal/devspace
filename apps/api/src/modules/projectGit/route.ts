import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { projectMiddleware } from "../../middlewares/project.js";

import {
  getProjectGit,
  createGitHubInstallUrl,
  githubSetup,
  githubWebhook,
  getRepositories,
  connectRepository,
  disconnectGitHub,
  getBranches,
  getCommits,
  getPullRequests,
} from "./controller.js";

const router = Router();

/*
 * GitHub setup callback.
 *
 * IMPORTANT:
 * This route intentionally does NOT use authenticate.
 * GitHub redirects the browser here after installation.
 *
 * Security is provided by the one-time state stored in MongoDB.
 */
router.get("/project-git/github/setup", githubSetup);

/*
 * GitHub webhook.
 *
 * IMPORTANT:
 * This route intentionally does NOT use authenticate.
 * GitHub sends webhook requests directly to this endpoint.
 *
 * Webhook authentication/signature verification is handled
 * inside the webhook controller.
 */
router.post("/project-git/github/webhook", githubWebhook);

/*
 * Everything below this point belongs to an
 * authenticated DevSpace project.
 */

router.get(
  "/workspaces/:workspaceId/projects/:projectId/git",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  getProjectGit,
);

router.post(
  "/workspaces/:workspaceId/projects/:projectId/git/github/install",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  createGitHubInstallUrl,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/git/github/repositories",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  getRepositories,
);

router.post(
  "/workspaces/:workspaceId/projects/:projectId/git/github/repository",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  connectRepository,
);

router.delete(
  "/workspaces/:workspaceId/projects/:projectId/git",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  disconnectGitHub,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/git/branches",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  getBranches,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/git/commits",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  getCommits,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/git/pull-requests",
  authenticate,
  workspaceMiddleware,
  projectMiddleware,
  getPullRequests,
);

export default router;
