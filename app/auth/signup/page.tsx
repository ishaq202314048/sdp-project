"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SignupPage() {
    const router = useRouter();
    const userType = "soldier";
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [serviceNo, setServiceNo] = useState("");
    const [unit, setUnit] = useState("");
    const [rank, setRank] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [medicalCategory, setMedicalCategory] = useState("");
    
    // Clerk fields
    const [clerkServiceNo, setClerkServiceNo] = useState("");
    const [clerkRank, setClerkRank] = useState("");
    const [clerkUnit, setClerkUnit] = useState("");
    const [clerkRole, setClerkRole] = useState("");
    const [clerkDateOfJoining, setClerkDateOfJoining] = useState("");
    const [clerkPhone, setClerkPhone] = useState("");
    const [clerkAddress, setClerkAddress] = useState("");
    const [clerkEmergencyContactName, setClerkEmergencyContactName] = useState("");
    const [clerkEmergencyContact, setClerkEmergencyContact] = useState("");
    
    // Adjutant fields
    const [adjutantServiceNo, setAdjutantServiceNo] = useState("");
    const [adjutantRank, setAdjutantRank] = useState("");
    const [adjutantUnit, setAdjutantUnit] = useState("");
    const [adjutantDateOfJoining, setAdjutantDateOfJoining] = useState("");
    const [adjutantPhone, setAdjutantPhone] = useState("");
    const [adjutantAddress, setAdjutantAddress] = useState("");
    const [adjutantEmergencyContactName, setAdjutantEmergencyContactName] = useState("");
    const [adjutantEmergencyContact, setAdjutantEmergencyContact] = useState("");
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        
        if (!passwordRegex.test(password)) {
            setError("Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&#)");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    fullName,
                    userType,
                    // Soldier fields
                    serviceNo: userType === "soldier" ? serviceNo : undefined,
                    rank: userType === "soldier" ? rank : undefined,
                    unit: userType === "soldier" ? unit : undefined,
                    dateOfBirth: userType === "soldier" ? dateOfBirth : undefined,
                    dateOfJoining: userType === "soldier" ? dateOfJoining : undefined,
                    bloodGroup: userType === "soldier" ? bloodGroup : undefined,
                    height: userType === "soldier" ? height : undefined,
                    weight: userType === "soldier" ? weight : undefined,
                    medicalCategory: userType === "soldier" ? medicalCategory : undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Signup failed. Please try again.");
                setIsLoading(false);
                return;
            }

            // If soldier account is pending adjutant approval, redirect to login with message
            if (data.pendingApproval) {
                router.push("/auth/login?pending=true");
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            const normalizedUserType = data.user.userType;
            if (normalizedUserType === "clerk") {
                router.push("/dashboard/clerk");
            } else if (normalizedUserType === "soldier") {
                router.push("/dashboard/soldier");
            } else if (normalizedUserType === "adjutant") {
                router.push("/dashboard/adjutant/home");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-950">
            
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08)_0%,_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.06)_0%,_transparent_50%)]" />
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] rounded-3xl shadow-[0_8px_60px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Shimmer accent line */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
                    
                    <div className="p-8 space-y-1 text-center">
                        <h2 className="text-2xl font-bold text-white">
                            Create an account
                        </h2>
                        <p className="text-sm text-slate-400">
                            Join TROOP TRACK to manage your fitness records
                        </p>
                    </div>
                    <div className="px-8 pb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-xs font-semibold tracking-wide uppercase text-slate-400">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase text-slate-400">Email</Label>
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

                        {userType === "soldier" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="serviceNo">Service Number</Label>
                                    <Input
                                        id="serviceNo"
                                        type="text"
                                        placeholder="Enter your service number"
                                        value={serviceNo}
                                        onChange={(e) => setServiceNo(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input
                                        id="unit"
                                        type="text"
                                        placeholder="e.g., 3rd Infantry Battalion"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateOfJoining">Date of Joining</Label>
                                    <Input
                                        id="dateOfJoining"
                                        type="date"
                                        value={dateOfJoining}
                                        onChange={(e) => setDateOfJoining(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bloodGroup">Blood Group</Label>
                                    <Select value={bloodGroup} onValueChange={setBloodGroup} disabled={isLoading} required>
                                        <SelectTrigger id="bloodGroup">
                                            <SelectValue placeholder="Select blood group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rank">Rank</Label>
                                    <Input
                                        id="rank"
                                        type="text"
                                        placeholder="e.g., Sepoy, Naib Subedar"
                                        value={rank}
                                        onChange={(e) => setRank(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="height">Height (cm)</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            placeholder="170"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            min="50"
                                            max="300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="70"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            min="20"
                                            max="200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="medicalCategory">Medical Category</Label>
                                    <Select value={medicalCategory} onValueChange={setMedicalCategory} disabled={isLoading} required>
                                        <SelectTrigger id="medicalCategory">
                                            <SelectValue placeholder="Select medical category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">A - Fit for General Service</SelectItem>
                                            <SelectItem value="B">B - Fit for Limited Service</SelectItem>
                                            <SelectItem value="C">C - Unfit for Service</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                minLength={8}
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full cursor-pointer h-12 rounded-xl text-white font-semibold text-sm tracking-wide" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' }} disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Sign up"}
                        </Button>
                    </form>
                </div>
                <div className="px-8 pb-8 flex justify-center">
                    <p className="text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
}
