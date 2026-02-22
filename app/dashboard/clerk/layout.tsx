import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, Activity, Apple, User } from "lucide-react";
import Logo from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";

interface navitem {
    title: string;
    href: string;
    icon?: React.ReactNode;
}

export default function ClerkLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    
    const navitems: navitem[] = [
        { title: "Home", href: "/dashboard/clerk/home", icon: <Home /> },
        { title: "Profile", href: "/dashboard/clerk/profile", icon: <User /> },
        { title: "Overview", href: "/dashboard/clerk/overview", icon: <Activity /> },
        { title: "Reports", href: "/dashboard/clerk/reports", icon: <Apple /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#020617]">

            <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl">
                <div className="container flex h-16 items-center justify-between px-4">

                    <div className="flex items-center gap-2">
                        <Logo size={36} />
                        <div className="font-bold text-xl text-white tracking-wide">TROOP TRACK</div>
                        <div className="text-sm text-slate-400 hidden sm:block">
                            | Clerk Dashboard
                        </div>
                    </div>

                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            {navitems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href={item.href}>
                                            <span className="flex items-center gap-2">
                                                {item.icon}
                                                {item.title}
                                            </span>
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <LogoutButton />
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
