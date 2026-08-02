import authService from "@/services/auth/service";
import { LogoutResponse } from "@/services/auth/types";
import { ApiErrorResponse } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";

export const useLogout = ()=>{

    return useMutation< LogoutResponse,AxiosError<ApiErrorResponse>> ({
        mutationFn : authService.logout,
    });
};