import Logo from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import { AdjutantNav } from "@/components/AdjutantNav";

export default function SoldierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[#020617]">

            <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-white/3 backdrop-blur-2xl">
                <div className="container flex h-16 items-center justify-between px-4">

                    <div className="flex items-center gap-2">
                        <Logo size={36} />
                        <div className="font-bold text-xl text-white tracking-wide">TROOP TRACK</div>
                        <div className="text-sm text-slate-400 hidden sm:block">
                            | Adjutant Dashboard
                        </div>
                    </div>

                    <AdjutantNav />

                    <LogoutButton />
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
