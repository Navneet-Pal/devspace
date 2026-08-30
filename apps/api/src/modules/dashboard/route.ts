import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";

import { getDashboard } from "./controller.js";

const router = Router();

router.get("/dashboard", authenticate, getDashboard);

export default router;
