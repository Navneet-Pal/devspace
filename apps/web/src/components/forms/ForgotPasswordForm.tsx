import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label"; 
import { forgotPasswordSchema, forgotPasswordValues } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";


export default function ForgotPasswordForm(){
    const {register ,handleSubmit, formState :{errors} } = useForm<forgotPasswordValues>({
        resolver : zodResolver(forgotPasswordSchema),
        defaultValues:{email : ""}
    });

    async function onSubmit(data : forgotPasswordValues){
        console.log(data);
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

            <Button type="submit" className="w-full h-10">
                Send reset link
            </Button>
        </form>
    );
}