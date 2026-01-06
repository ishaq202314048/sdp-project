"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    UserCheck,
    UserX,
    AlertTriangle,
} from "lucide-react";

interface Soldier {
    id: number;
    serviceNo: string;
    name: string;
    rank: string;
    age: number;
    height: number;
    weight: number;
    bmi: number;
    medicalCategory: "A" | "B" | "C" | "Temporary";
    fitnessStatus: "Fit" | "Unfit" | "At Risk";
    lastIPFT: string;
    nextIPFT: string;
    mileTime: string;
    pushUps: number;
    sitUps: number;
    pullUps: number;
    injuries: string[];
}

const mockSoldiers: Soldier[] = [
    {
        id: 1,
        serviceNo: "BA-10234",
        name: "Lt. Ahmed Khan",
        rank: "Lieutenant",
        age: 28,
        height: 175,
        weight: 72,
        bmi: 23.5,
        medicalCategory: "A",
        fitnessStatus: "Fit",
        lastIPFT: "Oct 15, 2025",
        nextIPFT: "Jan 15, 2026",
        mileTime: "6:45",
        pushUps: 65,
        sitUps: 72,
        pullUps: 18,
        injuries: []
    },
    {
        id: 2,
        serviceNo: "BA-10567",
        name: "Cpl. Rahman Ali",
        rank: "Corporal",
        age: 32,
        height: 170,
        weight: 85,
        bmi: 29.4,
        medicalCategory: "B",
        fitnessStatus: "At Risk",
        lastIPFT: "Nov 2, 2025",
        nextIPFT: "Feb 2, 2026",
        mileTime: "8:20",
        pushUps: 42,
        sitUps: 50,
        pullUps: 10,
        injuries: ["Knee strain - recovering"]
    },
    {
        id: 3,
        serviceNo: "BA-10892",
        name: "Sgt. Karim Hassan",
        rank: "Sergeant",
        age: 35,
        height: 178,
        weight: 95,
        bmi: 30.0,
        medicalCategory: "C",
        fitnessStatus: "Unfit",
        lastIPFT: "Sep 20, 2025",
        nextIPFT: "Dec 20, 2025",
        mileTime: "9:45",
        pushUps: 35,
        sitUps: 40,
        pullUps: 6,
        injuries: ["Shoulder injury", "Overweight"]
    },
    {
        id: 4,
        serviceNo: "BA-10123",
        name: "Pvt. Hasan Mahmud",
        rank: "Private",
        age: 24,
        height: 172,
        weight: 68,
        bmi: 23.0,
        medicalCategory: "A",
        fitnessStatus: "Fit",
        lastIPFT: "Nov 10, 2025",
        nextIPFT: "Feb 10, 2026",
        mileTime: "6:30",
        pushUps: 70,
        sitUps: 75,
        pullUps: 20,
        injuries: []
    },
    {
        id: 5,
        serviceNo: "BA-10445",
        name: "Lt. Nusrat Jahan",
        rank: "Lieutenant",
        age: 27,
        height: 165,
        weight: 62,
        bmi: 22.8,
        medicalCategory: "A",
        fitnessStatus: "Fit",
        lastIPFT: "Oct 25, 2025",
        nextIPFT: "Jan 25, 2026",
        mileTime: "7:15",
        pushUps: 55,
        sitUps: 68,
        pullUps: 15,
        injuries: []
    },
    {
        id: 6,
        serviceNo: "BA-10678",
        name: "Cpl. Rafiq Islam",
        rank: "Corporal",
        age: 30,
        height: 168,
        weight: 78,
        bmi: 27.6,
        medicalCategory: "B",
        fitnessStatus: "At Risk",
        lastIPFT: "Nov 15, 2025",
        nextIPFT: "Feb 15, 2026",
        mileTime: "8:00",
        pushUps: 48,
        sitUps: 55,
        pullUps: 12,
        injuries: ["Ankle sprain - recovered"]
    },
];

export default function SoldiersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);

    const filteredSoldiers = mockSoldiers.filter((soldier) => {
        const matchesSearch =
            soldier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            soldier.serviceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            soldier.rank.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "all" || soldier.fitnessStatus === filterStatus;
        const matchesCategory = filterCategory === "all" || soldier.medicalCategory === filterCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Fit":
                return <Badge variant="default" className="bg-green-600 text-white">Fit</Badge>;
            case "At Risk":
                return <Badge variant="secondary" className="bg-orange-600 text-white">At Risk</Badge>;
            case "Unfit":
                return <Badge variant="destructive">Unfit</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getMedicalCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            A: "bg-green-100 text-green-800 border-green-300",
            B: "bg-yellow-100 text-yellow-800 border-yellow-300",
            C: "bg-red-100 text-red-800 border-red-300",
            Temporary: "bg-gray-100 text-gray-800 border-gray-300"
        };
        return (
            <Badge variant="outline" className={colors[category] || ""}>
                Category {category}
            </Badge>
        );
    };

    const getBMIStatus = (bmi: number) => {
        if (bmi < 18.5) return { status: "Underweight", color: "text-blue-600" };
        if (bmi < 25) return { status: "Normal", color: "text-green-600" };
        if (bmi < 30) return { status: "Overweight", color: "text-orange-600" };
        return { status: "Obese", color: "text-red-600" };
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div>
                    <h1 className="text-3xl font-bold">Soldiers Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage all soldiers' fitness and health records
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Soldiers</CardDescription>
                            <CardTitle className="text-2xl">{mockSoldiers.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-green-600" />
                                Fit
                            </CardDescription>
                            <CardTitle className="text-2xl text-green-600">
                                {mockSoldiers.filter(s => s.fitnessStatus === "Fit").length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                At Risk
                            </CardDescription>
                            <CardTitle className="text-2xl text-orange-600">
                                {mockSoldiers.filter(s => s.fitnessStatus === "At Risk").length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2">
                                <UserX className="h-4 w-4 text-red-600" />
                                Unfit
                            </CardDescription>
                            <CardTitle className="text-2xl text-red-600">
                                {mockSoldiers.filter(s => s.fitnessStatus === "Unfit").length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Soldiers List</CardTitle>
                        <CardDescription>
                            Showing {filteredSoldiers.length} of {mockSoldiers.length} soldiers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredSoldiers.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No soldiers found matching your criteria
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-left">
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
                                        {filteredSoldiers.map((soldier) => (
                                            <tr key={soldier.id} className="border-b hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                                                <td className="py-3 px-4 font-mono text-sm">{soldier.serviceNo}</td>
                                                <td className="py-3 px-4 font-medium">{soldier.name}</td>
                                                <td className="py-3 px-4">{soldier.rank}</td>
                                                <td className="py-3 px-4">{soldier.age}</td>
                                                <td className="py-3 px-4">
                                                    <span className={getBMIStatus(soldier.bmi).color}>
                                                        {soldier.bmi.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">{getMedicalCategoryBadge(soldier.medicalCategory)}</td>
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
