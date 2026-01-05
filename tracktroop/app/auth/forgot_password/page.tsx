"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="min-h-screen flex items-center justify-center p-4 relative">
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
                        {step === "email" && "Reset Password"}
                        {step === "otp" && "Verify OTP"}
                        {step === "success" && "Password Reset Successful"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === "email" && "Enter your email address to receive a verification code"}
                        {step === "otp" && "Enter the OTP sent to your email and set a new password"}
                        {step === "success" && "Your password has been successfully reset"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "email" && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
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

                            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                                {isLoading ? "Sending OTP..." : "Send OTP"}
                            </Button>
                        </form>
                    )}

                    {step === "otp" && (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800 mb-4">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    OTP sent to <strong>{email}</strong>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="otp">OTP Code</Label>
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
                                <Label htmlFor="newPassword">New Password</Label>
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
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
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
                            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 border border-emerald-200 dark:border-emerald-800">
                                <p className="text-sm text-emerald-800 dark:text-emerald-200 text-center">
                                    Your password has been successfully reset. You can now sign in with your new password.
                                </p>
                            </div>

                            <Button asChild className="w-full cursor-pointer">
                                <Link href="/auth/login">
                                    Go to Sign In
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
