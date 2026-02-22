"use client";

import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import SoldiersList from "../SoldiersList";


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
        soldierName: "Sgt. Rahman",
        serviceNo: "202114190",
        rank: "Sergeant",
        testDate: "2026-01-05",
        testType: "IPFT",
        score: 537,
        result: "Pass"
    },
    {
        id: "2",
        soldierName: "Sgt. Ahmed",
        serviceNo: "202114193",
        rank: "Sergeant",
        testDate: "2026-01-04",
        testType: "Monthly",
        score: 392,
        result: "Fail"
    },
    {
        id: "3",
        soldierName: "sgt. Hassan",
        serviceNo: "202114194",
        rank: "Sergeant",
        testDate: "2026-01-03",
        testType: "Quarterly",
        score: 562,
        result: "Pass"
    }
];

const mockHighRiskSoldiers: HighRiskSoldier[] = [
    {
        id: "1",
        name: "Sgt. Ahmed",
        serviceNo: "202114193",
        rank: "Sergeant",
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
        name: "sgt. Karim",
        serviceNo: "202114198",
        rank: "Sergeant",
        riskType: "Medical",
        status: "Medical Category: C",
        lastTestScore: 412
    }
];

// Additional mock soldiers list for filtering demo (Clerk)
interface SoldierItem {
    id: string;
    name: string;
    serviceNo: string;
    rank: string;
    fitnessStatus: "Fit" | "At Risk" | "Unfit";
}

const mockSoldiers: SoldierItem[] = [
    { id: "S001", name: "sgt. Rahman", serviceNo: "202114190", rank: "Sergeant", fitnessStatus: "Fit" },
    { id: "S002", name: "Sgt. Ahmed", serviceNo: "202114193", rank: "Sergeant", fitnessStatus: "Unfit" },
    { id: "S003", name: "Capt. Hassan", serviceNo: "202114194", rank: "Captain", fitnessStatus: "Fit" },
    { id: "S004", name: "Sgt. Khan", serviceNo: "202114201", rank: "Sergeant", fitnessStatus: "At Risk" },
    { id: "S005", name: "Cpl. Hasan", serviceNo: "202114205", rank: "Corporal", fitnessStatus: "At Risk" },
    { id: "S006", name: "Sgt. Karim", serviceNo: "202114198", rank: "Sergeant", fitnessStatus: "Fit" }
];

