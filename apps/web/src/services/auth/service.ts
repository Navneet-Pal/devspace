import { axiosInstance } from "@/lib/axios";

import {
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  AuthUser,
} from "./types";

import { forgotPasswordValues } from "@/schemas/auth";

class AuthService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await axiosInstance.post<RegisterResponse>(
      "/auth/register",
      data,
    );

    return response.data;
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const response = await axiosInstance.get("/auth/verify-email", {
      params: { token },
    });

    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      "auth/login",
      data,
    );

    return response.data;
  }

  async refresh(): Promise<RefreshResponse> {
    const response = await axiosInstance.post<RefreshResponse>("/auth/refresh");

    return response.data;
  }

  async logout(): Promise<LogoutResponse> {
    const response = await axiosInstance.post<LogoutResponse>("/auth/logout");

    return response.data;
  }

  async forgotPassword(
    data: forgotPasswordValues,
  ): Promise<ForgotPasswordResponse> {
    const response = await axiosInstance.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data,
    );

    return response.data;
  }

  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const response = await axiosInstance.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data,
    );

    return response.data;
  }

  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    const response = await axiosInstance.patch<UpdateProfileResponse>(
      "/auth/me",
      data,
    );

    return response.data;
  }

  async searchUsers(query: string): Promise<{
    success: boolean;
    data: AuthUser[];
  }> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: AuthUser[];
    }>("/auth/users/search", {
      params: {
        q: query,
      },
    });

    return response.data;
  }
}

const authService = new AuthService();

export default authService;
