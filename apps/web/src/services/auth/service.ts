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
    const response = await axiosInstance.post("auth/login", data);

    return response.data;
  }

  async refresh(): Promise<RefreshResponse> {
    const response = await axiosInstance.post("/auth/refresh");

    return response.data;
  }

  async logout():Promise<LogoutResponse >{
    const response = await axiosInstance.post("/auth/logout");

    return response.data;
  }

  async forgotPassword(data: forgotPasswordValues):Promise<ForgotPasswordResponse>{
    const response = await axiosInstance.post("/auth/forgot-password",data);

    return response.data;
  }

  async resetPassword(data:ResetPasswordRequest) : Promise<ResetPasswordResponse>{
    const response = await axiosInstance.post("/auth/reset-password" , data);

    return response.data;
  }
}

const authService = new AuthService();

export default authService;
