import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export default function DashboardHeader() {
  const {mutate , isPending} = useLogout();
  const {clearAuth} = useAuthStore();
  const router = useRouter();

  const handleLogout = ()=>{
    mutate(
      undefined,
      {
        onSuccess : (response) =>{
          clearAuth();

          toast.success(response.message);
          router.replace("/login");
        },

        onError : (error) =>{
          toast.error(error.response?.data.message ?? "Logout failed");
        }
      }
  );
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <h1 className="text-lg font-semibold">
        Dashboard
      </h1>

      <div className="text-sm text-muted-foreground">
        Header Actions
      </div>

      <button onClick={handleLogout} disabled ={isPending} >Logout</button>
    </header>
  );
}

