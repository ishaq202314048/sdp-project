"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    const [assignedPlanExercises, setAssignedPlanExercises] = useState<Array<Record<string, unknown>>>([]);

    const fetchAssignedPlan = async (userId?: string) => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/fitness/assign?userId=${encodeURIComponent(userId)}`);
            const json = await res.json();
            if (json?.plan?.exercises) {
                setAssignedPlanExercises(json.plan.exercises as Array<Record<string, unknown>>);
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

    

    // day selector (Sunday-first)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const getTodayName = () => days[new Date().getDay()];
    const [selectedDay, setSelectedDay] = useState<string>(getTodayName());

    // normalize assigned plan shape: some plans store exercises as day blocks [{ day, items: [...] }]
    const isDayBlock = (arr: unknown): arr is Array<{ day: string; items: Array<Record<string, unknown>> }> => {
        if (!Array.isArray(arr) || (arr as unknown[]).length === 0) return false;
        const first = (arr as unknown[])[0] as unknown;
        const maybeDay = (first as { day?: unknown }).day;
        const maybeItems = (first as { items?: unknown }).items;
        return typeof maybeDay === 'string' && Array.isArray(maybeItems);
    };

    const exercisesForSelectedDay = (): Array<Record<string, unknown>> => {
        if (isDayBlock(assignedPlanExercises)) {
            const block = (assignedPlanExercises as Array<{ day: string; items: Array<Record<string, unknown>> }>).find((b) => String(b.day).toLowerCase() === selectedDay.toLowerCase());
            return block ? block.items : [];
        }
        // assignedPlanExercises may be flat list or empty; if present and flat, show all for any day
        if (assignedPlanExercises && assignedPlanExercises.length > 0) return assignedPlanExercises as Array<Record<string, unknown>>;
        // fallback: default plans mapped to record shape
        return workoutPlansDefault.map((p) => ({ name: p.name, duration: p.duration, focus: p.focus }));
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Fitness Dashboard</h1>
                <p className="text-gray-500 mt-1">Track your performance and progress</p>
                <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className={`px-3 py-1 rounded-full shadow-sm text-sm ${fitnessStatus === 'Fit' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {fitnessStatus}
                    </div>
                    {/* Clerk controls: allow updating another user's status by id */}
                    {isClerk && (
                        <div className="flex items-center gap-2">
                            <input
                                value={targetUserId ?? ''}
                                onChange={(e) => setTargetUserId(e.target.value || undefined)}
                                placeholder="target user id"
                                className="border px-3 py-2 rounded-md shadow-sm"
                            />
                            <Button size="sm" variant="default" onClick={() => targetUserId && updateStatus(targetUserId, 'Fit')}>Set Fit</Button>
                            <Button size="sm" variant="destructive" onClick={() => targetUserId && updateStatus(targetUserId, 'Unfit')}>Set Unfit</Button>
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
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="text-sm block mb-1">Select weekday</label>
                                    <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="border px-3 py-2 rounded-md shadow-sm w-full">
                                        {days.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="shrink-0 mt-6">
                                    <Button size="sm" variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200" onClick={() => {
                                        // build and download week plan
                                        const buildWeekPlan = () => {
                                            // if day-block format, produce mapping for each weekday
                                            if (isDayBlock(assignedPlanExercises)) {
                                                const mapping: Record<string, Array<Record<string, unknown>>> = {};
                                                days.forEach((d) => (mapping[d] = []));
                                                (assignedPlanExercises as Array<{ day: string; items: Array<Record<string, unknown>> }>).forEach((b) => {
                                                    const dayName = String(b.day);
                                                    mapping[dayName] = b.items || [];
                                                });
                                                return mapping;
                                            }

                                            // if flat list available, put it under "AllDays"
                                            if (assignedPlanExercises && assignedPlanExercises.length > 0) {
                                                return { AllDays: assignedPlanExercises };
                                            }

                                            // fallback: use default workout plans mapped to each day
                                            const fallback = workoutPlansDefault.map((p) => ({ name: p.name, duration: p.duration, focus: p.focus }));
                                            const mapping: Record<string, Array<Record<string, unknown>>> = {};
                                            days.forEach((d) => (mapping[d] = fallback));
                                            return mapping;
                                        };

                                        try {
                                            const weekPlan = buildWeekPlan();
                                            const payload = {
                                                userId: targetUserId ?? "unknown",
                                                generatedAt: new Date().toISOString(),
                                                plan: weekPlan,
                                            };
                                            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement("a");
                                            a.href = url;
                                            const fileNameUser = (targetUserId ?? "user").replace(/[^a-z0-9-_]/gi, "_");
                                            a.download = `week-plan-${fileNameUser}-${new Date().toISOString().slice(0,10)}.json`;
                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();
                                            URL.revokeObjectURL(url);
                                        } catch {
                                            // silent fail for now
                                        }
                                    }}>Download Week</Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {exercisesForSelectedDay().map((plan, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-4">
                                                            <div className="p-2 rounded-lg bg-linear-to-br from-blue-50 to-blue-100">
                                                                <Dumbbell className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                <div>
                                                    <h3 className="font-semibold">{String(plan.name)}</h3>
                                                    <p className="text-sm text-gray-500">{String(plan.focus ?? '')}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-700">{String(plan.duration ?? '')}</p>
                                            </div>
                                        </div>
                                        {index !== exercisesForSelectedDay().length - 1 && <Separator />}
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