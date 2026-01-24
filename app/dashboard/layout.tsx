"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Keep it simple: send them to login if they're not signed in.
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);

  return <>{children}</>;
}
