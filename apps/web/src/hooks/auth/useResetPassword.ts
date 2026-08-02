import { resetPasswordValues } from "@/schemas/auth";
import authService from "@/services/auth/service"
import { ResetPasswordRequest, ResetPasswordResponse } from "@/services/auth/types";
import { ApiErrorResponse } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

export const useResetPassword = ()=>{
    return useMutation< ResetPasswordResponse, AxiosError<ApiErrorResponse>, ResetPasswordRequest> ({
        mutationFn : authService.resetPassword,
    });
}