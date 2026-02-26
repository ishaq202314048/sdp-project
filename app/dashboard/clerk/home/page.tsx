"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import SoldiersList from "../SoldiersList";


// Types
interface UnitStats {
    totalSoldiers: number;
    fitSoldiers: number;
    unfitSoldiers: number;
}

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
    const [stats, setStats] = useState<UnitStats>({ totalSoldiers: 0, fitSoldiers: 0, unfitSoldiers: 0 });
    const [soldiers, setSoldiers] = useState<SoldierItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch soldiers from database on mount
    useEffect(() => {
        const fetchSoldiers = async () => {
            try {
                // Only fetch approved soldiers (pending=false)
                const response = await fetch('/api/soldiers?pending=false');
                if (response.ok) {
                    const data = await response.json();
                    setSoldiers(data);
                    
                    // Update stats based on fetched soldiers
                    const fitCount = data.filter((s: SoldierItem) => s.fitnessStatus === 'Fit').length;
                    const unfitCount = data.filter((s: SoldierItem) => s.fitnessStatus === 'Unfit').length;
                    
                    setStats({
                        totalSoldiers: data.length,
                        fitSoldiers: fitCount,
                        unfitSoldiers: unfitCount,
                    });
                } else {
                    // Fallback to mock data if API fails
                    setSoldiers(mockSoldiers);
                }
            } catch (error) {
                console.error('Failed to fetch soldiers:', error);
                // Fallback to mock data
                setSoldiers(mockSoldiers);
            } finally {
                setLoading(false);
            }
        };

        fetchSoldiers();
    }, []);

    // Filters
    const [serviceNoFilter, setServiceNoFilter] = useState("");
    const [rankFilter, setRankFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Quick filters and scrolling
    const soldiersRef = useRef<HTMLDivElement | null>(null);

    const handleQuickFilter = (filter: "fit" | "unfit" | "all") => {
        setStatusFilter("all");
        if (filter === "fit") setStatusFilter("Fit");
        if (filter === "unfit") setStatusFilter("Unfit");

        // Ensure soldiers section is visible
        setTimeout(() => soldiersRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    // Derived filtered list (memoized for performance)
    const filteredSoldiers = useMemo(() => {
        return soldiers.filter((s) => {
            const matchesService = serviceNoFilter.trim() === "" || s.serviceNo.toLowerCase().includes(serviceNoFilter.trim().toLowerCase());
            const matchesRank = rankFilter === "all" || s.rank === rankFilter;
            const matchesStatus = statusFilter === "all" || s.fitnessStatus === statusFilter;
            return matchesService && matchesRank && matchesStatus;
        });
    }, [soldiers, serviceNoFilter, rankFilter, statusFilter]);

    // Unique ranks for the select (memoized)
    const uniqueRanks = useMemo(() => Array.from(new Set(soldiers.map(s => s.rank))), [soldiers]);

    const fitnessPercentage = useMemo(() => ((stats.fitSoldiers / stats.totalSoldiers) * 100).toFixed(1), [stats.fitSoldiers, stats.totalSoldiers]);
    const unfitnessPercentage = useMemo(() => ((stats.unfitSoldiers / stats.totalSoldiers) * 100).toFixed(1), [stats.unfitSoldiers, stats.totalSoldiers]);

    const overviewCards = [
        {
            title: "Total Soldiers",
            value: stats.totalSoldiers,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10 border-blue-500/20",
            icon: "👥"
        },
        {
            title: "Fit Soldiers",
            value: `${stats.fitSoldiers} (${fitnessPercentage}%)`,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10 border-emerald-500/20",
            icon: "✓"
        },
        {
            title: "Unfit Soldiers",
            value: `${stats.unfitSoldiers} (${unfitnessPercentage}%)`,
            color: "text-red-400",
            bgColor: "bg-red-500/10 border-red-500/20",
            icon: "⚠"
        },
    ];

    return (
        <div className="min-h-screen bg-[#020617] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Command Dashboard</h1>
                        <p className="text-slate-400 mt-1">Unit readiness and fitness monitoring overview</p>
                    </div>
                </div>

                {/* Overview Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {overviewCards.map((card, index) => {
                        if (card.title === "Total Soldiers") {
                            return (
                                <Link key={index} href="/dashboard/clerk/soldiers" className="block">
                                    <Card className={`${card.bgColor} cursor-pointer hover:shadow-md`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl">{card.icon}</span>
                                            </div>
                                            <CardDescription className="text-slate-400">{card.title}</CardDescription>
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
                                            <CardDescription className="text-slate-400">{card.title}</CardDescription>
                                            <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                </div>
                            );
                        }

                        // Unfit Soldiers (default)
                        return (
                            <div key={index} onClick={() => handleQuickFilter("unfit")} className="cursor-pointer">
                                <Card className={`${card.bgColor} hover:shadow-md`}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl">{card.icon}</span>
                                        </div>
                                        <CardDescription className="text-slate-400">{card.title}</CardDescription>
                                        <CardTitle className={`text-2xl ${card.color}`}>{card.value}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>
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
                                className="w-full border border-white/[0.1] bg-white/[0.05] text-slate-200 placeholder-slate-500 px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 outline-none"
                                value={serviceNoFilter}
                                onChange={(e) => setServiceNoFilter(e.target.value)}
                            />
                            <select
                                className="w-full border border-white/[0.1] bg-white/[0.05] text-slate-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 outline-none"
                                value={rankFilter}
                                onChange={(e) => setRankFilter(e.target.value)}
                            >
                                <option value="all" className="bg-[#0c1425] text-slate-200">All Ranks</option>
                                {uniqueRanks.map((r) => (
                                    <option key={r} value={r} className="bg-[#0c1425] text-slate-200">{r}</option>
                                ))}
                            </select>
                            <select
                                className="w-full border border-white/[0.1] bg-white/[0.05] text-slate-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 outline-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all" className="bg-[#0c1425] text-slate-200">All Statuses</option>
                                <option value="Fit" className="bg-[#0c1425] text-slate-200">Fit</option>
                                <option value="At Risk" className="bg-[#0c1425] text-slate-200">At Risk</option>
                                <option value="Unfit" className="bg-[#0c1425] text-slate-200">Unfit</option>
                            </select>
                        </div>

                        <div>
                            {loading ? (
                                <p className="text-sm text-slate-400">Loading soldiers...</p>
                            ) : filteredSoldiers.length === 0 ? (
                                <p className="text-sm text-slate-400">No soldiers found matching your filters.</p>
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
                                    <span className="text-sm font-medium text-slate-300">Fit Soldiers</span>
                                    <span className="text-sm font-medium text-emerald-400">{fitnessPercentage}%</span>
                                </div>
                                <div className="w-full bg-white/[0.08] rounded-full h-3">
                                    <div
                                        className="bg-emerald-500 h-3 rounded-full transition-all"
                                        style={{ width: `${fitnessPercentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{stats.fitSoldiers} of {stats.totalSoldiers} soldiers</p>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-300">Unfit Soldiers</span>
                                    <span className="text-sm font-medium text-red-400">{unfitnessPercentage}%</span>
                                </div>
                                <div className="w-full bg-white/[0.08] rounded-full h-3">
                                    <div
                                        className="bg-red-500 h-3 rounded-full transition-all"
                                        style={{ width: `${unfitnessPercentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{stats.unfitSoldiers} soldiers need attention</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </div>


            </div>
        </div>
    );
}
