"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Types
interface FitnessTest {
    id: string;
    soldierId: string;
    soldierName: string;
    serviceNo: string;
    rank: string;
    testDate: string;
    testType: "IPFT" | "Monthly" | "Quarterly";
    exercises: {
        mileRun: { time: string; score: number; passed: boolean };
        pushUps: { count: number; score: number; passed: boolean };
        sitUps: { count: number; score: number; passed: boolean };
        pullUps: { count: number; score: number; passed: boolean };
        ropeClimbing: { time: string; score: number; passed: boolean };
        swimming: { time: string; score: number; passed: boolean };
    };
    totalScore: number;
    overallResult: "Pass" | "Fail";
    medicalCategory: "A" | "B" | "C" | "Temporary";
}

// Mock data
const mockTests: FitnessTest[] = [
    {
        id: "1",
        soldierId: "S001",
        soldierName: "Lt. Rahman",
        serviceNo: "202114190",
        rank: "Lieutenant",
        testDate: "2026-01-05",
        testType: "IPFT",
        exercises: {
            mileRun: { time: "7:45", score: 95, passed: true },
            pushUps: { count: 58, score: 92, passed: true },
            sitUps: { count: 65, score: 90, passed: true },
            pullUps: { count: 15, score: 88, passed: true },
            ropeClimbing: { time: "45s", score: 85, passed: true },
            swimming: { time: "3:20", score: 87, passed: true }
        },
        totalScore: 537,
        overallResult: "Pass",
        medicalCategory: "A"
    },
    {
        id: "2",
        soldierId: "S002",
        soldierName: "Lt. Ahmed",
        serviceNo: "202114193",
        rank: "Lieutenant",
        testDate: "2026-01-04",
        testType: "Monthly",
        exercises: {
            mileRun: { time: "9:15", score: 65, passed: false },
            pushUps: { count: 32, score: 68, passed: true },
            sitUps: { count: 45, score: 72, passed: true },
            pullUps: { count: 8, score: 65, passed: true },
            ropeClimbing: { time: "1:10", score: 62, passed: false },
            swimming: { time: "4:45", score: 60, passed: false }
        },
        totalScore: 392,
        overallResult: "Fail",
        medicalCategory: "B"
    },
    {
        id: "3",
        soldierId: "S003",
        soldierName: "Capt. Hassan",
        serviceNo: "202114194",
        rank: "Captain",
        testDate: "2026-01-03",
        testType: "Quarterly",
        exercises: {
            mileRun: { time: "7:20", score: 98, passed: true },
            pushUps: { count: 62, score: 95, passed: true },
            sitUps: { count: 70, score: 95, passed: true },
            pullUps: { count: 18, score: 92, passed: true },
            ropeClimbing: { time: "38s", score: 90, passed: true },
            swimming: { time: "3:00", score: 92, passed: true }
        },
        totalScore: 562,
        overallResult: "Pass",
        medicalCategory: "A"
    }
];

export default function FitnessTestsPage() {
    const [tests, setTests] = useState<FitnessTest[]>(mockTests);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterResult, setFilterResult] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Calculate statistics
    const totalTests = tests.length;
    const passedTests = tests.filter(t => t.overallResult === "Pass").length;
    const failedTests = tests.filter(t => t.overallResult === "Fail").length;
    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : "0";
    const averageScore = totalTests > 0
        ? (tests.reduce((sum, t) => sum + t.totalScore, 0) / totalTests).toFixed(0)
        : "0";

    // Statistics cards data
    const statsCards = [
        {
            title: "Total Tests",
            value: totalTests,
            color: "text-gray-900"
        },
        {
            title: "Passed Tests",
            value: passedTests,
            color: "text-green-600"
        },
        {
            title: "Failed Tests",
            value: failedTests,
            color: "text-red-600"
        },
        {
            title: "Pass Rate",
            value: `${passRate}%`,
            color: "text-gray-900"
        }
    ];

    // Filter tests
    const filteredTests = tests.filter(test => {
        const matchesSearch =
            test.soldierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.serviceNo.includes(searchTerm) ||
            test.rank.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === "all" || test.testType === filterType;
        const matchesResult = filterResult === "all" || test.overallResult === filterResult;

        return matchesSearch && matchesType && matchesResult;
    });

    const getResultBadgeVariant = (result: string) => {
        return result === "Pass" ? "bg-green-600" : "bg-red-600";
    };

    const getMedicalCategoryColor = (category: string) => {
        switch (category) {
            case "A": return "text-green-600 bg-green-50 border-green-200";
            case "B": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "C": return "text-orange-600 bg-orange-50 border-orange-200";
            case "Temporary": return "text-red-600 bg-red-50 border-red-200";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Fitness Tests</h1>
                        <p className="text-gray-600 mt-1">Manage and monitor soldier fitness assessments</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((card, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-3">
                                <CardDescription>{card.title}</CardDescription>
                                <CardTitle className={`text-3xl ${card.color}`}>{card.value}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Test Records ({filteredTests.length})</CardTitle>
                        <CardDescription>Recent fitness test results and assessments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredTests.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p className="text-lg">No tests found matching your filters</p>
                                </div>
                            ) : (
                                filteredTests.map((test) => (
                                    <div
                                        key={test.id}
                                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg">{test.soldierName}</h3>
                                                    <Badge variant="outline">{test.rank}</Badge>
                                                    <Badge className={getMedicalCategoryColor(test.medicalCategory)}>
                                                        Med Cat: {test.medicalCategory}
                                                    </Badge>
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
                                                    <p className="text-sm text-gray-600">Total Score</p>
                                                    <p className="text-2xl font-bold">{test.totalScore}</p>
                                                </div>
                                                <Badge
                                                    className={`text-sm py-1 px-3 text-white ${getResultBadgeVariant(test.overallResult)}`}
                                                >
                                                    {test.overallResult}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t">
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                                {[
                                                    { name: "Mile Run", value: test.exercises.mileRun.time, score: test.exercises.mileRun.score, passed: test.exercises.mileRun.passed },
                                                    { name: "Push-ups", value: test.exercises.pushUps.count, score: test.exercises.pushUps.score, passed: test.exercises.pushUps.passed },
                                                    { name: "Sit-ups", value: test.exercises.sitUps.count, score: test.exercises.sitUps.score, passed: test.exercises.sitUps.passed },
                                                    { name: "Pull-ups", value: test.exercises.pullUps.count, score: test.exercises.pullUps.score, passed: test.exercises.pullUps.passed },
                                                    { name: "Rope Climb", value: test.exercises.ropeClimbing.time, score: test.exercises.ropeClimbing.score, passed: test.exercises.ropeClimbing.passed },
                                                    { name: "Swimming", value: test.exercises.swimming.time, score: test.exercises.swimming.score, passed: test.exercises.swimming.passed }
                                                ].map((exercise, index) => (
                                                    <div key={index} className="text-sm">
                                                        <p className="text-gray-600">{exercise.name}</p>
                                                        <p className="font-semibold">{exercise.value}</p>
                                                        <p className={exercise.passed ? "text-green-600" : "text-red-600"}>
                                                            Score: {exercise.score}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
