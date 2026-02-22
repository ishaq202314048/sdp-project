"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dumbbell, Download } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function FitnessPage() {
    // (recent test list removed from this view)

    // fitness status controls which workout plans to show
    const [fitnessStatus, setFitnessStatus] = useState<'Fit' | 'Unfit'>("Fit");

    const [weeklyPlan, setWeeklyPlan] = useState<{ id: string; title: string; status: 'Fit' | 'Unfit'; exercises: Array<{ day: string; items: Array<{ name: string; duration: string; focus: string }> }>; createdBy: string; createdAt: string } | null>(null);
    const [planLoading, setPlanLoading] = useState(false);
    // IPFT date from database (set by adjutant)
    const [ipftDate, setIpftDate] = useState<string | null>(null);
    // Fitness tests from database
    const [fitnessTests, setFitnessTests] = useState<{ id: string; exerciseName: string; result: string }[]>([]);

    const getDaysRemaining = (dateStr: string | null) => {
        if (!dateStr) return 0;
        const target = new Date(dateStr);
        const now = new Date();
        const t = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
        const n = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const diff = Math.ceil((t - n) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const daysRemaining = getDaysRemaining(ipftDate);

    const totalTests = fitnessTests.length;
    const passedTests = fitnessTests.filter(t => t.result === 'Pass').length;
    const overallScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    const overviewCards = [
        {
            title: "Fitness Status",
            value: fitnessStatus,
            subtitle: fitnessStatus === 'Fit' ? 'Active' : 'Needs Improvement',
            badgeColor: fitnessStatus === 'Fit' ? 'bg-green-500' : 'bg-red-500'
        },
        {
            title: "Overall Score",
            value: totalTests > 0 ? `${overallScore}%` : "—",
            subtitle: totalTests > 0 ? (overallScore >= 80 ? "Above Average" : overallScore >= 50 ? "Average" : "Below Average") : "No tests yet"
        },
        {
            title: "Tests Passed",
            value: totalTests > 0 ? `${passedTests}/${totalTests}` : "—",
            subtitle: totalTests > 0 ? "From justified tests" : "No tests yet"
        },
        {
            title: "Next IPFT",
            value: ipftDate ? `${daysRemaining}` : "—",
            subtitle: ipftDate ? new Date(ipftDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not scheduled"
        }
    ];

    // Fetch weekly plan based on fitness status
    const fetchWeeklyPlan = async (status: 'Fit' | 'Unfit') => {
        setPlanLoading(true);
        try {
            console.log('[fetchWeeklyPlan] Fetching plans for status:', status);
            const res = await fetch(`/api/fitness/plans?status=${status}`);
            const json = await res.json();
            console.log('[fetchWeeklyPlan] API response:', json);
            if (Array.isArray(json) && json.length > 0) {
                // Get the most recent plan for this status
                const plan = json[0];
                console.log('[fetchWeeklyPlan] Setting plan:', plan);
                setWeeklyPlan(plan);
            } else {
                console.log('[fetchWeeklyPlan] No plans found for status:', status);
                setWeeklyPlan(null);
            }
        } catch (err) {
            console.error('[fetchWeeklyPlan] Failed to fetch weekly plan:', err);
            setWeeklyPlan(null);
        } finally {
            setPlanLoading(false);
        }
    };

    useEffect(() => {
        // Load fitness status from database for the current user
        const loadFitnessStatus = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    return;
                }

                const user = JSON.parse(userStr);

                const res = await fetch(`/api/fitness?userId=${user.id}`);
                const data = await res.json();
                
                if (data?.status && (data.status === 'Fit' || data.status === 'Unfit')) {
                    setFitnessStatus(data.status);
                    console.log('Loaded fitness status from database:', data.status);
                }

                // Fetch fitness tests for this soldier
                const testsRes = await fetch(`/api/soldier-fitness-tests?userId=${user.id}`);
                if (testsRes.ok) {
                    const testsData = await testsRes.json();
                    setFitnessTests(testsData.tests || []);
                }
            } catch (error) {
                console.error('Failed to load fitness status:', error);
            }
        };

        // Fetch IPFT date
        fetch("/api/fitness-test/ipft-date")
            .then(res => res.json())
            .then(data => { if (data.date) setIpftDate(data.date); })
            .catch(() => {});

        loadFitnessStatus();
    }, []);

    useEffect(() => {
        // Fetch weekly plan whenever fitness status changes
        fetchWeeklyPlan(fitnessStatus);
    }, [fitnessStatus]);

    // day selector (Sunday-first)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const getTodayName = () => days[new Date().getDay()];
    const [selectedDay, setSelectedDay] = useState<string>(getTodayName());

    // Download weekly plan as PDF
    const downloadWeeklyPlanPDF = async () => {
        if (!weeklyPlan || !weeklyPlan.exercises) return;

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const pageWidth = 595;
        const pageHeight = 842;
        const margin = 50;
        let page = pdfDoc.addPage([pageWidth, pageHeight]);
        let y = pageHeight - margin;

        const addNewPage = () => {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
        };

        const checkSpace = (needed: number) => {
            if (y - needed < margin) addNewPage();
        };

        // Title
        page.drawText("Weekly Fitness Plan", { x: margin, y, size: 22, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
        y -= 28;
        page.drawText(`${weeklyPlan.title} — ${weeklyPlan.status} Soldiers`, { x: margin, y, size: 12, font, color: rgb(0.4, 0.4, 0.4) });
        y -= 14;
        page.drawText(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, { x: margin, y, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
        y -= 30;

        // Divider
        page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
        y -= 20;

        // Each day
        for (const dayPlan of weeklyPlan.exercises) {
            checkSpace(50);

            // Day header
            page.drawRectangle({ x: margin, y: y - 4, width: pageWidth - margin * 2, height: 22, color: rgb(0.93, 0.95, 0.97) });
            page.drawText(dayPlan.day, { x: margin + 10, y: y, size: 14, font: fontBold, color: rgb(0.15, 0.15, 0.15) });
            y -= 30;

            if (!dayPlan.items || dayPlan.items.length === 0) {
                checkSpace(20);
                page.drawText("Rest Day", { x: margin + 20, y, size: 11, font, color: rgb(0.5, 0.5, 0.5) });
                y -= 25;
            } else {
                for (const exercise of dayPlan.items) {
                    checkSpace(40);

                    // Exercise name
                    page.drawText(`•  ${exercise.name}`, { x: margin + 20, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) });

                    // Duration on right side
                    if (exercise.duration) {
                        const durWidth = font.widthOfTextAtSize(exercise.duration, 10);
                        page.drawText(exercise.duration, { x: pageWidth - margin - durWidth, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
                    }
                    y -= 16;

                    // Focus
                    if (exercise.focus) {
                        page.drawText(`Focus: ${exercise.focus}`, { x: margin + 32, y, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
                        y -= 14;
                    }

                    y -= 6;
                }
            }

            y -= 10;
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Weekly_Fitness_Plan_${weeklyPlan.status}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Fitness Dashboard</h1>
                <p className="text-gray-500 mt-1">Track your performance and progress</p>
                <div className="mt-4 flex items-center gap-4 flex-wrap">
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className={`px-3 py-1 rounded-full shadow-sm text-sm ${fitnessStatus === 'Fit' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {fitnessStatus}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Recent Test Results removed */}

                    {/* Weekly Plan from Database - NOW IN MAIN AREA */}
                    <Card className="mt-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Your Weekly Routine</CardTitle>
                                    <CardDescription>
                                        {weeklyPlan ? `${weeklyPlan.title} for ${weeklyPlan.status} Soldiers` : `Routine for ${fitnessStatus} Soldiers`}
                                    </CardDescription>
                                </div>
                                {weeklyPlan && (
                                    <Button variant="outline" size="sm" onClick={downloadWeeklyPlanPDF} className="flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {planLoading ? (
                                <p className="text-sm text-gray-500">Loading routine...</p>
                            ) : weeklyPlan ? (
                                <>
                                    {/* Day Selector - like Workout Plan */}
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="text-sm block mb-1">Select weekday</label>
                                            <select 
                                                value={selectedDay} 
                                                onChange={(e) => setSelectedDay(e.target.value)} 
                                                className="border px-3 py-2 rounded-md shadow-sm w-full"
                                            >
                                                {days.map((d) => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Exercise List for Selected Day - like Workout Plan */}
                                    <div className="space-y-4">
                                        {Array.isArray(weeklyPlan.exercises) && weeklyPlan.exercises.length > 0 ? (
                                            (() => {
                                                const dayPlan = weeklyPlan.exercises.find((d: Record<string, unknown>) => String(d.day).toLowerCase() === selectedDay.toLowerCase()) as { day: string; items: Array<Record<string, unknown>> } | undefined;
                                                if (!dayPlan || !Array.isArray(dayPlan.items) || dayPlan.items.length === 0) {
                                                    return <p className="text-center text-gray-500 py-6">Rest Day</p>;
                                                }
                                                return dayPlan.items.map((exercise: Record<string, unknown>, index: number) => (
                                                    <div key={index}>
                                                        <div className="flex items-center justify-between py-3">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`p-2 rounded-lg ${fitnessStatus === 'Fit' ? 'bg-linear-to-br from-green-50 to-green-100' : 'bg-linear-to-br from-orange-50 to-orange-100'}`}>
                                                                    <Dumbbell className={`h-5 w-5 ${fitnessStatus === 'Fit' ? 'text-green-600' : 'text-orange-600'}`} />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">{String(exercise.name)}</h3>
                                                                    <p className="text-sm text-gray-500">{String(exercise.focus ?? '')}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-700">{String(exercise.duration ?? '')}</p>
                                                            </div>
                                                        </div>
                                                        {index !== dayPlan.items.length - 1 && <Separator />}
                                                    </div>
                                                ));
                                            })()
                                        ) : (
                                            <p className="text-center text-gray-500 py-6">No exercises found</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-3">No routine assigned yet for {fitnessStatus} soldiers.</p>
                                    <p className="text-sm text-gray-500">Contact your adjutant to create and assign a weekly routine.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    {overviewCards.map((card, index) => (
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
                                    {card.title === "Next IPFT" && ipftDate && (
                                        <div className="text-sm text-gray-500">
                                            {daysRemaining} days left
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}