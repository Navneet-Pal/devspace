import { useMutation } from "@tanstack/react-query";

import authService from "@/services/auth/service";
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/services/auth/types";
import type { ApiErrorResponse } from "@/types/apiTypes";

import { AxiosError } from "axios";

export const useUpdateProfile = () => {
  return useMutation<
    UpdateProfileResponse,
    AxiosError<ApiErrorResponse>,
    UpdateProfileRequest
  >({
    mutationFn: (data) => authService.updateProfile(data),
  });
};
