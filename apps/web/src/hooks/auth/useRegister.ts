import authService from "@/services/auth/service";
import { RegisterRequest, RegisterResponse } from "@/services/auth/types";
import { ApiErrorResponse } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";


export function useRegister() {
  return useMutation<
    RegisterResponse,
    AxiosError<ApiErrorResponse>,
    RegisterRequest
  >({
    mutationFn: authService.register,
  });
}