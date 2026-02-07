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
    const [userType, setUserType] = useState("");
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
                    // Clerk fields
                    clerkServiceNo: userType === "clerk" ? clerkServiceNo : undefined,
                    clerkRank: userType === "clerk" ? clerkRank : undefined,
                    clerkUnit: userType === "clerk" ? clerkUnit : undefined,
                    clerkRole: userType === "clerk" ? clerkRole : undefined,
                    clerkDateOfJoining: userType === "clerk" ? clerkDateOfJoining : undefined,
                    clerkPhone: userType === "clerk" ? clerkPhone : undefined,
                    clerkAddress: userType === "clerk" ? clerkAddress : undefined,
                    clerkEmergencyContactName: userType === "clerk" ? clerkEmergencyContactName : undefined,
                    clerkEmergencyContact: userType === "clerk" ? clerkEmergencyContact : undefined,
                    // Adjutant fields
                    adjutantServiceNo: userType === "adjutant" ? adjutantServiceNo : undefined,
                    adjutantRank: userType === "adjutant" ? adjutantRank : undefined,
                    adjutantUnit: userType === "adjutant" ? adjutantUnit : undefined,
                    adjutantDateOfJoining: userType === "adjutant" ? adjutantDateOfJoining : undefined,
                    adjutantPhone: userType === "adjutant" ? adjutantPhone : undefined,
                    adjutantAddress: userType === "adjutant" ? adjutantAddress : undefined,
                    adjutantEmergencyContactName: userType === "adjutant" ? adjutantEmergencyContactName : undefined,
                    adjutantEmergencyContact: userType === "adjutant" ? adjutantEmergencyContact : undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Signup failed. Please try again.");
                setIsLoading(false);
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
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Join TROOP TRACK to manage your fitness records
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
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
                            <Label htmlFor="userType">User Type</Label>
                            <Select value={userType} onValueChange={setUserType} disabled={isLoading} required>
                                <SelectTrigger id="userType">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="soldier">Soldier</SelectItem>
                                    <SelectItem value="clerk">Clerk</SelectItem>
                                    <SelectItem value="adjutant">Adjutant</SelectItem>
                                </SelectContent>
                            </Select>
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

                        {userType === "clerk" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="clerkServiceNo">Service Number</Label>
                                    <Input
                                        id="clerkServiceNo"
                                        type="text"
                                        placeholder="e.g., BA-1001"
                                        value={clerkServiceNo}
                                        onChange={(e) => setClerkServiceNo(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clerkRank">Rank</Label>
                                    <Input
                                        id="clerkRank"
                                        type="text"
                                        placeholder="e.g., Corporal, Lance Naib"
                                        value={clerkRank}
                                        onChange={(e) => setClerkRank(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clerkUnit">Unit</Label>
                                    <Input
                                        id="clerkUnit"
                                        type="text"
                                        placeholder="e.g., Headquarters, Dhaka"
                                        value={clerkUnit}
                                        onChange={(e) => setClerkUnit(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clerkRole">Role/Position</Label>
                                    <Input
                                        id="clerkRole"
                                        type="text"
                                        placeholder="e.g., Administrative Officer"
                                        value={clerkRole}
                                        onChange={(e) => setClerkRole(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clerkDateOfJoining">Date of Joining</Label>
                                    <Input
                                        id="clerkDateOfJoining"
                                        type="date"
                                        value={clerkDateOfJoining}
                                        onChange={(e) => setClerkDateOfJoining(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clerkPhone">Phone Number</Label>
                                    <Input
                                        id="clerkPhone"
                                        type="tel"
                                        placeholder="+880-1700-000000"
                                        value={clerkPhone}
                                        onChange={(e) => setClerkPhone(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clerkAddress">Address</Label>
                                    <Input
                                        id="clerkAddress"
                                        type="text"
                                        placeholder="Your address"
                                        value={clerkAddress}
                                        onChange={(e) => setClerkAddress(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clerkEmergencyContactName">Emergency Contact Name</Label>
                                    <Input
                                        id="clerkEmergencyContactName"
                                        type="text"
                                        placeholder="Contact person name"
                                        value={clerkEmergencyContactName}
                                        onChange={(e) => setClerkEmergencyContactName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clerkEmergencyContact">Emergency Contact Number</Label>
                                    <Input
                                        id="clerkEmergencyContact"
                                        type="tel"
                                        placeholder="+880-1700-000000"
                                        value={clerkEmergencyContact}
                                        onChange={(e) => setClerkEmergencyContact(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </>
                        )}

                        {userType === "adjutant" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="adjutantServiceNo">Service Number</Label>
                                    <Input
                                        id="adjutantServiceNo"
                                        type="text"
                                        placeholder="e.g., AD-2001"
                                        value={adjutantServiceNo}
                                        onChange={(e) => setAdjutantServiceNo(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adjutantRank">Rank</Label>
                                    <Input
                                        id="adjutantRank"
                                        type="text"
                                        placeholder="e.g., Major, Captain"
                                        value={adjutantRank}
                                        onChange={(e) => setAdjutantRank(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adjutantUnit">Unit</Label>
                                    <Input
                                        id="adjutantUnit"
                                        type="text"
                                        placeholder="e.g., Battalion Headquarters"
                                        value={adjutantUnit}
                                        onChange={(e) => setAdjutantUnit(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adjutantDateOfJoining">Date of Joining</Label>
                                    <Input
                                        id="adjutantDateOfJoining"
                                        type="date"
                                        value={adjutantDateOfJoining}
                                        onChange={(e) => setAdjutantDateOfJoining(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adjutantPhone">Phone Number</Label>
                                    <Input
                                        id="adjutantPhone"
                                        type="tel"
                                        placeholder="+880-1700-000000"
                                        value={adjutantPhone}
                                        onChange={(e) => setAdjutantPhone(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adjutantAddress">Address</Label>
                                    <Input
                                        id="adjutantAddress"
                                        type="text"
                                        placeholder="Your address"
                                        value={adjutantAddress}
                                        onChange={(e) => setAdjutantAddress(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adjutantEmergencyContactName">Emergency Contact Name</Label>
                                    <Input
                                        id="adjutantEmergencyContactName"
                                        type="text"
                                        placeholder="Contact person name"
                                        value={adjutantEmergencyContactName}
                                        onChange={(e) => setAdjutantEmergencyContactName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adjutantEmergencyContact">Emergency Contact Number</Label>
                                    <Input
                                        id="adjutantEmergencyContact"
                                        type="tel"
                                        placeholder="+880-1700-000000"
                                        value={adjutantEmergencyContact}
                                        onChange={(e) => setAdjutantEmergencyContact(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
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
                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Sign up"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
