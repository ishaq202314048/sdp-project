"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Types
interface AdjudantProfile {
    id: string;
    name: string;
    rank: string;
    serviceNo: string;
    avatar?: string;
    email: string;
    phone: string;
    joinDate: string;
    unit: string;
    unitCommander: string;
    responsibility: string;
    status: "Active" | "On Leave" | "Inactive";
    location: string;
}

interface ActivityLog {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    category: "Fitness Test" | "Alert" | "Soldier Management" | "Report" | "System";
}

interface UnitOverview {
    totalSoldiers: number;
    averageScore: number;
    passRate: number;
    pendingTests: number;
    highRiskSoldiers: number;
}

// Mock Data
const mockProfile: AdjudantProfile = {
    id: "ADJ001",
    name: "Major Karim Ahmed",
    rank: "Major",
    serviceNo: "198901234",
    email: "karim.ahmed@military.com",
    phone: "+880-2-XXXX-5678",
    joinDate: "2020-06-15",
    unit: "Infantry Battalion - 1st Unit",
    unitCommander: "Lt Col Md Abul Basar",
    responsibility: "Adjudant - Administrative & Fitness Management",
    status: "Active",
    location: "Dhaka Cantonment, Bangladesh"
};

const mockUnitOverview: UnitOverview = {
    totalSoldiers: 156,
    averageScore: 482,
    passRate: 82.1,
    pendingTests: 12,
    highRiskSoldiers: 8
};

const mockActivityLog: ActivityLog[] = [
    {
        id: "1",
        action: "Recorded Fitness Test",
        details: "IPFT test results for Lt. Rahman (Service No: 202114190) - Score: 537 (Pass)",
        timestamp: "2026-01-07 14:30",
        category: "Fitness Test"
    },
    {
        id: "2",
        action: "Generated Alert",
        details: "Low performance alert created for Lt. Ahmed - 3 consecutive failed tests",
        timestamp: "2026-01-06 10:15",
        category: "Alert"
    },
    {
        id: "3",
        action: "Updated Soldier Profile",
        details: "Medical category updated for Sgt. Khan - BMI adjustment required",
        timestamp: "2026-01-05 09:45",
        category: "Soldier Management"
    },
    {
        id: "4",
        action: "Generated Report",
        details: "Monthly fitness report generated for command review",
        timestamp: "2026-01-04 16:20",
        category: "Report"
    },
    {
        id: "5",
        action: "System Update",
        details: "System backup completed successfully",
        timestamp: "2026-01-03 23:00",
        category: "System"
    }
];

export default function AdjudantProfilePage() {
    const [profile] = useState<AdjudantProfile>(mockProfile);
    const [unitOverview] = useState<UnitOverview>(mockUnitOverview);
    const [activityLog] = useState<ActivityLog[]>(mockActivityLog);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const getActivityCategoryColor = (category: string) => {
        switch (category) {
            case "Fitness Test": return "text-blue-600 bg-blue-50 border-blue-200";
            case "Alert": return "text-red-600 bg-red-50 border-red-200";
            case "Soldier Management": return "text-purple-600 bg-purple-50 border-purple-200";
            case "Report": return "text-green-600 bg-green-50 border-green-200";
            case "System": return "text-gray-600 bg-gray-50 border-gray-200";
            default: return "";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "text-green-700 bg-green-100";
            case "On Leave": return "text-yellow-700 bg-yellow-100";
            case "Inactive": return "text-gray-700 bg-gray-100";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex gap-6">
                                {/* Avatar Placeholder */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                        <Badge className={getStatusColor(profile.status)}>
                                            {profile.status}
                                        </Badge>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-1">{profile.responsibility}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                        <div>
                                            <p className="font-semibold text-gray-700">Rank</p>
                                            <p>{profile.rank}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">Service No</p>
                                            <p>{profile.serviceNo}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">Unit Commander</p>
                                            <p>{profile.unitCommander}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">Join Date</p>
                                            <p>{new Date(profile.joinDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{profile.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex lg:flex-col gap-3">
                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Edit Profile</DialogTitle>
                                            <DialogDescription>
                                                Update your profile information
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Full Name</Label>
                                                    <Input defaultValue={profile.name} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Rank</Label>
                                                    <Input defaultValue={profile.rank} disabled />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Email</Label>
                                                    <Input type="email" defaultValue={profile.email} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Phone</Label>
                                                    <Input defaultValue={profile.phone} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Location</Label>
                                                <Input defaultValue={profile.location} />
                                            </div>
                                            <div className="flex justify-end gap-3 pt-4 border-t">
                                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={() => setIsEditDialogOpen(false)}>
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="lg">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Settings
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact & Unit Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold text-gray-900">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.048 1.029a1 1 0 00.95 0l2.048-1.029a1 1 0 00.502-.756l1.498-4.493a1 1 0 00-.948-.684H19a2 2 0 012 2v2a9 9 0 01-18 0V5z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-semibold text-gray-900">{profile.phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Unit Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm text-gray-600 mb-1">Assigned Unit</p>
                                <p className="font-semibold text-gray-900">{profile.unit}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="text-sm text-gray-600 mb-1">Commanding Officer</p>
                                <p className="font-semibold text-gray-900">{profile.unitCommander}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Unit Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Unit Overview</CardTitle>
                        <CardDescription>Key metrics for your assigned unit</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-600 mb-2">Total Soldiers</p>
                                <p className="text-2xl font-bold text-blue-600">{unitOverview.totalSoldiers}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-gray-600 mb-2">Pass Rate</p>
                                <p className="text-2xl font-bold text-green-600">{unitOverview.passRate.toFixed(1)}%</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm text-gray-600 mb-2">Avg Score</p>
                                <p className="text-2xl font-bold text-purple-600">{unitOverview.averageScore}</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="text-sm text-gray-600 mb-2">Pending Tests</p>
                                <p className="text-2xl font-bold text-orange-600">{unitOverview.pendingTests}</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-gray-600 mb-2">High Risk</p>
                                <p className="text-2xl font-bold text-red-600">{unitOverview.highRiskSoldiers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Log */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Your recent actions in the system</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activityLog.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <Badge className={getActivityCategoryColor(activity.category)}>
                                                {activity.category}
                                            </Badge>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">{activity.action}</h4>
                                            <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                                        </div>
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
