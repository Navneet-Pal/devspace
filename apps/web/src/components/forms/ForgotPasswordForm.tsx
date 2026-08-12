import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label"; 
import { forgotPasswordSchema, forgotPasswordValues } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { toast } from "sonner";


export default function ForgotPasswordForm(){
    const {register ,handleSubmit, formState :{errors} } = useForm<forgotPasswordValues>({
        resolver : zodResolver(forgotPasswordSchema),
        defaultValues:{email : ""}
    });

    const {mutate, isPending} = useForgotPassword();

    function onSubmit(data : forgotPasswordValues){
        mutate(
            data,
            {
                onSuccess : (response)=>{
                    toast.success(response.message ?? "Reset Password Link has been sent to registered Email.");
                },

                onError: (error) =>{ 
                    toast.error(error.response?.data.message ?? "Something went wrong");
                }
            }
        )
    }
    return(
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type ="email"
                    placeholder="Email Address"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <Button type="submit" disabled={isPending} className="w-full h-10">
               { isPending ? "Sending..." : "Send reset link"}
            </Button>
        </form>
    );
}