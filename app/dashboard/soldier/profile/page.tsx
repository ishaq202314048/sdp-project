"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Heart,
    Activity,
    Award,
    Edit,
    Ruler,
    Weight,
    UserCircle,
    Loader,
} from "lucide-react";
import { getUser } from "@/lib/auth-client";

interface SoldierProfile {
    id: string;
    fullName: string;
    email: string;
    serviceNo?: string | null;
    rank?: string | null;
    unit?: string | null;
    dateOfBirth?: Date | null;
    dateOfJoining?: Date | null;
    bloodGroup?: string | null;
    height?: number | null;
    weight?: number | null;
    bmi?: number | null;
    medicalCategory?: string | null;
    phone?: string | null;
    address?: string | null;
    emergencyContactName?: string | null;
    emergencyContact?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function ProfilePage() {
    const authUser = getUser();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [soldierProfile, setSoldierProfile] = useState<SoldierProfile | null>(null);
    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        emergencyContactName: "",
        emergencyContact: "",
    });

    // Fetch profile data from database
    useEffect(() => {
        const fetchProfile = async () => {
            if (!authUser?.id) return;
            try {
                setIsLoading(true);
                const res = await fetch(`/api/profile?userId=${authUser.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setSoldierProfile(data);
                    setFormData({
                        phone: data.phone || "",
                        address: data.address || "",
                        emergencyContactName: data.emergencyContactName || "",
                        emergencyContact: data.emergencyContact || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [authUser?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveChanges = async () => {
        if (!authUser?.id) return;
        try {
            setIsSaving(true);
            const res = await fetch(`/api/profile?userId=${authUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const updatedProfile = await res.json();
                setSoldierProfile(updatedProfile);
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-8 h-8 text-emerald-400 animate-spin" />
                    <p className="text-slate-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!soldierProfile) {
        return (
            <div className="min-h-screen bg-[#020617] p-6">
                <div className="max-w-6xl mx-auto">
                    <Card className="bg-red-500/10 border-red-500/30">
                        <CardContent className="pt-6">
                            <p className="text-red-400">Failed to load profile. Please try again.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const calculateAge = (dateOfBirth: Date | null): number => {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const calculateYearsOfService = (dateOfJoining: Date | null): string => {
        if (!dateOfJoining) return "N/A";
        const today = new Date();
        const joinDate = new Date(dateOfJoining);
        let years = today.getFullYear() - joinDate.getFullYear();
        let months = today.getMonth() - joinDate.getMonth();
        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years} years ${months} months`;
    };

    const serviceDetails = [
        { label: "Service Number", value: soldierProfile.serviceNo || "N/A", icon: Shield },
        { label: "Rank", value: soldierProfile.rank || "N/A", icon: Award },
        { label: "Unit", value: soldierProfile.unit || "N/A", icon: Shield },
        { label: "Date of Joining", value: soldierProfile.dateOfJoining ? new Date(soldierProfile.dateOfJoining).toLocaleDateString() : "N/A", icon: Calendar },
        { label: "Years of Service", value: calculateYearsOfService(soldierProfile.dateOfJoining ? new Date(soldierProfile.dateOfJoining) : null), icon: Calendar },
    ];

    const personalDetails = [
        { label: "Date of Birth", value: soldierProfile.dateOfBirth ? new Date(soldierProfile.dateOfBirth).toLocaleDateString() : "N/A", icon: Calendar },
        { label: "Age", value: `${calculateAge(soldierProfile.dateOfBirth ? new Date(soldierProfile.dateOfBirth) : null)} years`, icon: UserCircle },
        { label: "Blood Group", value: soldierProfile.bloodGroup || "N/A", icon: Heart },
        { label: "Email", value: soldierProfile.email || "N/A", icon: Mail },
        { label: "Phone", value: soldierProfile.phone || "N/A", icon: Phone },
        { label: "Address", value: soldierProfile.address || "N/A", icon: MapPin },
    ];

    const physicalStats = [
        { label: "Height", value: soldierProfile.height ? `${soldierProfile.height} cm` : "N/A", icon: Ruler },
        { label: "Weight", value: soldierProfile.weight ? `${soldierProfile.weight} kg` : "N/A", icon: Weight },
        { label: "BMI", value: soldierProfile.bmi ? soldierProfile.bmi.toFixed(1) : "N/A", icon: Activity },
        { label: "Medical Category", value: soldierProfile.medicalCategory ? `Category ${soldierProfile.medicalCategory}` : "N/A", icon: Heart },
    ];

    const emergencyInfo = [
        { label: "Emergency Contact Name", value: soldierProfile.emergencyContactName || "N/A" },
        { label: "Emergency Contact Number", value: soldierProfile.emergencyContact || "N/A" },
    ];

    return (
        <div className="min-h-screen bg-[#020617] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Profile
                        </h1>
                        <p className="text-slate-400 mt-1">
                            View and manage your profile information
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/30 cursor-pointer">
                            <Button className="gap-2">
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-125">
                            <DialogHeader>
                                <DialogTitle>Edit Personal Details</DialogTitle>
                                <DialogDescription>
                                    Update your contact information and emergency details.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+880 1712-345678"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">
                                        Address
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Your address"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergencyContactName">
                                        Emergency Contact Name
                                    </Label>
                                    <Input
                                        id="emergencyContactName"
                                        name="emergencyContactName"
                                        value={formData.emergencyContactName}
                                        onChange={handleInputChange}
                                        placeholder="Contact person name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergencyContact">
                                        Emergency Contact Number
                                    </Label>
                                    <Input
                                        id="emergencyContact"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleInputChange}
                                        placeholder="+880 1712-987654"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveChanges} className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/30 cursor-pointer" disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                
                <Card className="bg-linear-to-br from-emerald-600 to-emerald-800 text-white border-none">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                                    <User className="w-16 h-16 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-2">{soldierProfile.fullName}</h2>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                        {soldierProfile.rank || "N/A"}
                                    </Badge>
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                        {soldierProfile.serviceNo || "N/A"}
                                    </Badge>
                                    <Badge className="bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-100 border-emerald-400/30">
                                        Medical Category {soldierProfile.medicalCategory || "N/A"}
                                    </Badge>
                                </div>
                                <p className="text-lg opacity-90 mb-2">{soldierProfile.unit || "N/A"}</p>
                                <div className="flex flex-wrap gap-4 text-sm opacity-90 justify-center md:justify-start">
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {soldierProfile.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {soldierProfile.phone || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                Service Details
                            </CardTitle>
                            <CardDescription className="text-slate-400">Your military service information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {serviceDetails.map((detail, index) => {
                                    const Icon = detail.icon;
                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                        <Icon className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                    <span className="text-sm text-slate-400">
                                                        {detail.label}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-white">
                                                    {detail.value}
                                                </span>
                                            </div>
                                            {index < serviceDetails.length - 1 && <Separator className="bg-white/[0.06]" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <User className="w-5 h-5 text-purple-400" />
                                Personal Details
                            </CardTitle>
                            <CardDescription className="text-slate-400">Your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {personalDetails.map((detail, index) => {
                                    const Icon = detail.icon;
                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                        <Icon className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                    <span className="text-sm text-slate-400">
                                                        {detail.label}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-white text-right max-w-[60%] truncate">
                                                    {detail.value}
                                                </span>
                                            </div>
                                            {index < personalDetails.length - 1 && <Separator className="bg-white/[0.06]" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Activity className="w-5 h-5 text-emerald-400" />
                                Physical Statistics
                            </CardTitle>
                            <CardDescription className="text-slate-400">Your physical measurements and fitness data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {physicalStats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon className="w-4 h-4 text-emerald-400" />
                                                <span className="text-xs text-slate-400">
                                                    {stat.label}
                                                </span>
                                            </div>
                                            <div className="text-xl font-bold text-white">
                                                {stat.value}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Phone className="w-5 h-5 text-red-400" />
                                Emergency Contact
                            </CardTitle>
                            <CardDescription className="text-slate-400">Contact information for emergencies</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {emergencyInfo.map((info, index) => (
                                    <div key={index}>
                                        <div className="py-2">
                                            <span className="text-sm text-slate-400 block mb-1">
                                                {info.label}
                                            </span>
                                            <span className="font-semibold text-white text-lg">
                                                {info.value}
                                            </span>
                                        </div>
                                        {index < emergencyInfo.length - 1 && <Separator className="bg-white/[0.06]" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
