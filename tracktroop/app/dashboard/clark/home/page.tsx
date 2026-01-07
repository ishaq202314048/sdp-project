"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types
interface UnitStats {
    totalSoldiers: number;
    fitSoldiers: number;
    unfitSoldiers: number;
    averageFitnessScore: number;
    pendingTests: number;
    highRiskSoldiers: number;
}

interface RecentTest {
    id: string;
    soldierName: string;
    serviceNo: string;
    rank: string;
    testDate: string;
    testType: string;
    score: number;
    result: "Pass" | "Fail";
}

interface HighRiskSoldier {
    id: string;
    name: string;
    serviceNo: string;
    rank: string;
    riskType: "Injury" | "Obesity" | "Low Fitness" | "Medical";
    status: string;
    lastTestScore: number;
}

// Mock Data
const mockUnitStats: UnitStats = {
    totalSoldiers: 156,
    fitSoldiers: 128,
    unfitSoldiers: 28,
    averageFitnessScore: 482,
    pendingTests: 12,
    highRiskSoldiers: 8
};

const mockRecentTests: RecentTest[] = [
    {
        id: "1",
        soldierName: "Lt. Rahman",
        serviceNo: "202114190",
        rank: "Lieutenant",
        testDate: "2026-01-05",
        testType: "IPFT",
        score: 537,
        result: "Pass"
    },
    {
        id: "2",
        soldierName: "Lt. Ahmed",
        serviceNo: "202114193",
        rank: "Lieutenant",
        testDate: "2026-01-04",
        testType: "Monthly",
        score: 392,
        result: "Fail"
    },
    {
        id: "3",
        soldierName: "Capt. Hassan",
        serviceNo: "202114194",
        rank: "Captain",
        testDate: "2026-01-03",
        testType: "Quarterly",
        score: 562,
        result: "Pass"
    }
];

const mockHighRiskSoldiers: HighRiskSoldier[] = [
    {
        id: "1",
        name: "Lt. Ahmed",
        serviceNo: "202114193",
        rank: "Lieutenant",
        riskType: "Low Fitness",
        status: "3 consecutive failed tests",
        lastTestScore: 392
    },
    {
        id: "2",
        name: "Sgt. Khan",
        serviceNo: "202114201",
        rank: "Sergeant",
        riskType: "Obesity",
        status: "BMI 32.5 - Above standard",
        lastTestScore: 425
    },
    {
        id: "3",
        name: "Cpl. Hasan",
        serviceNo: "202114205",
        rank: "Corporal",
        riskType: "Injury",
        status: "Recovering from knee injury",
        lastTestScore: 0
    },
    {
        id: "4",
        name: "Lt. Karim",
        serviceNo: "202114198",
        rank: "Lieutenant",
        riskType: "Medical",
        status: "Medical Category: C",
        lastTestScore: 412
    }
];

export default function ClarkHomePage() {
    const [stats] = useState<UnitStats>(mockUnitStats);
    const [recentTests] = useState<RecentTest[]>(mockRecentTests);
    const [highRiskSoldiers] = useState<HighRiskSoldier[]>(mockHighRiskSoldiers);

    const fitnessPercentage = ((stats.fitSoldiers / stats.totalSoldiers) * 100).toFixed(1);
    const unfitnessPercentage = ((stats.unfitSoldiers / stats.totalSoldiers) * 100).toFixed(1);

    const overviewCards = [
        {
            title: "Total Soldiers",
            value: stats.totalSoldiers,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            icon: "👥"
        },
        {
            title: "Fit Soldiers",
            value: `${stats.fitSoldiers} (${fitnessPercentage}%)`,
            color: "text-green-600",
            bgColor: "bg-green-50",
            icon: "✓"
        },
        {
            title: "Unfit Soldiers",
            value: `${stats.unfitSoldiers} (${unfitnessPercentage}%)`,
            color: "text-red-600",
            bgColor: "bg-red-50",
            icon: "⚠"
        },
        {
            title: "Avg Fitness Score",
            value: stats.averageFitnessScore,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            icon: "📊"
        },
        {
            title: "Pending Tests",
            value: stats.pendingTests,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            icon: "⏳"
        },
        {
            title: "High Risk Soldiers",
            value: stats.highRiskSoldiers,
            color: "text-red-600",
            bgColor: "bg-red-50",
            icon: "🚨"
        }
    ];

    const getRiskTypeBadgeColor = (type: string) => {
        switch (type) {
            case "Injury": return "text-orange-600 bg-orange-50 border-orange-200";
            case "Obesity": return "text-red-600 bg-red-50 border-red-200";
            case "Low Fitness": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Medical": return "text-purple-600 bg-purple-50 border-purple-200";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Command Dashboard</h1>
                        <p className="text-gray-600 mt-1">Unit readiness and fitness monitoring overview</p>
                    </div>
                </div>

                {/* Overview Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {overviewCards.map((card, index) => (
                        <Card key={index} className={card.bgColor}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl">{card.icon}</span>
                                </div>
                                <CardDescription className="text-gray-600">{card.title}</CardDescription>
                                <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Unit Readiness Status</CardTitle>
                        <CardDescription>Overall fitness distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Fit Soldiers</span>
                                    <span className="text-sm font-medium text-green-600">{fitnessPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-600 h-3 rounded-full transition-all"
                                        style={{ width: `${fitnessPercentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{stats.fitSoldiers} of {stats.totalSoldiers} soldiers</p>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Unfit Soldiers</span>
                                    <span className="text-sm font-medium text-red-600">{unfitnessPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-red-600 h-3 rounded-full transition-all"
                                        style={{ width: `${unfitnessPercentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{stats.unfitSoldiers} soldiers need attention</p>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Average Score</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.averageFitnessScore}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pending Tests</p>
                                        <p className="text-2xl font-bold text-orange-600">{stats.pendingTests}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-red-900">High Risk Soldiers</CardTitle>
                                <CardDescription className="text-red-700">
                                    Soldiers requiring immediate attention and monitoring
                                </CardDescription>
                            </div>
                            <Badge variant="destructive" className="text-sm px-3 py-1">
                                {highRiskSoldiers.length} Alerts
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {highRiskSoldiers.map((soldier) => (
                                <div
                                    key={soldier.id}
                                    className="bg-white border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">{soldier.name}</h3>
                                                <Badge variant="outline">{soldier.rank}</Badge>
                                                <Badge className={getRiskTypeBadgeColor(soldier.riskType)}>
                                                    {soldier.riskType}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                                <span>Service No: {soldier.serviceNo}</span>
                                                <span>•</span>
                                                <span>{soldier.status}</span>
                                                {soldier.lastTestScore > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Last Score: {soldier.lastTestScore}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Fitness Tests */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Fitness Tests</CardTitle>
                                <CardDescription>Latest fitness assessment results</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentTests.map((test) => (
                                <div
                                    key={test.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">{test.soldierName}</h3>
                                                <Badge variant="outline">{test.rank}</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                                <span>Service No: {test.serviceNo}</span>
                                                <span>•</span>
                                                <span>Test Date: {new Date(test.testDate).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>Type: {test.testType}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Score</p>
                                                <p className="text-xl font-bold">{test.score}</p>
                                            </div>
                                            <Badge
                                                className={`text-sm py-1 px-3 text-white ${test.result === 'Pass' ? 'bg-green-600' : 'bg-red-600'}`}
                                            >
                                                {test.result}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
