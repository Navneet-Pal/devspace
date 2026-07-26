import axiosInstance from "@/lib/axios";
import { RegisterRequest, RegisterResponse } from "./types";


class AuthService {
    register(data:RegisterRequest){
        return axiosInstance.post<RegisterResponse>(
            "/auth/register",
            data
        );
    }
}

export default new AuthService();