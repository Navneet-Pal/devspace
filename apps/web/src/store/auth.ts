import { AuthUser } from "@/services/auth/types";
import {create} from "zustand";

export interface AuthState{
    user: AuthUser | null;
    accessToken : string | null;
    isAuthenticated : boolean;

    setAuth : (user: AuthUser, accessToken:string) => void;
    clearAuth : () => void;
}

export const useAuthStore = create<AuthState>( (set) => ({
    user: null,
    accessToken: null,
    isAuthenticated:false,

    setAuth : (user,accessToken) => set({
        user, accessToken, isAuthenticated : true,
    }),

    clearAuth : () => set({
        user: null, 
        accessToken: null,
        isAuthenticated : false,
    })

}));