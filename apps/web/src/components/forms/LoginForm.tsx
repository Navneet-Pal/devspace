"use client";

import { LoginFormValues, loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/useLogin";
import { toast } from "sonner"; 
import { useAuthStore } from "@/store/auth";

export default function LoginForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();
  const {mutate, isPending} = useLogin();
  const {setAuth}  = useAuthStore();

  async function onSubmit(data: LoginFormValues) {
    
    mutate( data, {
      onSuccess : (response)=>{
        toast.success(response.message);
        setAuth(response.user,response.accessToken);
        router.push("/dashboard");
      },

      onError : (error) =>{ 

        setError("email", {
          type: "manual",
          message: error.response?.data.message ?? "Invalid email or password",
        });

        toast.error(
          error.response?.data.message ?? "Invalid email or password",
        );

      }
    });
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-sm text-red-500 ">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="rememberMe" className="cursor-pointer">
                Remember me
              </Label>
            </div>
          )}
        />

        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "SigningIn...." : "Sign In"}
      </Button>
    </form>
  );
}
