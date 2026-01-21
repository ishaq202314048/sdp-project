import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, Activity, Apple, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

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
        <div className="min-h-screen flex flex-col">

            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">

                    <div className="flex items-center gap-2">
                        <Logo size={36} />
                        <div className="font-bold text-xl">TROOP TRACK</div>
                        <div className="text-sm text-muted-foreground hidden sm:block">
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

                    <Button variant="outline" size="sm" className="gap-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        <Link href="/auth">Logout</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
