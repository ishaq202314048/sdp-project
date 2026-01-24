"use client";

import { useState } from "react";
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
    Camera,
    Ruler,
    Weight,
    UserCircle,
} from "lucide-react";

export default function ProfilePage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Mock data - replace with actual data from your backend
    const [soldierProfile, setSoldierProfile] = useState({
        name: "Sgt John Doe",
        serviceNo: "BD-12345",
        rank: "Sergeant",
        unit: "3rd Infantry Battalion",
        age: 28,
        dateOfBirth: "1997-05-15",
        dateOfJoining: "2019-08-01",
        bloodGroup: "O+",
        height: 175,
        weight: 72,
        bmi: 23.5,
        medicalCategory: "A",
        email: "john.doe@army.mil",
        phone: "+880 1712-345678",
        address: "Dhaka Cantonment, Dhaka",
        emergencyContact: "+880 1712-987654",
        emergencyContactName: "Jane Doe (Wife)",
    });

    const [formData, setFormData] = useState({
        phone: soldierProfile.phone,
        address: soldierProfile.address,
        emergencyContactName: soldierProfile.emergencyContactName,
        emergencyContact: soldierProfile.emergencyContact,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveChanges = () => {
        setSoldierProfile({
            ...soldierProfile,
            phone: formData.phone,
            address: formData.address,
            emergencyContactName: formData.emergencyContactName,
            emergencyContact: formData.emergencyContact,
        });
        setIsDialogOpen(false);
    };

    const serviceDetails = [
        { label: "Service Number", value: soldierProfile.serviceNo, icon: Shield },
        { label: "Rank", value: soldierProfile.rank, icon: Award },
        { label: "Unit", value: soldierProfile.unit, icon: Shield },
        { label: "Date of Joining", value: new Date(soldierProfile.dateOfJoining).toLocaleDateString(), icon: Calendar },
        { label: "Years of Service", value: "5 years 4 months", icon: Calendar },
    ];

    const personalDetails = [
        { label: "Date of Birth", value: new Date(soldierProfile.dateOfBirth).toLocaleDateString(), icon: Calendar },
        { label: "Age", value: `${soldierProfile.age} years`, icon: UserCircle },
        { label: "Blood Group", value: soldierProfile.bloodGroup, icon: Heart },
        { label: "Email", value: soldierProfile.email, icon: Mail },
        { label: "Phone", value: soldierProfile.phone, icon: Phone },
        { label: "Address", value: soldierProfile.address, icon: MapPin },
    ];

    const physicalStats = [
        { label: "Height", value: `${soldierProfile.height} cm`, icon: Ruler },
        { label: "Weight", value: `${soldierProfile.weight} kg`, icon: Weight },
        { label: "BMI", value: soldierProfile.bmi.toFixed(1), icon: Activity },
        { label: "Medical Category", value: `Category ${soldierProfile.medicalCategory}`, icon: Heart },
    ];

    const emergencyInfo = [
        { label: "Emergency Contact Name", value: soldierProfile.emergencyContactName },
        { label: "Emergency Contact Number", value: soldierProfile.emergencyContact },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Profile
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            View and manage your profile information
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild className="bg-blue-500 hover:bg-blue-600 border border-blue-700 cursor-pointer">
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
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-600 border border-green-700 cursor-pointer">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                
                <Card className="bg-linear-to-br from-blue-500 to-blue-700 text-white border-none">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                                    <User className="w-16 h-16 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-2">{soldierProfile.name}</h2>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                        {soldierProfile.rank}
                                    </Badge>
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                        {soldierProfile.serviceNo}
                                    </Badge>
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                                        Medical Category {soldierProfile.medicalCategory}
                                    </Badge>
                                </div>
                                <p className="text-lg opacity-90 mb-2">{soldierProfile.unit}</p>
                                <div className="flex flex-wrap gap-4 text-sm opacity-90 justify-center md:justify-start">
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {soldierProfile.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {soldierProfile.phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                        <div key={index}>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                        <Icon className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                                        {detail.label}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {detail.value}
                                                </span>
                                            </div>
                                            {index < serviceDetails.length - 1 && <Separator />}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-600" />
                                Personal Details
                            </CardTitle>
                            <CardDescription>Your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {personalDetails.map((detail, index) => {
                                    const Icon = detail.icon;
                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                        <Icon className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                                        {detail.label}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[60%] truncate">
                                                    {detail.value}
                                                </span>
                                            </div>
                                            {index < personalDetails.length - 1 && <Separator />}
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
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-600" />
                                Physical Statistics
                            </CardTitle>
                            <CardDescription>Your physical measurements and fitness data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {physicalStats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon className="w-4 h-4 text-emerald-600" />
                                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                                    {stat.label}
                                                </span>
                                            </div>
                                            <div className="text-xl font-bold text-slate-900 dark:text-white">
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
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-red-600" />
                                Emergency Contact
                            </CardTitle>
                            <CardDescription>Contact information for emergencies</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {emergencyInfo.map((info, index) => (
                                    <div key={index}>
                                        <div className="py-2">
                                            <span className="text-sm text-slate-600 dark:text-slate-400 block mb-1">
                                                {info.label}
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white text-lg">
                                                {info.value}
                                            </span>
                                        </div>
                                        {index < emergencyInfo.length - 1 && <Separator />}
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
