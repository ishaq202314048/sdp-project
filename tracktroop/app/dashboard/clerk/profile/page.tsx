
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Separator not used here
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
    Edit,
    Award,
} from "lucide-react";

export default function ClerkProfilePage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [profileData, setProfileData] = useState({
        fullName: "Cpl. Muhammad Hassan",
        serviceNo: "BA-1001",
        email: "hassan.clerk@military.gov.bd",
        phone: "+880-1700-000001",
        rank: "Corporal",
        unit: "Headquarters, Dhaka",
        joinDate: "2005-06-15",
        role: "Administrative Officer (Clerk)",
        status: "Active",
        address: "Dhaka Cantonment, Dhaka",
        emergencyContactName: "Fatima Hassan (Wife)",
        emergencyContact: "+880-1712-987654",
    });

    const [formData, setFormData] = useState({
        phone: profileData.phone,
        address: profileData.address,
        emergencyContactName: profileData.emergencyContactName,
        emergencyContact: profileData.emergencyContact,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveChanges = () => {
        setProfileData({
            ...profileData,
            phone: formData.phone,
            address: formData.address,
            emergencyContactName: formData.emergencyContactName,
            emergencyContact: formData.emergencyContact,
        });
        setIsDialogOpen(false);
    };

    const serviceDetails = [
        { label: "Service Number", value: profileData.serviceNo, icon: Shield },
        { label: "Rank", value: profileData.rank, icon: Award },
        { label: "Unit", value: profileData.unit, icon: Shield },
        { label: "Role", value: profileData.role, icon: Shield },
        { label: "Date of Joining", value: new Date(profileData.joinDate).toLocaleDateString(), icon: Calendar },
    ];

    const personalDetails = [
        { label: "Email", value: profileData.email, icon: Mail },
        { label: "Phone", value: profileData.phone, icon: Phone },
        { label: "Address", value: profileData.address, icon: MapPin },
        { label: "Status", value: profileData.status, icon: Shield },
    ];

    const emergencyInfo = [
        { label: "Emergency Contact Name", value: profileData.emergencyContactName },
        { label: "Emergency Contact Number", value: profileData.emergencyContact },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            View and manage your profile information
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild className="cursor-pointer">
                            <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>Update your contact information.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+880 1700-000001"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Your address"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                                    <Input
                                        id="emergencyContactName"
                                        name="emergencyContactName"
                                        value={formData.emergencyContactName}
                                        onChange={handleInputChange}
                                        placeholder="Contact person name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
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
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-600">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Profile Hero Card */}
                <Card className="bg-linear-to-br from-blue-500 to-blue-700 text-white border-none">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                                <User className="w-16 h-16 text-white" />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-2">{profileData.fullName}</h2>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                        {profileData.rank}
                                    </Badge>
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                        {profileData.serviceNo}
                                    </Badge>
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                                        {profileData.status}
                                    </Badge>
                                </div>
                                <p className="text-lg opacity-90 mb-2">{profileData.unit}</p>
                                <div className="flex flex-wrap gap-4 text-sm opacity-90 justify-center md:justify-start">
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {profileData.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {profileData.phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Service Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                Service Details
                            </CardTitle>
                            <CardDescription>Your military service information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {serviceDetails.map((detail, index) => {
                                    const Icon = detail.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            <Icon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{detail.label}</p>
                                                <p className="font-semibold text-slate-900 dark:text-white">{detail.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Personal Details
                            </CardTitle>
                            <CardDescription>Your contact and personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {personalDetails.map((detail, index) => {
                                    const Icon = detail.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            <Icon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{detail.label}</p>
                                                <p className="font-semibold text-slate-900 dark:text-white">{detail.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-blue-600" />
                            Emergency Information
                        </CardTitle>
                        <CardDescription>Your emergency contact details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {emergencyInfo.map((detail, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{detail.label}</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{detail.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
