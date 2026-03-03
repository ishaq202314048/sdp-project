"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Home, User, Shield, FileText } from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon?: React.ReactNode;
}

export function AdjutantNav() {
    const [hasUnacknowledgedAlerts, setHasUnacknowledgedAlerts] = useState(false);
    const pathname = usePathname();

    const navitems: NavItem[] = [
        { title: "Home", href: "/dashboard/adjutant/home", icon: <Home /> },
        { title: "Profile", href: "/dashboard/adjutant/profile", icon: <User /> },
        { title: "Soldiers", href: "/dashboard/adjutant/soldiers", icon: <Shield /> },
        { title: "Reports", href: "/dashboard/adjutant/reports", icon: <FileText /> },
    ];

    useEffect(() => {
        const checkAlerts = async () => {
            try {
                // Get user ID from localStorage
                const userStr = localStorage.getItem("user");
                if (!userStr) return;
                
                const user = JSON.parse(userStr);
                const userId = user.id;

                // Fetch unacknowledged alerts count
                const res = await fetch(`/api/unacknowledged-alerts-count?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setHasUnacknowledgedAlerts(data.count > 0);
                }
            } catch (error) {
                console.error("Failed to check alerts:", error);
            }
        };

        checkAlerts();
        
        // Check every 30 seconds for new alerts
        const interval = setInterval(checkAlerts, 30000);
        
        // Listen for custom event when alerts are acknowledged
        const handleAlertsChanged = () => {
            checkAlerts();
        };
        window.addEventListener('alertsAcknowledged', handleAlertsChanged);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('alertsAcknowledged', handleAlertsChanged);
        };
    }, [pathname]); // Re-check when pathname changes (e.g., after acknowledging on reports page)

    return (
        <NavigationMenu className="flex">
            <NavigationMenuList className="flex-wrap">
                {navitems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink asChild>
                            <Link 
                                href={item.href}
                                className="inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <span className="flex items-center gap-2 relative">
                                    {item.icon}
                                    {item.title}
                                    {/* Red dot for Reports if there are unacknowledged alerts */}
                                    {item.title === "Reports" && hasUnacknowledgedAlerts && (
                                        <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                </span>
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
