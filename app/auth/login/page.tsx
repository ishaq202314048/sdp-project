"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";
import { Shield, Eye, EyeOff } from "lucide-react";

const particles = [
    { left: "8%", top: "12%", delay: "0s", dur: "3s" },
    { left: "22%", top: "28%", delay: "0.4s", dur: "4s" },
    { left: "50%", top: "8%", delay: "0.9s", dur: "2.5s" },
    { left: "72%", top: "22%", delay: "1.4s", dur: "3.5s" },
    { left: "88%", top: "42%", delay: "0.2s", dur: "4.5s" },
    { left: "12%", top: "55%", delay: "1.8s", dur: "3s" },
    { left: "58%", top: "65%", delay: "0.7s", dur: "2s" },
    { left: "82%", top: "75%", delay: "1.1s", dur: "3.8s" },
    { left: "32%", top: "82%", delay: "0.5s", dur: "4.2s" },
    { left: "65%", top: "48%", delay: "1.6s", dur: "2.8s" },
    { left: "42%", top: "38%", delay: "2.2s", dur: "3.2s" },
    { left: "92%", top: "12%", delay: "0.1s", dur: "4s" },
];

function LoginWelcome({ onFinish }: { onFinish: () => void }) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 500),
            setTimeout(() => setPhase(2), 1200),
            setTimeout(() => setPhase(3), 2000),
            setTimeout(() => setPhase(4), 3200),
            setTimeout(() => onFinish(), 3900),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-600 ${phase >= 4 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-emerald-500/30 animate-pulse"
                        style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.dur }}
                    />
                ))}
            </div>

            {/* Logo */}
            <div className={`relative transition-all duration-600 ease-out ${phase >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                <div className="relative">
                    <div className={`absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl transition-all duration-800 ${phase >= 1 ? "scale-110 opacity-100" : "scale-75 opacity-0"}`} />
                    <Logo size={90} />
                </div>
            </div>

            {/* Title */}
            <div className={`mt-6 transition-all duration-600 ease-out ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                <h1 className="text-4xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-green-300 to-emerald-500">
                    TROOP TRACK
                </h1>
            </div>

            {/* Welcome message */}
            <div className={`mt-4 transition-all duration-600 ease-out ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                <p className="text-lg md:text-xl text-slate-400 tracking-[0.2em] uppercase font-light">
                    Welcome Back, Soldier
                </p>
            </div>

            {/* Loading indicator */}
            <div className={`mt-10 transition-all duration-600 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}>
                <div className="flex gap-1.5 justify-center">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="w-8 h-1 rounded-full bg-emerald-500/80"
                            style={{ animation: "pulse 1s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
                <p className="text-center text-xs text-slate-500 mt-3 tracking-widest uppercase">
                    Preparing Login
                </p>
            </div>

            {/* Bottom badge */}
            <div className={`absolute bottom-10 transition-all duration-600 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
                <div className="flex items-center gap-2 text-slate-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs tracking-[0.2em] uppercase">Secure Authentication</span>
                    <Shield className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showWelcome, setShowWelcome] = useState(true);
    const handleWelcomeFinish = useCallback(() => setShowWelcome(false), []);
    const [userType, setUserType] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");    const [isLoading, setIsLoading] = useState(false);
    const pendingApproval = searchParams.get("pending") === "true";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, userType }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error || "Login failed. Please try again.");
                return;
            }

            // store auth in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            const role = data.user?.userType;
            if (role === "clerk") {
                router.push("/dashboard/clerk");
            } else if (role === "soldier") {
                router.push("/dashboard/soldier");
            } else if (role === "adjutant") {
                router.push("/dashboard/adjutant/home");
            } else {
                router.push("/dashboard/soldier");
            }
        } catch (err) {
            setError("Something went wrong. Check your internet and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {showWelcome && <LoginWelcome onFinish={handleWelcomeFinish} />}
            <div className={`min-h-screen flex items-center justify-center p-4 relative transition-opacity duration-500 ${showWelcome ? "opacity-0" : "opacity-100"}`}>
            {/* Brand bar */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] shadow-lg shadow-black/20">
                    <Logo size={72} />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-sm tracking-[0.2em] text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-green-200">
                        TROOP TRACK
                    </span>
                    <span className="text-[9px] tracking-[0.15em] text-slate-500 uppercase font-medium">Military Fitness System</span>
                </div>
            </div>
            
            {/* Dynamic animated background */}
            <div className="absolute inset-0 bg-slate-950 overflow-hidden">
                {/* Animated gradient layers */}
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        background: "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(139,92,246,0.08) 0%, transparent 50%)",
                        animation: "bgShift 12s ease-in-out infinite alternate",
                    }}
                />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Floating orbs */}
                <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" style={{ top: "10%", left: "5%", animation: "float1 15s ease-in-out infinite" }} />
                <div className="absolute w-96 h-96 rounded-full bg-blue-500/8 blur-3xl" style={{ top: "50%", right: "0%", animation: "float2 18s ease-in-out infinite" }} />
                <div className="absolute w-64 h-64 rounded-full bg-purple-500/8 blur-3xl" style={{ bottom: "5%", left: "30%", animation: "float3 13s ease-in-out infinite" }} />

                {/* Moving diagonal lines */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(16,185,129,0.3) 40px, rgba(16,185,129,0.3) 41px)",
                    animation: "slideLines 20s linear infinite",
                }} />

                {/* Floating particles */}
                {[
                    { left: "10%", top: "20%", size: "3px", delay: "0s", dur: "6s" },
                    { left: "25%", top: "60%", size: "2px", delay: "1s", dur: "8s" },
                    { left: "40%", top: "15%", size: "4px", delay: "2s", dur: "7s" },
                    { left: "55%", top: "75%", size: "2px", delay: "0.5s", dur: "9s" },
                    { left: "70%", top: "35%", size: "3px", delay: "1.5s", dur: "6.5s" },
                    { left: "85%", top: "55%", size: "2px", delay: "3s", dur: "7.5s" },
                    { left: "15%", top: "85%", size: "3px", delay: "2.5s", dur: "8.5s" },
                    { left: "60%", top: "10%", size: "2px", delay: "0.8s", dur: "6s" },
                    { left: "90%", top: "80%", size: "4px", delay: "1.2s", dur: "7s" },
                    { left: "35%", top: "45%", size: "2px", delay: "3.5s", dur: "9s" },
                ].map((p, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-emerald-400/40"
                        style={{
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            animation: `floatParticle ${p.dur} ease-in-out infinite`,
                            animationDelay: p.delay,
                        }}
                    />
                ))}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* CSS animations */}
                <style>{`
                    @keyframes bgShift {
                        0% { transform: scale(1) rotate(0deg); }
                        100% { transform: scale(1.1) rotate(3deg); }
                    }
                    @keyframes float1 {
                        0%, 100% { transform: translate(0, 0); }
                        33% { transform: translate(30px, -40px); }
                        66% { transform: translate(-20px, 20px); }
                    }
                    @keyframes float2 {
                        0%, 100% { transform: translate(0, 0); }
                        33% { transform: translate(-40px, 30px); }
                        66% { transform: translate(20px, -30px); }
                    }
                    @keyframes float3 {
                        0%, 100% { transform: translate(0, 0); }
                        50% { transform: translate(40px, -20px); }
                    }
                    @keyframes slideLines {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(80px); }
                    }
                    @keyframes floatParticle {
                        0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
                        50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
                    }
                    @keyframes shimmer {
                        0%, 100% { opacity: 0.6; }
                        50% { opacity: 1; }
                    }
                `}</style>
            </div>
            
            <Card className="w-full max-w-[420px] relative z-10 bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] rounded-3xl overflow-hidden shadow-[0_8px_60px_-10px_rgba(0,0,0,0.5)]">
                {/* Animated top accent */}
                <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent 0%, #34d399 20%, #6ee7b7 50%, #34d399 80%, transparent 100%)", animation: "shimmer 3s ease-in-out infinite" }} />

                <CardHeader className="space-y-4 pt-10 pb-2 px-8">
                    <CardTitle className="text-2xl font-bold text-center">
                        <span className="inline-flex flex-col items-center gap-4">
                            {/* Premium logo container */}
                            <div className="relative group">
                                <div className="absolute -inset-3 rounded-full bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all duration-500" />
                                <div className="relative p-4 rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
                                    <Logo size={72} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-2xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-linear-to-r from-emerald-300 via-green-200 to-emerald-400">
                                    TROOP TRACK
                                </span>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-px w-8 bg-linear-to-r from-transparent to-emerald-500/50" />
                                    <span className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-medium">Secure Portal</span>
                                    <div className="h-px w-8 bg-linear-to-l from-transparent to-emerald-500/50" />
                                </div>
                            </div>
                        </span>
                    </CardTitle>
                    <CardDescription className="text-center text-sm text-slate-400">
                        Sign in to your account
                    </CardDescription>
                    {pendingApproval && (
                        <div className="mx-0 mt-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-center">
                            <p className="text-sm font-medium text-amber-400">⏳ Account Pending Approval</p>
                            <p className="text-xs text-amber-400/70 mt-1">Your account has been created. Please wait for the Adjutant to approve it before you can log in.</p>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="px-8 pb-2">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase text-slate-400">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 focus:bg-white/[0.08] transition-all duration-300 pl-4"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase text-slate-400">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 focus:bg-white/[0.08] transition-all duration-300 pl-4 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userType" className="text-xs font-semibold tracking-wide uppercase text-slate-400">Role</Label>
                            <Select value={userType} onValueChange={setUserType} disabled={isLoading} required>
                                <SelectTrigger id="userType" className="h-12 rounded-xl bg-white/5 border-white/10 text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 transition-all duration-300">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="clerk">Clerk</SelectItem>
                                    <SelectItem value="soldier">Soldier</SelectItem>
                                    <SelectItem value="adjutant">Adjutant</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end items-center pt-1">
                            <Link
                                href="/auth/forgot_password"
                                className="text-xs text-emerald-400/80 hover:text-emerald-300 transition-colors font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 cursor-pointer rounded-xl font-bold tracking-wide text-sm transition-all duration-300 relative overflow-hidden group"
                            disabled={isLoading}
                            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)" }}
                        >
                            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                            <span className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] rounded-xl" />
                            <span className="relative">{isLoading ? "Signing in..." : "Sign In"}</span>
                        </Button>
                    </form>
                </CardContent>

                {/* Divider */}
                <div className="px-8 py-4">
                    <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <CardFooter className="flex justify-center pb-8 pt-0">
                    <p className="text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>

            {/* Card glow effect behind */}
            <div className="absolute z-[5] w-[420px] h-[500px] rounded-3xl bg-emerald-500/5 blur-3xl pointer-events-none" />
        </div>
        </>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
