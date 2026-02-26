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
    UserPlus,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2,
    Trash2,
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

interface PendingSoldier {
    id: string;
    serviceNo: string;
    name: string;
    rank: string;
    email: string;
    unit: string;
    age: number | null;
    height: number | null;
    weight: number | null;
    medicalCategory: string | null;
}

export default function SoldiersPage() {
    const [soldiers, setSoldiers] = useState<Soldier[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingSoldiers, setPendingSoldiers] = useState<PendingSoldier[]>([]);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // soldierId being processed
    const [removeLoading, setRemoveLoading] = useState<string | null>(null); // soldierId being removed

    // Fetch approved soldiers from database
    useEffect(() => {
        const fetchSoldiers = async () => {
            try {
                const res = await fetch('/api/soldiers?pending=false');
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

    // Fetch pending (unapproved) soldiers
    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await fetch('/api/soldiers?pending=true');
                if (res.ok) {
                    const data = await res.json();
                    setPendingSoldiers(data || []);
                }
            } catch (err) {
                console.error('Failed to fetch pending soldiers', err);
            } finally {
                setPendingLoading(false);
            }
        };
        fetchPending();
    }, []);

    // Approve or reject a pending soldier
    const handleAction = async (soldierId: string, action: "approve" | "reject") => {
        setActionLoading(soldierId);
        try {
            const res = await fetch('/api/soldiers/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soldierId, action }),
            });

            if (res.ok) {
                await res.json();
                // Remove from pending list
                setPendingSoldiers(prev => prev.filter(s => s.id !== soldierId));
                
                // If approved, re-fetch the approved soldiers list
                if (action === 'approve') {
                    const approvedRes = await fetch('/api/soldiers?pending=false');
                    if (approvedRes.ok) {
                        const approvedData = await approvedRes.json();
                        setSoldiers(approvedData || []);
                    }
                }
            }
        } catch (err) {
            console.error(`Failed to ${action} soldier`, err);
        } finally {
            setActionLoading(null);
        }
    };

    // Remove a soldier permanently from the database
    const handleRemoveSoldier = async (soldierId: string, soldierName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to permanently remove "${soldierName}"?\n\nThis will delete all their data including fitness tests, assigned plans, and login sessions. This action cannot be undone.`
        );
        if (!confirmed) return;

        setRemoveLoading(soldierId);
        try {
            const res = await fetch('/api/soldiers', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soldierId }),
            });

            if (res.ok) {
                // Remove from local state
                setSoldiers(prev => prev.filter(s => s.id !== soldierId));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to remove soldier');
            }
        } catch (err) {
            console.error('Failed to remove soldier', err);
            alert('An error occurred while removing the soldier');
        } finally {
            setRemoveLoading(null);
        }
    };

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
        if (bmi === null) return { status: "—", color: "text-slate-500" };
        if (bmi < 18.5) return { status: "Underweight", color: "text-blue-400" };
        if (bmi < 25) return { status: "Normal", color: "text-emerald-400" };
        if (bmi < 30) return { status: "Overweight", color: "text-orange-400" };
        return { status: "Obese", color: "text-red-400" };
    };

    const fitCount = soldiers.filter(s => s.fitnessStatus === "Fit").length;
    const unfitCount = soldiers.filter(s => s.fitnessStatus === "Unfit").length;

    return (
        <div className="min-h-screen bg-[#020617] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div>
                    <h1 className="text-3xl font-bold text-white">Soldiers Management</h1>
                    <p className="text-slate-400 mt-1">
                        Monitor and manage all soldiers&apos; fitness and health records
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                <UserCheck className="h-4 w-4 text-emerald-400" />
                                Fit
                            </CardDescription>
                            <CardTitle className="text-2xl text-emerald-400">{fitCount}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2">
                                <UserX className="h-4 w-4 text-red-400" />
                                Unfit
                            </CardDescription>
                            <CardTitle className="text-2xl text-red-400">{unfitCount}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-400" />
                                Pending Approval
                            </CardDescription>
                            <CardTitle className="text-2xl text-amber-400">{pendingSoldiers.length}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* ── New Soldier Requests (Pending Approval) ── */}
                <Card className="bg-white/[0.07] backdrop-blur-2xl border border-white/[0.1] rounded-2xl overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <UserPlus className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-white">New Soldier Requests</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        Soldiers awaiting your approval to access the system
                                    </CardDescription>
                                </div>
                            </div>
                            {pendingSoldiers.length > 0 && (
                                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1">
                                    {pendingSoldiers.length} Pending
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pendingLoading ? (
                            <div className="flex items-center justify-center py-10 gap-3 text-slate-400">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Loading pending requests...</span>
                            </div>
                        ) : pendingSoldiers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                </div>
                                <p className="text-slate-400 text-sm">No pending soldier requests</p>
                                <p className="text-slate-500 text-xs">All soldier accounts have been reviewed</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingSoldiers.map((soldier) => (
                                    <div
                                        key={soldier.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                                <span className="text-amber-400 font-bold text-sm">
                                                    {soldier.name?.charAt(0)?.toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            {/* Info */}
                                            <div className="space-y-0.5">
                                                <p className="text-white font-semibold text-sm">{soldier.name}</p>
                                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                                    <span className="font-mono">{soldier.serviceNo}</span>
                                                    <span>•</span>
                                                    <span>{soldier.rank}</span>
                                                    <span>•</span>
                                                    <span>{soldier.unit}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span>{soldier.email}</span>
                                                    {soldier.medicalCategory && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Cat {soldier.medicalCategory}</span>
                                                        </>
                                                    )}
                                                    {soldier.height && soldier.weight && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{soldier.height}cm / {soldier.weight}kg</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 cursor-pointer transition-all duration-200 shadow-lg shadow-emerald-500/20"
                                                disabled={actionLoading === soldier.id}
                                                onClick={() => handleAction(soldier.id, 'approve')}
                                            >
                                                {actionLoading === soldier.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                ) : (
                                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                                )}
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg px-4 cursor-pointer transition-all duration-200"
                                                disabled={actionLoading === soldier.id}
                                                onClick={() => handleAction(soldier.id, 'reject')}
                                            >
                                                {actionLoading === soldier.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                )}
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

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
                                        <tr className="border-b border-white/[0.1] text-left">
                                            <th className="py-3 px-4 font-semibold text-slate-300">#</th>
                                            <th className="py-3 px-4 font-semibold text-slate-300">Service No</th>
                                            <th className="py-3 px-4 font-semibold text-slate-300">Name</th>
                                            <th className="py-3 px-4 font-semibold text-slate-300">Rank</th>
                                            <th className="py-3 px-4 font-semibold text-slate-300">Age</th>
                                            <th className="py-3 px-4 font-semibold text-slate-300">BMI</th>
                                            <th className="py-3 px-4 font-semibold text-slate-300">Medical Cat.</th>
                                            <th className="py-3 px-4 font-semibold text-slate-300">Fitness Status</th>
                                            <th className="py-3 px-4 font-semibold text-slate-300 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSoldiers.map((soldier, idx) => (
                                            <tr key={soldier.id} className="border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                                                <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                                                <td className="py-3 px-4 font-mono text-sm text-slate-300">{soldier.serviceNo}</td>
                                                <td className="py-3 px-4 font-medium text-white">{soldier.name}</td>
                                                <td className="py-3 px-4 text-slate-300">{soldier.rank}</td>
                                                <td className="py-3 px-4 text-slate-300">{soldier.age ?? '—'}</td>
                                                <td className="py-3 px-4">
                                                    {soldier.bmi !== null ? (
                                                        <span className={getBMIStatus(soldier.bmi).color}>
                                                            {soldier.bmi.toFixed(1)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {soldier.medicalCategory ? (
                                                        <Badge variant="outline">{soldier.medicalCategory}</Badge>
                                                    ) : (
                                                        <span className="text-slate-500">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">{getStatusBadge(soldier.fitnessStatus)}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg px-3 cursor-pointer transition-all duration-200"
                                                        disabled={removeLoading === soldier.id}
                                                        onClick={() => handleRemoveSoldier(soldier.id, soldier.name)}
                                                    >
                                                        {removeLoading === soldier.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                        )}
                                                        Remove
                                                    </Button>
                                                </td>
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
