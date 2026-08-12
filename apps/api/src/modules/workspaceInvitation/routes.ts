import { Router } from "express";

import {
  inviteMember,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getWorkspaceInvitations,
  getMyInvitations,
} from "./controller.js";

import { PERMISSION } from "../../constants/permission.js";
import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { authorize } from "../../middlewares/permission.js";

const router = Router();

router.post(
  "/workspaces/:workspaceId/invitations",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.MEMBER_INVITE),
  inviteMember,
);

router.get(
  "/workspaces/:workspaceId/invitations",
  authenticate,
  workspaceMiddleware,
  authorize(PERMISSION.MEMBER_INVITE),
  getWorkspaceInvitations,
);

router.get("/invitations/me", authenticate, getMyInvitations);

router.patch(
  "/invitations/:invitationId/accept",
  authenticate,
  acceptInvitation,
);

router.delete(
  "/invitations/:invitationId/reject",
  authenticate,
  rejectInvitation,
);

router.delete(
  "/invitations/:invitationId/cancel",
  authenticate,
  cancelInvitation,
);

export default router;
