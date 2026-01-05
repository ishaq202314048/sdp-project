"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Activity,
    User,
    Trophy,
    TrendingUp,
    Calendar,
    Heart,
    AlertCircle,
    FileText,
    Dumbbell,
    Target,
    Timer
} from "lucide-react";

export default function SoldierHomePage() {
    const soldierData = {
        name: "Lt. John Doe",
        serviceNo: "BD-12345",
        rank: "Lieutenant",
        age: 28,
        height: "175 cm",
        weight: "72 kg",
        bmi: 23.5,
        medicalCategory: "A",
        fitnessStatus: "Fit",
        lastIPFT: "2025-11-15",
        nextIPFT: "2026-02-15",
    };

    const recentTests = [
        { name: "Mile Run", score: "8:30 min", status: "Pass", date: "2025-12-20" },
        { name: "Push-ups", score: "45 reps", status: "Pass", date: "2025-12-18" },
        { name: "Sit-ups", score: "52 reps", status: "Pass", date: "2025-12-18" },
        { name: "Pull-ups", score: "12 reps", status: "Pass", date: "2025-12-15" },
    ];

    const upcomingActivities = [
        { name: "Monthly Mile Test", date: "2026-01-10", type: "Required" },
        { name: "Swimming Assessment", date: "2026-01-15", type: "Optional" },
        { name: "Unit Fitness Training", date: "2026-01-08", type: "Scheduled" },
    ];

    const notifications = [
        { message: "IPFT scheduled for Feb 15, 2026", type: "reminder", icon: Calendar },
        { message: "Maintain your excellent fitness record", type: "success", icon: Trophy },
        { message: "Update your nutrition plan", type: "info", icon: Heart },
    ];

    const quickStats = [
        {
            icon: User,
            title: "Personal Info",
            value: `${soldierData.age} years`,
            subtitle: `${soldierData.height} | ${soldierData.weight}`,
            gradient: "from-blue-500 to-blue-600",
        },
        {
            icon: Activity,
            title: "BMI Status",
            value: soldierData.bmi.toString(),
            subtitle: "Normal Range",
            gradient: "from-emerald-500 to-emerald-600",
        },
        {
            icon: Heart,
            title: "Medical Category",
            value: `Category ${soldierData.medicalCategory}`,
            subtitle: "Fully Fit",
            gradient: "from-purple-500 to-purple-600",
        },
        {
            icon: Calendar,
            title: "Next IPFT",
            value: "Feb 15",
            subtitle: "41 days remaining",
            gradient: "from-orange-500 to-orange-600",
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Welcome back, {soldierData.name}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Service No: {soldierData.serviceNo} | Rank: {soldierData.rank}
                        </p>
                    </div>
                    <Badge
                        variant={soldierData.fitnessStatus === "Fit" ? "default" : "destructive"}
                        className={`px-4 py-2 text-lg bg-white border hover:text-white cursor-pointer ${soldierData.fitnessStatus === 'Fit' ? 'border-green-500 text-green-600 hover:bg-green-600' : 'border-red-600 text-red-600 hover:bg-red-600'}`}
                    >
                        {soldierData.fitnessStatus}
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
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-emerald-600" />
                                    Recent Fitness Tests
                                </CardTitle>
                                <CardDescription>Your latest performance results</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentTests.map((test, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                    <Dumbbell className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{test.name}</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{test.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 dark:text-white">{test.score}</p>
                                                <Badge variant="default" className="bg-emerald-500">
                                                    {test.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
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
                                    {notifications.map((notification, index) => {
                                        const Icon = notification.icon;
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                                            >
                                                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        );
                                    })}
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
                                    {upcomingActivities.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                    {activity.name}
                                                </p>
                                                <Badge variant="outline" className="text-xs">
                                                    {activity.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {activity.date}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-purple-600" />
                                    Quick Action
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full justify-start" variant="outline">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Download Reports
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
