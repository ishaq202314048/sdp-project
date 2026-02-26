"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication data from localStorage
    clearAuth();
    
    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2 border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/60 cursor-pointer rounded-xl backdrop-blur-sm"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
