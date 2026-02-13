"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Types
interface AdjudantProfile {
    id: string;
    fullName: string;
    adjutantRank?: string;
    adjutantServiceNo?: string;
    email: string;
    adjutantPhone?: string;
    adjutantUnit?: string;
    adjutantDateOfJoining?: string;
    adjutantAddress?: string;
    adjutantEmergencyContactName?: string;
    adjutantEmergencyContact?: string;
}

interface UnitOverview {
    totalSoldiers: number;
    fitSoldiers: number;
    unfitSoldiers: number;
    passRate: number;
}

export default function AdjudantProfilePage() {
    const [profile, setProfile] = useState<AdjudantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [unitOverview, setUnitOverview] = useState<UnitOverview | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = localStorage.getItem('user');
                if (!userData) {
                    setError('User not found in session');
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                const [profileRes, overviewRes] = await Promise.all([
                    fetch(`/api/profile?userId=${user.id}`),
                    fetch('/api/soldiers/unit-overview'),
                ]);

                if (!profileRes.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await profileRes.json();
                setProfile(data);

                if (overviewRes.ok) {
                    const overviewData = await overviewRes.json();
                    setUnitOverview(overviewData);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-lg text-red-600">{error || 'Profile not found'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex gap-6">
                                {/* Avatar Placeholder */}
                                <div className="shrink-0">
                                    <div className="w-24 h-24 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-gray-900">{profile.fullName}</h1>
                                        <Badge className="text-green-700 bg-green-100">
                                            Active
                                        </Badge>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-1">Adjutant - Administrative & Fitness Management</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                        <div>
                                            <p className="font-semibold text-gray-700">Rank</p>
                                            <p>{profile.adjutantRank || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">Service No</p>
                                            <p>{profile.adjutantServiceNo || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">Unit</p>
                                            <p>{profile.adjutantUnit || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">Join Date</p>
                                            <p>{profile.adjutantDateOfJoining ? new Date(profile.adjutantDateOfJoining).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{profile.adjutantAddress || 'Address not set'}</span>
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
                                                    <Input defaultValue={profile.fullName} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Rank</Label>
                                                    <Input defaultValue={profile.adjutantRank || ''} disabled />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Email</Label>
                                                    <Input type="email" defaultValue={profile.email} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Phone</Label>
                                                    <Input defaultValue={profile.adjutantPhone || ''} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Address</Label>
                                                <Input defaultValue={profile.adjutantAddress || ''} />
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
                                    <p className="font-semibold text-gray-900">{profile.adjutantPhone || 'N/A'}</p>
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
                                <p className="font-semibold text-gray-900">{profile.adjutantUnit || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="text-sm text-gray-600 mb-1">Unit Location</p>
                                <p className="font-semibold text-gray-900">{profile.adjutantAddress || 'Address not set'}</p>
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
                        {unitOverview ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-gray-600 mb-2">Total Soldiers</p>
                                    <p className="text-2xl font-bold text-blue-600">{unitOverview.totalSoldiers}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm text-gray-600 mb-2">Fit Soldiers</p>
                                    <p className="text-2xl font-bold text-green-600">{unitOverview.fitSoldiers}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-sm text-gray-600 mb-2">Unfit Soldiers</p>
                                    <p className="text-2xl font-bold text-red-600">{unitOverview.unfitSoldiers}</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <p className="text-sm text-gray-600 mb-2">Pass Rate</p>
                                    <p className="text-2xl font-bold text-purple-600">{unitOverview.passRate.toFixed(1)}%</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Loading unit overview...</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