export default function ClerkHomePage() {
    const [stats] = useState<UnitStats>(mockUnitStats);
    const [recentTests] = useState<RecentTest[]>(mockRecentTests);
    const [highRiskSoldiers] = useState<HighRiskSoldier[]>(mockHighRiskSoldiers);
    const [soldiers] = useState<SoldierItem[]>(mockSoldiers);

    // Filters
    const [serviceNoFilter, setServiceNoFilter] = useState("");
    const [rankFilter, setRankFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Quick filters and scrolling
    const [showHighRisk, setShowHighRisk] = useState(false);
    const [pendingOnly, setPendingOnly] = useState(false);
    const soldiersRef = useRef<HTMLDivElement | null>(null);

    const handleQuickFilter = (filter: "fit" | "unfit" | "pending" | "highrisk" | "all") => {
        setShowHighRisk(false);
        setPendingOnly(false);
        setStatusFilter("all");
        // clear other simple filters when using quick filters
        if (filter === "fit") setStatusFilter("Fit");
        if (filter === "unfit") setStatusFilter("Unfit");
        if (filter === "pending") setPendingOnly(true);
        if (filter === "highrisk") setShowHighRisk(true);

        // Ensure soldiers section is visible
        setTimeout(() => soldiersRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    // Derived filtered list (memoized for performance)
    const filteredSoldiers = useMemo(() => {
        return soldiers.filter((s) => {
            const matchesService = serviceNoFilter.trim() === "" || s.serviceNo.toLowerCase().includes(serviceNoFilter.trim().toLowerCase());
            const matchesRank = rankFilter === "all" || s.rank === rankFilter;
            const matchesStatus = statusFilter === "all" || s.fitnessStatus === statusFilter;
            const matchesPending = !pendingOnly || recentTests.some(t => t.serviceNo === s.serviceNo);
            const matchesHighRisk = !showHighRisk || highRiskSoldiers.some(h => h.serviceNo === s.serviceNo);
            return matchesService && matchesRank && matchesStatus && matchesPending && matchesHighRisk;
        });
    }, [soldiers, serviceNoFilter, rankFilter, statusFilter, pendingOnly, showHighRisk, recentTests, highRiskSoldiers]);

    // Unique ranks for the select (memoized)
    const uniqueRanks = useMemo(() => Array.from(new Set(soldiers.map(s => s.rank))), [soldiers]);

    const fitnessPercentage = useMemo(() => ((stats.fitSoldiers / stats.totalSoldiers) * 100).toFixed(1), [stats.fitSoldiers, stats.totalSoldiers]);
    const unfitnessPercentage = useMemo(() => ((stats.unfitSoldiers / stats.totalSoldiers) * 100).toFixed(1), [stats.unfitSoldiers, stats.totalSoldiers]);

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
                    {overviewCards.map((card, index) => {
                        if (card.title === "Total Soldiers") {
                            return (
                                <Link key={index} href="/dashboard/clerk/soldiers" className="block">
                                    <Card className={`${card.bgColor} cursor-pointer hover:shadow-md`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl">{card.icon}</span>
                                            </div>
                                            <CardDescription className="text-gray-600">{card.title}</CardDescription>
                                            <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            );
                        }

                        if (card.title === "Fit Soldiers") {
                            return (
                                <div key={index} onClick={() => handleQuickFilter("fit")} className="cursor-pointer">
                                    <Card className={`${card.bgColor} hover:shadow-md`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl">{card.icon}</span>
                                            </div>
                                            <CardDescription className="text-gray-600">{card.title}</CardDescription>
                                            <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                </div>
                            );
                        }

                        if (card.title === "Pending Tests") {
                            return (
                                <div key={index} onClick={() => handleQuickFilter("pending")} className="cursor-pointer">
                                    <Card className={`${card.bgColor} hover:shadow-md`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl">{card.icon}</span>
                                            </div>
                                            <CardDescription className="text-gray-600">{card.title}</CardDescription>
                                            <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                </div>
                            );
                        }

                        if (card.title === "High Risk Soldiers") {
                            return (
                                <div key={index} onClick={() => handleQuickFilter("highrisk")} className="cursor-pointer">
                                    <Card className={`${card.bgColor} hover:shadow-md`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl">{card.icon}</span>
                                            </div>
                                            <CardDescription className="text-gray-600">{card.title}</CardDescription>
                                            <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                </div>
                            );
                        }

                        // default static card
                        return (
                            <Card key={index} className={card.bgColor}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">{card.icon}</span>
                                    </div>
                                    <CardDescription className="text-gray-600">{card.title}</CardDescription>
                                    <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
                
                {/* Soldiers List with Filters */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Soldiers</CardTitle>
                                <CardDescription>Filter soldiers by Service No, Rank or Fitness Status</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                type="text"
                                placeholder="Search by service no"
                                className="w-full border px-3 py-2 rounded"
                                value={serviceNoFilter}
                                onChange={(e) => setServiceNoFilter(e.target.value)}
                            />
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={rankFilter}
                                onChange={(e) => setRankFilter(e.target.value)}
                            >
                                <option value="all">All Ranks</option>
                                {uniqueRanks.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="Fit">Fit</option>
                                <option value="At Risk">At Risk</option>
                                <option value="Unfit">Unfit</option>
                            </select>
                        </div>

                        <div>
                            {filteredSoldiers.length === 0 ? (
                                <p className="text-sm text-gray-600">No soldiers found matching your filters.</p>
                            ) : (
                                <SoldiersList items={filteredSoldiers} />
                            )}
                        </div>
                    </CardContent>
                </Card>
               

                <div ref={soldiersRef}>
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
                </div>

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
