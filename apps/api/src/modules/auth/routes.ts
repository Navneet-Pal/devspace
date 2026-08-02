import { Router } from "express";
import { forgotPassword, login, logout, me, refresh, register, resetPassword } from "./controller.js";
import { authenticate } from "../../middlewares/auth.js";


const router = Router();

router.post("/register",register);
router.post("/login",login);
router.get("/me",authenticate,me);
router.post("/logout",authenticate,logout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);
router.post("/refresh",refresh);

export default router;