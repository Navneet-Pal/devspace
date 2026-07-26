
export interface RegisterRequest{
    name: string;
    email:string;
    password:string;
}

export interface User{
    _id:string;
    name:string;
    email:string;
    avatar:string;
    isVerified:boolean;
}

export interface ApiResponse<T>{
    success:boolean;
    message:string;
    data:T;
}

export type RegisterResponse = ApiResponse<User>;