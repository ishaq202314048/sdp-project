"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface FitnessTest {
    id: string;
    exerciseName: string;
    result: string;
    score: number | null;
    createdAt: string;
}

export default function ProgressPage() {
    const [tests, setTests] = useState<FitnessTest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const userStr = localStorage.getItem("user");
                if (!userStr) { setLoading(false); return; }
                const user = JSON.parse(userStr);
                if (user.userType !== "soldier") { setLoading(false); return; }

                const res = await fetch(`/api/soldier-fitness-tests?userId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTests(data.tests || []);
                }
            } catch (err) {
                console.error("Failed to fetch tests", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    // --- Compute summary cards from real data ---
    const totalTests = tests.length;
    const passedTests = tests.filter(t => t.result === "Pass").length;
    const failedTests = totalTests - passedTests;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    // Streak: consecutive passes from most recent
    let streak = 0;
    const sorted = [...tests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    for (const t of sorted) {
        if (t.result === "Pass") streak++;
        else break;
    }

    const summaryCards = [
        {
            title: "Pass Rate",
            value: totalTests > 0 ? `${passRate}%` : "—",
            subtitle: totalTests > 0 ? `${passedTests} passed, ${failedTests} failed` : "No tests yet",
        },
        {
            title: "Total Tests",
            value: totalTests > 0 ? `${totalTests}` : "—",
            subtitle: totalTests > 0 ? `${passedTests} Pass / ${failedTests} Fail` : "No tests yet",
        },
        {
            title: "Current Streak",
            value: streak > 0 ? `${streak}` : "0",
            subtitle: streak > 0 ? `${streak} consecutive passes` : "No current streak",
        },
    ];

    // --- Build Overall Score chart: group tests by date, calculate pass rate per date ---
    const buildOverallChart = () => {
        const byDate = new Map<string, { pass: number; total: number }>();
        for (const t of sorted) {
            const dateKey = new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            if (!byDate.has(dateKey)) byDate.set(dateKey, { pass: 0, total: 0 });
            const entry = byDate.get(dateKey)!;
            entry.total++;
            if (t.result === "Pass") entry.pass++;
        }
        return Array.from(byDate.entries())
            .reverse()
            .map(([date, { pass, total }]) => ({
                date,
                score: Math.round((pass / total) * 100),
            }));
    };

    const overallScoreData = buildOverallChart();

    // --- Build per-exercise charts: group by exercise name, show Pass=1 / Fail=0 over time ---
    const buildExerciseCharts = () => {
        const exerciseMap = new Map<string, FitnessTest[]>();
        for (const t of tests) {
            const name = t.exerciseName;
            if (!exerciseMap.has(name)) exerciseMap.set(name, []);
            exerciseMap.get(name)!.push(t);
        }

        const colors = ["#3b82f6", "#f59e0b", "#ec4899", "#10b981", "#8b5cf6", "#06b6d4", "#ef4444", "#6366f1"];
        let colorIdx = 0;

        return Array.from(exerciseMap.entries()).map(([name, exTests]) => {
            const sortedEx = [...exTests].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            const data = sortedEx.map(t => ({
                date: new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                value: t.result === "Pass" ? 1 : 0,
                result: t.result,
            }));
            const passed = exTests.filter(t => t.result === "Pass").length;
            const color = colors[colorIdx % colors.length];
            colorIdx++;
            return {
                title: name,
                subtitle: `${passed}/${exTests.length} passed`,
                color,
                data,
            };
        });
    };

    const exerciseCharts = buildExerciseCharts();

    // Custom tooltip for exercise charts
    const ExerciseTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: { result: string } }>; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-2 rounded shadow border text-sm">
                    <p className="text-gray-600">{label}</p>
                    <p className={payload[0].payload.result === "Pass" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {payload[0].payload.result}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold">Progress Tracking</h1>
                <p className="text-gray-500 mt-4">Loading your progress data...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Progress Tracking</h1>
                <p className="text-gray-500 mt-1">Monitor your fitness journey and achievements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryCards.map((card, index) => (
                    <Card key={index}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <div className="text-2xl font-bold">{card.value}</div>
                                <p className="text-xs text-gray-500 mt-2">{card.subtitle}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Overall Score Chart */}
            {overallScoreData.length > 0 ? (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Overall Pass Rate</CardTitle>
                            <Badge className={passRate >= 50 ? "bg-green-500" : "bg-red-500"}>
                                {passRate}% Pass Rate
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={overallScoreData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Pass Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center">
                            <p className="text-gray-500">No test data available yet. Complete fitness tests to see your progress.</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Per-Exercise Charts */}
            {exerciseCharts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {exerciseCharts.map((exercise, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{exercise.title}</CardTitle>
                                <p className="text-sm text-gray-500">{exercise.subtitle}</p>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={exercise.data}>
                                        <defs>
                                            <linearGradient id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={exercise.color} stopOpacity={0.8} />
                                                <stop offset="95%" stopColor={exercise.color} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={(v) => v === 1 ? "Pass" : "Fail"} />
                                        <Tooltip content={<ExerciseTooltip />} />
                                        <Area
                                            type="stepAfter"
                                            dataKey="value"
                                            stroke={exercise.color}
                                            fillOpacity={1}
                                            fill={`url(#color${index})`}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Exercise Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center">
                            <p className="text-gray-500">No exercise data available yet.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
