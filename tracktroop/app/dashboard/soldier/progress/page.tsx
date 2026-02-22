"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// removed decorative icons from summary cards per request
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function ProgressPage() {
    const overallScoreData = [
        { month: "Jul", score: 78 },
        { month: "Aug", score: 80 },
        { month: "Sep", score: 82 },
        { month: "Oct", score: 84 },
        { month: "Nov", score: 85 },
        { month: "Dec", score: 87 },
    ];

    const exerciseCharts = [
        {
            title: "Mile Run",
            subtitle: "Time in minutes",
            color: "#3b82f6",
            dataKey: "value",
            data: [
                { month: "Jul", value: 9.2 },
                { month: "Aug", value: 9.0 },
                { month: "Sep", value: 8.8 },
                { month: "Oct", value: 8.7 },
                { month: "Nov", value: 8.5 },
                { month: "Dec", value: 8.5 },
            ]
        },
        {
            title: "Push-ups",
            subtitle: "Repetitions",
            color: "#f59e0b",
            dataKey: "value",
            data: [
                { month: "Jul", value: 38 },
                { month: "Aug", value: 40 },
                { month: "Sep", value: 41 },
                { month: "Oct", value: 43 },
                { month: "Nov", value: 42 },
                { month: "Dec", value: 45 },
            ]
        },
        {
            title: "Sit-ups",
            subtitle: "Repetitions",
            color: "#ec4899",
            dataKey: "value",
            data: [
                { month: "Jul", value: 46 },
                { month: "Aug", value: 48 },
                { month: "Sep", value: 49 },
                { month: "Oct", value: 50 },
                { month: "Nov", value: 51 },
                { month: "Dec", value: 52 },
            ]
        },
        {
            title: "Pull-ups",
            subtitle: "Repetitions",
            color: "#10b981",
            dataKey: "value",
            data: [
                { month: "Jul", value: 9 },
                { month: "Aug", value: 10 },
                { month: "Sep", value: 10 },
                { month: "Oct", value: 11 },
                { month: "Nov", value: 11 },
                { month: "Dec", value: 12 },
            ]
        },
        {
            title: "Rope Climbing",
            subtitle: "Time in seconds",
            color: "#8b5cf6",
            dataKey: "value",
            data: [
                { month: "Jul", value: 9 },
                { month: "Aug", value: 7 },
                { month: "Sep", value: 7 },
                { month: "Oct", value: 8 },
                { month: "Nov", value: 11 },
                { month: "Dec", value: 10 },
            ]
        },
        {
            title: "Swimming",
            subtitle: "Time in minutes",
            color: "#06b6d4",
            dataKey: "value",
            data: [
                { month: "Jul", value: 9 },
                { month: "Aug", value: 10 },
                { month: "Sep", value: 10 },
                { month: "Oct", value: 11 },
                { month: "Nov", value: 11 },
                { month: "Dec", value: 12 },
            ]
        },
    ];

    const summaryCards = [
        {
            title: "Overall Improvement",
            value: "+9%",
            subtitle: "Last 6 Months",
        },
        {
            title: "Current Streak",
            value: "6",
            subtitle: "Tests Passed",
        },
        {
            title: "Goals Achieved",
            value: "6/6",
            subtitle: "This Month",
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Progress Tracking</h1>
                <p className="text-gray-500 mt-1">Monitor your fitness journey and achievements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryCards.map((card, index) => {
                    return (
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
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Overall Fitness Score</CardTitle>
                        <Badge className="bg-green-500">+9% Improvement</Badge>
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
                            <XAxis dataKey="month" />
                            <YAxis domain={[70, 100]} />
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {exerciseCharts
                    .filter(exercise => exercise.data.length > 0)
                    .map((exercise, index) => (
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
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey={exercise.dataKey}
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

        </div>
    );
}
