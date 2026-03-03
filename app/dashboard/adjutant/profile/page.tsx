"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types
interface AdjudantProfile {
    id: string;
    fullName: string;
    // Use common fields (data is stored here, not in adjutant-prefixed fields)
    rank?: string;
    serviceNo?: string;
    email: string;
    phone?: string;
    unit?: string;
    dateOfJoining?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContact?: string;
    // Fallback adjutant-specific fields
    adjutantRank?: string;
    adjutantServiceNo?: string;
    adjutantPhone?: string;
    adjutantUnit?: string;
    adjutantDateOfJoining?: string;
    adjutantAddress?: string;
    adjutantEmergencyContactName?: string;
    adjutantEmergencyContact?: string;
}

export default function AdjudantProfilePage() {
    const [profile, setProfile] = useState<AdjudantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                const profileRes = await fetch(`/api/profile?userId=${user.id}`);

                if (!profileRes.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await profileRes.json();
                setProfile(data);
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
            <div className="min-h-screen bg-[#020617] p-6 flex items-center justify-center">
                <p className="text-lg text-slate-400">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-[#020617] p-6 flex items-center justify-center">
                <p className="text-lg text-red-400">{error || 'Profile not found'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex gap-6">
                                {/* Avatar Placeholder */}
                                <div className="shrink-0">
                                    <div className="w-24 h-24 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-white">{profile.fullName}</h1>
                                        <Badge className="text-emerald-400 bg-emerald-500/20 border border-emerald-500/30">
                                            Active
                                        </Badge>
                                    </div>
                                    <p className="text-lg text-slate-400 mb-1">Adjutant - Administrative & Fitness Management</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400 mb-4">
                                        <div>
                                            <p className="font-semibold text-slate-300">Rank</p>
                                            <p>{profile.rank || profile.adjutantRank || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-300">Service No</p>
                                            <p>{profile.serviceNo || profile.adjutantServiceNo || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-300">Unit</p>
                                            <p>{profile.unit || profile.adjutantUnit || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-300">Join Date</p>
                                            <p>{(profile.dateOfJoining || profile.adjutantDateOfJoining) ? new Date(profile.dateOfJoining || profile.adjutantDateOfJoining!).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{profile.address || profile.adjutantAddress || 'Address not set'}</span>
                                    </div>
                                </div>
                            </div>

{/* Action buttons removed as requested */}
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
                            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-slate-400">Email</p>
                                    <p className="font-semibold text-white">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.048 1.029a1 1 0 00.95 0l2.048-1.029a1 1 0 00.502-.756l1.498-4.493a1 1 0 00-.948-.684H19a2 2 0 012 2v2a9 9 0 01-18 0V5z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-slate-400">Phone</p>
                                    <p className="font-semibold text-white">{profile.phone || profile.adjutantPhone || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Unit Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <p className="text-sm text-slate-400 mb-1">Assigned Unit</p>
                                <p className="font-semibold text-white">{profile.unit || profile.adjutantUnit || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                <p className="text-sm text-slate-400 mb-1">Unit Location</p>
                                <p className="font-semibold text-white">{profile.address || profile.adjutantAddress || 'Address not set'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
