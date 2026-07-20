import { Router } from "express"; 

import { workspaceController } from "./controller.js";
import { createWorkspaceSchema } from "./validation.js";
import { authenticate } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createWorkspaceSchema),
  workspaceController.createWorkspace
);

export default router;