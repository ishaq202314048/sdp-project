"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";

export default function LoginPage() {
    const router = useRouter();
    const [userType, setUserType] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");    const [isLoading, setIsLoading] = useState(false);

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
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            {/* Brand bar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3 text-white">
                <Logo size={36} />
                <span className="font-bold text-xl tracking-wide">TROOP TRACK</span>
            </div>
            
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/auth-background.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>
            
            <Card className="w-full max-w-md relative z-10 shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        <span className="inline-flex items-center justify-center gap-3">
                            <Logo size={40} />
                            <span>TROOP TRACK</span>
                        </span>
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userType">User Type</Label>
                            <Select value={userType} onValueChange={setUserType} disabled={isLoading} required>
                                <SelectTrigger id="userType">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="clerk">Clerk</SelectItem>
                                    <SelectItem value="soldier">Soldiers</SelectItem>
                                    <SelectItem value="adjutant">Adjutant</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end items-center">
                            <Link
                                href="/auth/forgot_password"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
