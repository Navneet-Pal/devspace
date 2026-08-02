import authService from "@/services/auth/service";
import { LoginRequest, LoginResponse } from "@/services/auth/types"
import { ApiErrorResponse } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";


export const useLogin = () => {

    return useMutation<LoginResponse,AxiosError<ApiErrorResponse>,LoginRequest>({
        mutationFn : authService.login,
    });
}