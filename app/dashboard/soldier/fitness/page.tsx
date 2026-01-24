"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth-client";
import { Dumbbell } from "lucide-react";

export default function FitnessPage() {
    // (recent test list removed from this view)

    // fitness status controls which workout plans to show
    const [fitnessStatus, setFitnessStatus] = useState<'Fit' | 'Unfit'>("Fit");
    
    const authUser = typeof window !== 'undefined' ? getUser() : null;
    const isClerk = authUser?.userType === 'clerk';
    // targetUserId is the soldier being viewed/edited. By default use the logged-in user's id.
    const [targetUserId, setTargetUserId] = useState<string | undefined>(authUser?.id);

    const fitWorkoutPlans = [
        { name: "Endurance Run", duration: "30 min", focus: "Cardio" },
        { name: "Core Strength", duration: "20 min", focus: "Core" },
        { name: "Upper Body", duration: "25 min", focus: "Strength" },
    ];

    const unfitWorkoutPlans = [
        { name: "Beginner Walk", duration: "20 min", focus: "Low Impact Cardio" },
        { name: "Mobility Routine", duration: "15 min", focus: "Flexibility" },
        { name: "Light Strength", duration: "20 min", focus: "Bodyweight" },
    ];

    const workoutPlansDefault = fitnessStatus === 'Fit' ? fitWorkoutPlans : unfitWorkoutPlans;

    // assigned plan (from clerk) overrides the default plans when present
    const [assignedPlanExercises, setAssignedPlanExercises] = useState<Array<{ name: string; duration: string; focus: string }>>([]);

    const fetchAssignedPlan = async (userId?: string) => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/fitness/assign?userId=${encodeURIComponent(userId)}`);
            const json = await res.json();
            if (json?.plan?.exercises) {
                setAssignedPlanExercises(json.plan.exercises as any);
            } else {
                setAssignedPlanExercises([]);
            }
        } catch {
            setAssignedPlanExercises([]);
        }
    };

    // IPFT date state and picker
    const [ipftDate, setIpftDate] = useState<string>("2026-02-15");
    const [showDatePicker, setShowDatePicker] = useState(false);

    const getDaysRemaining = (dateStr: string) => {
        const target = new Date(dateStr);
        const now = new Date();
        // reset time to midnight for rough day diff
        const t = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
        const n = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const diff = Math.ceil((t - n) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const daysRemaining = getDaysRemaining(ipftDate);

    const overviewCards = [
        {
            title: "Fitness Status",
            value: fitnessStatus,
            subtitle: fitnessStatus === 'Fit' ? 'Active' : 'Needs Improvement',
            badgeColor: fitnessStatus === 'Fit' ? 'bg-green-500' : 'bg-red-500'
        },
        {
            title: "Overall Score",
            value: "87%",
            subtitle: "Above Average"
        },
        {
            title: "Tests Passed",
            value: "6/6",
            subtitle: "Last Month"
        },
        {
            title: "Next IPFT",
            value: `${daysRemaining}`,
            subtitle: ipftDate
        }
    ];

    const upcomingTests = [
        { name: "Monthly Mile Test", date: "2026-01-10" },
        { name: "Quarterly Assessment", date: "2026-01-30" },
        { name: "IPFT", date: "2026-02-15" },
    ];

    // fetch status for a userId
    const fetchStatus = async (userId?: string) => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/fitness?userId=${encodeURIComponent(userId)}`);
            const json = await res.json();
            if (json?.status === 'Fit' || json?.status === 'Unfit') {
                setFitnessStatus(json.status);
            }
        } catch {
            // ignore
        }
    };

    const updateStatus = async (userId: string, status: 'Fit' | 'Unfit') => {
        try {
            const res = await fetch('/api/fitness', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status }),
            });
            const json = await res.json();
            if (json?.ok) {
                setFitnessStatus(status);
                return true;
            }
        } catch {
            // ignore
        }
        return false;
    };

    useEffect(() => {
        // load status and assigned plan for current target when page mounts or target changes
        if (!targetUserId) return;
        (async () => {
            await fetchStatus(targetUserId);
            await fetchAssignedPlan(targetUserId);
        })();
    }, [targetUserId]);

    const workoutPlansToShow = assignedPlanExercises && assignedPlanExercises.length > 0 ? assignedPlanExercises : workoutPlansDefault;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Fitness Dashboard</h1>
                <p className="text-gray-500 mt-1">Track your performance and progress</p>
                <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className={`px-2 py-1 rounded ${fitnessStatus === 'Fit' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {fitnessStatus}{/* show a simple badge */}
                    </div>
                    {/* Clerk controls: allow updating another user's status by id */}
                    {isClerk && (
                        <div className="flex items-center gap-2">
                            <input
                                value={targetUserId ?? ''}
                                onChange={(e) => setTargetUserId(e.target.value || undefined)}
                                placeholder="target user id"
                                className="border px-2 py-1 rounded"
                            />
                            <button
                                className="px-2 py-1 rounded bg-green-600 text-white"
                                onClick={() => targetUserId && updateStatus(targetUserId, 'Fit')}
                            >
                                Set Fit
                            </button>
                            <button
                                className="px-2 py-1 rounded bg-red-600 text-white"
                                onClick={() => targetUserId && updateStatus(targetUserId, 'Unfit')}
                            >
                                Set Unfit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Recent Test Results removed */}

                    {/* Workout Plan card */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Workout Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {workoutPlansToShow.map((plan, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-blue-100">
                                                    <Dumbbell className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{plan.name}</h3>
                                                    <p className="text-sm text-gray-500">{plan.focus}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-700">{plan.duration}</p>
                                            </div>
                                        </div>
                                        {index !== workoutPlansToShow.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    {overviewCards.map((card, index) => {
                        if (card.title === "Next IPFT") {
                            return (
                                <Card key={index}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold">{card.value}</div>
                                                <p className="text-sm text-gray-500 mt-2">{card.subtitle}</p>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    className="text-sm text-blue-600 underline"
                                                    onClick={() => setShowDatePicker((v) => !v)}
                                                >
                                                    Edit
                                                </button>
                                                {showDatePicker && (
                                                    <div className="absolute right-0 mt-2 bg-white p-2 rounded shadow z-10">
                                                        <input
                                                            type="date"
                                                            value={ipftDate}
                                                            onChange={(e) => setIpftDate(e.target.value)}
                                                            className="border px-2 py-1 rounded"
                                                        />
                                                        <div className="text-xs text-gray-500 mt-1">Select IPFT date</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        }

                        return (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold">{card.value}</div>
                                            {card.badgeColor ? (
                                                <Badge className={`mt-2 ${card.badgeColor}`}>{card.subtitle}</Badge>
                                            ) : (
                                                <p className="text-sm text-gray-500 mt-2">{card.subtitle}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {/* Upcoming tests list with IPFT highlighted */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Tests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {upcomingTests.map((t) => (
                                    <div key={t.name} className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">{t.name}</div>
                                        <div className={`text-sm ${t.name === 'IPFT' ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                            {t.name === 'IPFT' ? ipftDate : t.date}
                                        </div>
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