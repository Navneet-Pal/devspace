import { RegisterRequest, RegisterResponse } from "@/services/auth/types";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/auth/service"

export function useRegister(){
    return useMutation<RegisterResponse,Error,RegisterRequest>({
        mutationFn : async (data) =>{
            const response  = await authService.register(data);
            return response.data;
        },
    });
}