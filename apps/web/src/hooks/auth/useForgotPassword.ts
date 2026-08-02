import { forgotPasswordValues } from "@/schemas/auth";
import authService from "@/services/auth/service";
import { ForgotPasswordResponse } from "@/services/auth/types";
import { ApiErrorResponse } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";


export const useForgotPassword =()=>{
    return useMutation<ForgotPasswordResponse,AxiosError<ApiErrorResponse>, forgotPasswordValues>({
        mutationFn : authService.forgotPassword
    });
}