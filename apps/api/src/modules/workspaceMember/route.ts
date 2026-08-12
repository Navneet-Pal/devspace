import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { workspaceMiddleware } from "../../middlewares/workspace.js";
import { authorize } from "../../middlewares/permission.js";
import { PERMISSION } from "../../constants/permission.js";
import { getWorkspaceMembers, removeMember, updateMemberRole } from "./controller.js";


const router = Router();

router.get("/workspace/:workspaceId/members",authenticate,workspaceMiddleware,authorize(PERMISSION.WORKSPACE_READ), getWorkspaceMembers);
router.patch("/workspace/:workspaceId/members/:memberId",authenticate,workspaceMiddleware,authorize(PERMISSION.MEMBER_UPDATE_ROLE) , updateMemberRole);
router.delete("/workspace/:workspaceId/members/:memberId",authenticate,workspaceMiddleware,authorize(PERMISSION.MEMBER_REMOVE), removeMember);

export default router;
