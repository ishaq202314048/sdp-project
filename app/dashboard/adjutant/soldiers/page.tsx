"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    UserCheck,
    UserX,
    Users,
} from "lucide-react";

interface Soldier {
    id: string;
    serviceNo: string;
    name: string;
    rank: string;
    email: string;
    unit: string;
    age: number | null;
    height: number | null;
    weight: number | null;
    bmi: number | null;
    medicalCategory: string | null;
    fitnessStatus: "Fit" | "Unfit";
}

export default function SoldiersPage() {
    const [soldiers, setSoldiers] = useState<Soldier[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch soldiers from database
    useEffect(() => {
        const fetchSoldiers = async () => {
            try {
                const res = await fetch('/api/soldiers');
                if (res.ok) {
                    const data = await res.json();
                    setSoldiers(data || []);
                }
            } catch (err) {
                console.error('Failed to fetch soldiers', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSoldiers();
    }, []);

    // Individual filter states
    const [filterServiceNo, setFilterServiceNo] = useState<string>("");
    const [filterName, setFilterName] = useState<string>("");
    const [filterRank, setFilterRank] = useState<string>("all");
    const [filterFitnessStatus, setFilterFitnessStatus] = useState<string>("all");

    const ranks = useMemo(() => Array.from(new Set(soldiers.map(s => s.rank).filter(r => r && r !== 'N/A'))), [soldiers]);

    const filteredSoldiers = useMemo(() => {
        return soldiers.filter((soldier) => {
            const matchesServiceNo = filterServiceNo.trim() === "" || soldier.serviceNo.toLowerCase().includes(filterServiceNo.trim().toLowerCase());
            const matchesName = filterName.trim() === "" || soldier.name.toLowerCase().includes(filterName.trim().toLowerCase());
            const matchesRank = filterRank === "all" || soldier.rank === filterRank;
            const matchesFitness = filterFitnessStatus === "all" || soldier.fitnessStatus === filterFitnessStatus;
            return matchesServiceNo && matchesName && matchesRank && matchesFitness;
        });
    }, [soldiers, filterServiceNo, filterName, filterRank, filterFitnessStatus]);

    const resetFilters = () => {
        setFilterServiceNo("");
        setFilterName("");
        setFilterRank("all");
        setFilterFitnessStatus("all");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Fit":
                return <Badge variant="default" className="bg-green-600 text-white">✓ Fit</Badge>;
            case "Unfit":
                return <Badge variant="destructive">✗ Unfit</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getBMIStatus = (bmi: number | null) => {
        if (bmi === null) return { status: "—", color: "text-gray-400" };
        if (bmi < 18.5) return { status: "Underweight", color: "text-blue-600" };
        if (bmi < 25) return { status: "Normal", color: "text-green-600" };
        if (bmi < 30) return { status: "Overweight", color: "text-orange-600" };
        return { status: "Obese", color: "text-red-600" };
    };

    const fitCount = soldiers.filter(s => s.fitnessStatus === "Fit").length;
    const unfitCount = soldiers.filter(s => s.fitnessStatus === "Unfit").length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div>
                    <h1 className="text-3xl font-bold">Soldiers Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage all soldiers&apos; fitness and health records
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Total Soldiers
                            </CardDescription>
                            <CardTitle className="text-2xl">{soldiers.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-green-600" />
                                Fit
                            </CardDescription>
                            <CardTitle className="text-2xl text-green-600">{fitCount}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2">
                                <UserX className="h-4 w-4 text-red-600" />
                                Unfit
                            </CardDescription>
                            <CardTitle className="text-2xl text-red-600">{unfitCount}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Soldiers List</CardTitle>
                        <CardDescription>
                            {loading ? 'Loading...' : `Showing ${filteredSoldiers.length} of ${soldiers.length} soldiers`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="space-y-2">
                                <Label htmlFor="serviceNo">Service No</Label>
                                <Input
                                    id="serviceNo"
                                    placeholder="e.g., BA-10234"
                                    value={filterServiceNo}
                                    onChange={(e) => setFilterServiceNo(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Search by name"
                                    value={filterName}
                                    onChange={(e) => setFilterName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rank">Rank</Label>
                                <Select value={filterRank} onValueChange={setFilterRank}>
                                    <SelectTrigger id="rank">
                                        <SelectValue placeholder="All ranks" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {ranks.map((r) => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fitness">Fitness Status</Label>
                                <Select value={filterFitnessStatus} onValueChange={setFilterFitnessStatus}>
                                    <SelectTrigger id="fitness">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="Fit">Fit</SelectItem>
                                        <SelectItem value="Unfit">Unfit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end mb-4">
                            <Button variant="outline" onClick={resetFilters} className="cursor-pointer">Reset filters</Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading soldiers...</div>
                        ) : filteredSoldiers.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No soldiers found matching your criteria
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="py-3 px-4 font-semibold">#</th>
                                            <th className="py-3 px-4 font-semibold">Service No</th>
                                            <th className="py-3 px-4 font-semibold">Name</th>
                                            <th className="py-3 px-4 font-semibold">Rank</th>
                                            <th className="py-3 px-4 font-semibold">Age</th>
                                            <th className="py-3 px-4 font-semibold">BMI</th>
                                            <th className="py-3 px-4 font-semibold">Medical Cat.</th>
                                            <th className="py-3 px-4 font-semibold">Fitness Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSoldiers.map((soldier, idx) => (
                                            <tr key={soldier.id} className="border-b hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                                                <td className="py-3 px-4 text-muted-foreground">{idx + 1}</td>
                                                <td className="py-3 px-4 font-mono text-sm">{soldier.serviceNo}</td>
                                                <td className="py-3 px-4 font-medium">{soldier.name}</td>
                                                <td className="py-3 px-4">{soldier.rank}</td>
                                                <td className="py-3 px-4">{soldier.age ?? '—'}</td>
                                                <td className="py-3 px-4">
                                                    {soldier.bmi !== null ? (
                                                        <span className={getBMIStatus(soldier.bmi).color}>
                                                            {soldier.bmi.toFixed(1)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {soldier.medicalCategory ? (
                                                        <Badge variant="outline">{soldier.medicalCategory}</Badge>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">{getStatusBadge(soldier.fitnessStatus)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
