"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Card imports removed - using custom glass layout

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<"email" | "otp" | "success">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        console.log({ email });

        setTimeout(() => {
            setIsLoading(false);
            setStep("otp");
        }, 2000);
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsLoading(true);

        console.log({ email, otp, newPassword });

        setTimeout(() => {
            setIsLoading(false);
            setStep("success");
        }, 2000);
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
                            {step === "email" && "Reset Password"}
                            {step === "otp" && "Verify OTP"}
                            {step === "success" && "Password Reset Successful"}
                        </h2>
                        <p className="text-sm text-slate-400">
                            {step === "email" && "Enter your email address to receive a verification code"}
                            {step === "otp" && "Enter the OTP sent to your email and set a new password"}
                            {step === "success" && "Your password has been successfully reset"}
                        </p>
                    </div>
                    <div className="px-8 pb-6">
                    {step === "email" && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
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

                            <Button type="submit" className="w-full cursor-pointer h-12 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' }} disabled={isLoading}>
                                {isLoading ? "Sending OTP..." : "Send OTP"}
                            </Button>
                        </form>
                    )}

                    {step === "otp" && (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 mb-4">
                                <p className="text-sm text-emerald-400">
                                    OTP sent to <strong>{email}</strong>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-xs font-semibold tracking-wide uppercase text-slate-400">OTP Code</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-xs font-semibold tracking-wide uppercase text-slate-400">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    minLength={8}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-xs font-semibold tracking-wide uppercase text-slate-400">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    minLength={8}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" className="w-full cursor-pointer h-12 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' }} disabled={isLoading}>
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </div>

                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-sm"
                                    onClick={() => handleEmailSubmit(new Event("submit") as any)}
                                    disabled={isLoading}
                                >
                                    Resend OTP
                                </Button>
                            </div>
                        </form>
                    )}

                    {step === "success" && (
                        <div className="space-y-4">
                            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                                <p className="text-sm text-emerald-400 text-center">
                                    Your password has been successfully reset. You can now sign in with your new password.
                                </p>
                            </div>

                            <Button asChild className="w-full cursor-pointer h-12 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' }}>
                                <Link href="/auth/login">
                                    Go to Sign In
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
                <div className="px-8 pb-8 flex justify-center">
                    <p className="text-sm text-slate-500">
                        Remember your password?{" "}
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
