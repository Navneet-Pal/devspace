import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import authService from "@/services/auth/service";
import type { UpdateAvatarResponse } from "@/services/auth/types";
import type { ApiErrorResponse } from "@/types/apiTypes";

export const useUpdateAvatar = () => {
  return useMutation<UpdateAvatarResponse, AxiosError<ApiErrorResponse>, File>({
    mutationFn: (file) => authService.updateAvatar(file),
  });
};
