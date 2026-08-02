import authService from "@/services/auth/service";
import { VerifyEmailResponse } from "@/services/auth/types";
import { ApiErrorResponse } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";


export function useVerifyEmail(){

    return useMutation<VerifyEmailResponse,AxiosError<ApiErrorResponse>,string >({
        mutationFn : authService.verifyEmail,
    });
}