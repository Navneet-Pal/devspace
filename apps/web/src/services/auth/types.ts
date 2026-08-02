import { ApiResponse } from "@/types/apiTypes";


export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  isVerified: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export type RegisterResponse = ApiResponse<User>;

export interface VerifyEmailResponse{
  success : boolean;
  message : string;
}

export interface LoginRequest{
  email : string;
  password : string;
}

export interface AuthUser{
  _id : string;
  name : string;
  email : string;
  avatar?: string;
  isVerified : boolean;
}

export interface LoginResponse{
  success : boolean;
  message : string;
  user: AuthUser;
  accessToken : string;
}

export interface RefreshData {
  user: AuthUser;
  accessToken: string;
}

export type RefreshResponse = ApiResponse<RefreshData>;
export type LogoutResponse = ApiResponse<null>;

export type  ForgotPasswordResponse = ApiResponse<null>;
export type ResetPasswordResponse = ApiResponse<null>;

export interface ResetPasswordRequest{
  token : string;
  password : string;
}