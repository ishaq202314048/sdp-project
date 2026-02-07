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
      className="gap-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
