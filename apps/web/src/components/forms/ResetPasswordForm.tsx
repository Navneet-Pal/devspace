import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { resetPasswordSchema, resetPasswordValues } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/Button";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";


export default function ResetPasswordForm(){
    const {register,handleSubmit, formState:{errors}} = useForm<resetPasswordValues>({
        resolver : zodResolver(resetPasswordSchema),
        defaultValues: {
            password:"",
            confirmPassword:""
        }
    });

    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {mutate,isPending} = useResetPassword();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    function onSubmit(data:resetPasswordValues){

        if(!token) {
            toast.error("Invalid reset link");
            return;
        }

        mutate(
            {
                token,
                password: data.password,
            },
            {
                onSuccess:(response)=>{
                    toast.success(response.message);
                    router.replace("/login");
                },

                onError:(error)=>{
                    toast.error( error.response?.data.message ?? "Something went wrong");
                }
            }
        )
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" >
            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                    <Input
                    id="password"
                    type = {showPassword ? "text" : "password"}
                    placeholder ="New Password"
                    {...register("password")}
                />
                <button type="button" onClick={()=> setShowPassword(!showPassword)} className="absolute top-0.5 right-2 h-5 w-5 cursor-pointer">
                    {showPassword ? <EyeOff/> : <Eye/> }
                </button>
                
                </div>

                {
                    errors.password &&(
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )
                }
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                    <Input
                    id="confirmPassword"
                    type = {showConfirmPassword ? "text" : "password"}
                    placeholder ="Confirm New Password"
                    {...register("confirmPassword")}
                />
                <button type="button" onClick={()=> setShowConfirmPassword(!showConfirmPassword)} className="absolute top-0.5 right-2 h-5 w-5 cursor-pointer">
                    {showConfirmPassword ? <EyeOff/> : <Eye/> }
                </button>
                
                </div>

                {
                    errors.confirmPassword &&(
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )
                }
            </div>

                <Button type="submit" disabled={isPending} className="w-full" >
                   { isPending ? "Resetting..." : "Reset Password"}
                </Button>

        </form>
    );
}