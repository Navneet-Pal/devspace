import { Request, Response } from "express";

import { AuthService } from "./service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "./validation.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { env } from "../../config/env.js";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const user = await authService.register(data);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await authService.login(data);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    user,
    accessToken,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, user } = await authService.refresh(
    req.cookies.refreshToken,
  );

  return res.status(200).json({
    success: true,
    message: "Token refreshed Successfully",
    data: {
      accessToken,
      user,
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!query) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const users = await authService.searchUsers(query, req.user._id.toString());

  return res.status(200).json({
    success: true,
    data: users,
  });
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateProfileSchema.parse(req.body);

    const user = await authService.updateProfile(req.user._id.toString(), data);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  },
);

export const updateAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authService.updateAvatar(
      req.user._id.toString(),
      req.file,
    );

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: user,
    });
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.user._id.toString());

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = forgotPasswordSchema.parse(req.body);

    await authService.forgotPassword(data);

    return res.status(200).json({
      success: true,
      message: "Password reset Email has been sent successfully",
    });
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(data);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  },
);
