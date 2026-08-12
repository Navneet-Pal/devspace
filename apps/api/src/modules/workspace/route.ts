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

router.post("/", authenticate, createWorkspace);

router.get("/me", authenticate, getMyWorkspaces);

router.get("/:workspaceId", authenticate, workspaceMiddleware, authorize(PERMISSION.WORKSPACE_READ), getWorkspace);

router.patch("/:workspaceId", authenticate, workspaceMiddleware, authorize(PERMISSION.WORKSPACE_UPDATE) ,updateWorkspace);

router.delete("/:workspaceId", authenticate, workspaceMiddleware, authorize(PERMISSION.WORKSPACE_DELETE), deleteWorkspace);

router.patch("/:workspaceId/logo" , authenticate, workspaceMiddleware, authorize(PERMISSION.WORKSPACE_UPDATE) , upload.single("logo"), updateWorkspaceLogo)

export default router;