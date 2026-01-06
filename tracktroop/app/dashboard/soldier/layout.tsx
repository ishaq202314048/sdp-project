import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, Activity, Apple, User, TrendingUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface navitem {
    title: string;
    href: string;
    icon?: React.ReactNode;
}

export default function SoldierLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    const navitems: navitem[] = [
        { title: "Home", href: "/dashboard/soldier/home", icon: <Home /> },
        { title: "Profile", href: "/dashboard/soldier/profile", icon: <User /> },
        { title: "Fitness", href: "/dashboard/soldier/fitness", icon: <Activity /> },
        { title: "Progress", href: "/dashboard/soldier/progress", icon: <TrendingUp /> },
    ];

    return (
        <div className="min-h-screen flex flex-col">

            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">

                    <div className="flex items-center gap-2">
                        <div className="font-bold text-xl">TROOP TRACK</div>
                        <div className="text-sm text-muted-foreground hidden sm:block">
                            | Soldier Dashboard
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

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
