"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Dumbbell } from "lucide-react";

export default function FitnessPage() {
    // (recent test list removed from this view)

    // fitness status controls which workout plans to show
    const [fitnessStatus, setFitnessStatus] = useState<'Fit' | 'Unfit'>("Fit");

    const [weeklyPlan, setWeeklyPlan] = useState<{ id: string; title: string; status: 'Fit' | 'Unfit'; exercises: Array<{ day: string; items: Array<{ name: string; duration: string; focus: string }> }>; createdBy: string; createdAt: string } | null>(null);
    const [planLoading, setPlanLoading] = useState(false);
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

    // Fetch weekly plan based on fitness status
    const fetchWeeklyPlan = async (status: 'Fit' | 'Unfit') => {
        setPlanLoading(true);
        try {
            console.log('[fetchWeeklyPlan] Fetching plans for status:', status);
            const res = await fetch(`/api/fitness/plans?status=${status}`);
            const json = await res.json();
            console.log('[fetchWeeklyPlan] API response:', json);
            if (Array.isArray(json) && json.length > 0) {
                // Get the most recent plan for this status
                const plan = json[0];
                console.log('[fetchWeeklyPlan] Setting plan:', plan);
                setWeeklyPlan(plan);
            } else {
                console.log('[fetchWeeklyPlan] No plans found for status:', status);
                setWeeklyPlan(null);
            }
        } catch (err) {
            console.error('[fetchWeeklyPlan] Failed to fetch weekly plan:', err);
            setWeeklyPlan(null);
        } finally {
            setPlanLoading(false);
        }
    };

    useEffect(() => {
        // Load fitness status from database for the current user
        const loadFitnessStatus = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    return;
                }

                const user = JSON.parse(userStr);

                const res = await fetch(`/api/fitness?userId=${user.id}`);
                const data = await res.json();
                
                if (data?.status && (data.status === 'Fit' || data.status === 'Unfit')) {
                    setFitnessStatus(data.status);
                    console.log('Loaded fitness status from database:', data.status);
                }
            } catch (error) {
                console.error('Failed to load fitness status:', error);
            }
        };

        loadFitnessStatus();
    }, []);

    useEffect(() => {
        // Fetch weekly plan whenever fitness status changes
        fetchWeeklyPlan(fitnessStatus);
    }, [fitnessStatus]);

    // day selector (Sunday-first)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const getTodayName = () => days[new Date().getDay()];
    const [selectedDay, setSelectedDay] = useState<string>(getTodayName());

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Fitness Dashboard</h1>
                <p className="text-gray-500 mt-1">Track your performance and progress</p>
                <div className="mt-4 flex items-center gap-4 flex-wrap">
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className={`px-3 py-1 rounded-full shadow-sm text-sm ${fitnessStatus === 'Fit' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {fitnessStatus}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Recent Test Results removed */}

                    {/* Weekly Plan from Database - NOW IN MAIN AREA */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Your Weekly Routine</CardTitle>
                            <CardDescription>
                                {weeklyPlan ? `${weeklyPlan.title} for ${weeklyPlan.status} Soldiers` : `Routine for ${fitnessStatus} Soldiers`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {planLoading ? (
                                <p className="text-sm text-gray-500">Loading routine...</p>
                            ) : weeklyPlan ? (
                                <>
                                    {/* Day Selector - like Workout Plan */}
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="text-sm block mb-1">Select weekday</label>
                                            <select 
                                                value={selectedDay} 
                                                onChange={(e) => setSelectedDay(e.target.value)} 
                                                className="border px-3 py-2 rounded-md shadow-sm w-full"
                                            >
                                                {days.map((d) => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Exercise List for Selected Day - like Workout Plan */}
                                    <div className="space-y-4">
                                        {Array.isArray(weeklyPlan.exercises) && weeklyPlan.exercises.length > 0 ? (
                                            (() => {
                                                const dayPlan = weeklyPlan.exercises.find((d: Record<string, unknown>) => String(d.day).toLowerCase() === selectedDay.toLowerCase()) as { day: string; items: Array<Record<string, unknown>> } | undefined;
                                                if (!dayPlan || !Array.isArray(dayPlan.items) || dayPlan.items.length === 0) {
                                                    return <p className="text-center text-gray-500 py-6">Rest Day</p>;
                                                }
                                                return dayPlan.items.map((exercise: Record<string, unknown>, index: number) => (
                                                    <div key={index}>
                                                        <div className="flex items-center justify-between py-3">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`p-2 rounded-lg ${fitnessStatus === 'Fit' ? 'bg-linear-to-br from-green-50 to-green-100' : 'bg-linear-to-br from-orange-50 to-orange-100'}`}>
                                                                    <Dumbbell className={`h-5 w-5 ${fitnessStatus === 'Fit' ? 'text-green-600' : 'text-orange-600'}`} />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">{String(exercise.name)}</h3>
                                                                    <p className="text-sm text-gray-500">{String(exercise.focus ?? '')}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-700">{String(exercise.duration ?? '')}</p>
                                                            </div>
                                                        </div>
                                                        {index !== dayPlan.items.length - 1 && <Separator />}
                                                    </div>
                                                ));
                                            })()
                                        ) : (
                                            <p className="text-center text-gray-500 py-6">No exercises found</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-3">No routine assigned yet for {fitnessStatus} soldiers.</p>
                                    <p className="text-sm text-gray-500">Contact your adjutant to create and assign a weekly routine.</p>
                                </div>
                            )}
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