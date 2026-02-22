"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
    Activity,
    User,
    Trophy,
    TrendingUp,
    Calendar,
    Heart,
    AlertCircle,
    Dumbbell,
    Timer
} from "lucide-react";

interface FitnessTest {
    id: string;
    exerciseName: string;
    result: string;
    createdAt: string;
}

export default function SoldierHomePage() {
    const [fitnessTests, setFitnessTests] = useState<FitnessTest[]>([]);
    const [loading, setLoading] = useState(true);

    const [ipftDate, setIpftDate] = useState<string | null>(null);
    const [tomorrowExercises, setTomorrowExercises] = useState<string[]>([]);

    // Profile data from DB
    const [profile, setProfile] = useState<{
        fullName: string;
        serviceNo: string;
        rank: string;
        dateOfBirth: string | null;
        height: number | null;
        weight: number | null;
        bmi: number | null;
        medicalCategory: string | null;
        fitnessStatus: string | null;
    } | null>(null);

    // Function to fetch fitness tests
    const fetchFitnessTests = async () => {
        try {
            setLoading(true);
            // Get user from localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            
            // Only fetch tests if the logged-in user is a soldier
            if (user.userType !== 'soldier') {
                console.log('Only soldiers can view their own fitness tests');
                setLoading(false);
                return;
            }

            // Fetch fitness tests that have been justified by clerk
            const response = await fetch(`/api/soldier-fitness-tests?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setFitnessTests(data.tests || []);
            } else {
                setFitnessTests([]);
            }
        } catch (error) {
            console.error('Failed to fetch fitness tests:', error);
            setFitnessTests([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user and fitness tests on component mount
    useEffect(() => {
        fetchFitnessTests();

        // Fetch IPFT date
        fetch("/api/fitness-test/ipft-date")
            .then(res => res.json())
            .then(data => { if (data.date) setIpftDate(data.date); })
            .catch(() => {});

        // Fetch profile + tomorrow's exercises
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.userType === "soldier") {
                // Fetch full profile from DB
                fetch(`/api/profile?userId=${user.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && !data.error) {
                            setProfile({
                                fullName: data.fullName || "Soldier",
                                serviceNo: data.serviceNo || "N/A",
                                rank: data.rank || "N/A",
                                dateOfBirth: data.dateOfBirth || null,
                                height: data.height || null,
                                weight: data.weight || null,
                                bmi: data.bmi || null,
                                medicalCategory: data.medicalCategory || null,
                                fitnessStatus: data.fitnessStatus || null,
                            });
                        }
                    })
                    .catch(() => {});

                // Fetch tomorrow's exercises
                fetch(`/api/soldier-exercises/tomorrow?userId=${user.id}`)
                    .then(res => res.json())
                    .then(data => { if (data.exercises) setTomorrowExercises(data.exercises); })
                    .catch(() => {});
            }
        }
    }, []);

    // Calculate age from date of birth
    const getAge = (dob: string | null) => {
        if (!dob) return null;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    // Calculate days remaining until IPFT
    const getDaysRemaining = (dateStr: string | null) => {
        if (!dateStr) return null;
        const target = new Date(dateStr);
        const today = new Date();
        const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    // Format IPFT date for display
    const formatIpftShort = (dateStr: string | null) => {
        if (!dateStr) return "Not Set";
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const age = profile ? getAge(profile.dateOfBirth) : null;
    const daysRemaining = getDaysRemaining(ipftDate);

    // BMI subtitle
    const getBmiSubtitle = (bmi: number | null) => {
        if (bmi === null) return "N/A";
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal Range";
        if (bmi < 30) return "Overweight";
        return "Obese";
    };

    const quickStats = [
        {
            icon: User,
            title: "Personal Info",
            value: age !== null ? `${age} years` : "N/A",
            subtitle: profile ? `${profile.height ?? "—"} cm | ${profile.weight ?? "—"} kg` : "Loading...",
            gradient: "from-blue-500 to-blue-600",
        },
        {
            icon: Activity,
            title: "BMI Status",
            value: profile?.bmi ? profile.bmi.toFixed(1) : "N/A",
            subtitle: getBmiSubtitle(profile?.bmi ?? null),
            gradient: "from-emerald-500 to-emerald-600",
        },
        {
            icon: Heart,
            title: "Medical Category",
            value: profile?.medicalCategory ? `Category ${profile.medicalCategory}` : "N/A",
            subtitle: profile?.medicalCategory === "A" ? "Fully Fit" : profile?.medicalCategory ? `Category ${profile.medicalCategory}` : "Not Set",
            gradient: "from-purple-500 to-purple-600",
        },
        {
            icon: Calendar,
            title: "Next IPFT",
            value: formatIpftShort(ipftDate),
            subtitle: daysRemaining !== null ? (daysRemaining > 0 ? `${daysRemaining} days remaining` : daysRemaining === 0 ? "Today!" : "Past due") : "Not scheduled",
            gradient: "from-orange-500 to-orange-600",
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Welcome back, {profile?.fullName || "Soldier"}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Service No: {profile?.serviceNo || "—"} | Rank: {profile?.rank || "—"}
                        </p>
                    </div>
                    <Badge
                        variant={profile?.fitnessStatus === "Fit" ? "default" : "destructive"}
                        className={`px-4 py-2 text-lg bg-white border hover:text-white cursor-pointer ${profile?.fitnessStatus === 'Fit' ? 'border-green-500 text-green-600 hover:bg-green-600' : 'border-red-600 text-red-600 hover:bg-red-600'}`}
                    >
                        {profile?.fitnessStatus || "—"}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className={`bg-linear-to-br ${stat.gradient} text-white border-none`}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        {stat.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-sm opacity-90">{stat.subtitle}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-emerald-600" />
                                        <div>
                                            <CardTitle>Recent Fitness Tests</CardTitle>
                                            <CardDescription>Tests justified by clerk</CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchFitnessTests()}
                                        disabled={loading}
                                    >
                                        {loading ? 'Refreshing...' : 'Refresh'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {loading ? (
                                        <p className="text-sm text-gray-600">Loading fitness tests...</p>
                                    ) : fitnessTests.length === 0 ? (
                                        <p className="text-sm text-gray-600">No justified fitness tests yet.</p>
                                    ) : (
                                        fitnessTests.map((test) => (
                                            <div
                                                key={test.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                        <Dumbbell className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{test.exerciseName}</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(test.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="default" className={test.result === 'Pass' ? 'bg-emerald-500' : 'bg-red-500'}>
                                                        {test.result}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <Button className="w-full mt-4" variant="outline">
                                    View All Test Results
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    Fitness Progress
                                </CardTitle>
                                <CardDescription>Track your performance over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-600 dark:text-slate-400">Performance chart will be displayed here</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {ipftDate && (
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                IPFT scheduled for {new Date(ipftDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                            </p>
                                        </div>
                                    )}
                                    {fitnessTests.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <Trophy className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                You have {fitnessTests.filter(t => t.result === "Pass").length}/{fitnessTests.length} tests passed
                                            </p>
                                        </div>
                                    )}
                                    {profile?.fitnessStatus === "Fit" && (
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                            <Heart className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                Maintain your excellent fitness record
                                            </p>
                                        </div>
                                    )}
                                    {!ipftDate && fitnessTests.length === 0 && (
                                        <p className="text-sm text-slate-500 text-center py-2">No notifications</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Timer className="w-5 h-5 text-blue-600" />
                                    Upcoming Activities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {/* IPFT Date */}
                                    {ipftDate && (
                                        <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                    IPFT (Fitness Test)
                                                </p>
                                                <Badge variant="destructive" className="text-xs">
                                                    Required
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(ipftDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                            </p>
                                        </div>
                                    )}

                                    {/* Tomorrow's Exercises */}
                                    {tomorrowExercises.length > 0 ? (
                                        <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                    Tomorrow&apos;s Exercises
                                                </p>
                                                <Badge variant="outline" className="text-xs">
                                                    Scheduled
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                {tomorrowExercises.map((ex, i) => (
                                                    <p key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                        <Dumbbell className="w-3 h-3 text-blue-500" />
                                                        {ex}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <p className="text-sm text-slate-500">No exercises scheduled for tomorrow</p>
                                        </div>
                                    )}

                                    {!ipftDate && tomorrowExercises.length === 0 && (
                                        <p className="text-sm text-slate-500 text-center py-2">No upcoming activities</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
