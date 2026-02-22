"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Dumbbell } from "lucide-react";

export default function FitnessPage() {
    const fitnessTests = [
        { name: "Mile Run", score: "8:30 min", status: "Pass", date: "2025-12-20" },
        { name: "Push-ups", score: "45 reps", status: "Pass", date: "2025-12-18" },
        { name: "Sit-ups", score: "52 reps", status: "Pass", date: "2025-12-18" },
        { name: "Pull-ups", score: "12 reps", status: "Pass", date: "2025-12-15" },
        { name: "Rope Climbing", score: "18.5 sec", status: "Pass", date: "2025-12-10" },
        { name: "Swimming", score: "3:45 min", status: "Pass", date: "2025-12-05" },
    ];

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
            value: "Fit",
            subtitle: "Active",
            badgeColor: "bg-green-500"
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

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Fitness Dashboard</h1>
                <p className="text-gray-500 mt-1">Track your performance and progress</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Test Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {fitnessTests.map((test, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-green-100">
                                                    <Dumbbell className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">{test.name}</h3>
                                                        <Badge className="bg-green-500">{test.status}</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{test.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold">{test.score}</p>
                                            </div>
                                        </div>
                                        {index !== fitnessTests.length - 1 && <Separator />}
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