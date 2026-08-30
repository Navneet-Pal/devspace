import { Router } from "express";

import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword,
  searchUsers,
  updateAvatar,
  updateProfile,
} from "./controller.js";

import { authenticate } from "../../middlewares/auth.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, me);

router.patch("/me", authenticate, updateProfile);

router.patch("/avatar", authenticate, upload.single("avatar"), updateAvatar);

router.post("/logout", authenticate, logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/refresh", refresh);
router.get("/users/search", authenticate, searchUsers);

export default router;
