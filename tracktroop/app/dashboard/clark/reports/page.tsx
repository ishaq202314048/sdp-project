"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	FileText,
	Download,
	Trash2,
	Clock,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface Report {
	id: number;
	name: string;
	type: string;
	dateGenerated: string;
	dateRange: string;
	generatedBy: string;
	status: "completed" | "pending" | "failed";
	fileSize: string;
	soldierCount?: number;
}

export default function ClarkReportsPage() {
	const [selectedReportType, setSelectedReportType] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");

	const generatedReports: Report[] = [
		{
			id: 1,
			name: "Unit Fitness Assessment - December 2025",
			type: "fitness-assessment",
			dateGenerated: "2025-12-30",
			dateRange: "Dec 1 - Dec 31, 2025",
			generatedBy: "Clark - Admin",
			status: "completed",
			fileSize: "2.4 MB",
			soldierCount: 150,
		},
		{
			id: 2,
			name: "IPFT Report - Q4 2025",
			type: "ipft",
			dateGenerated: "2025-12-28",
			dateRange: "Oct 1 - Dec 31, 2025",
			generatedBy: "Clark - Admin",
			status: "completed",
			fileSize: "3.1 MB",
			soldierCount: 150,
		},
		{
			id: 3,
			name: "Nutrition & Hydration Plan - Month 01",
			type: "nutrition",
			dateGenerated: "2026-01-05",
			dateRange: "Jan 1 - Jan 31, 2026",
			generatedBy: "Clark - Admin",
			status: "completed",
			fileSize: "1.8 MB",
			soldierCount: 145,
		},
		{
			id: 4,
			name: "Medical Category Assessment Report",
			type: "medical",
			dateGenerated: "2025-12-20",
			dateRange: "Sep 1 - Dec 31, 2025",
			generatedBy: "Clark - Admin",
			status: "completed",
			fileSize: "2.7 MB",
			soldierCount: 150,
		},
		{
			id: 5,
			name: "High-Risk Soldiers Alert Report",
			type: "alert",
			dateGenerated: "2026-01-07",
			dateRange: "Jan 1 - Jan 7, 2026",
			generatedBy: "Clark - Admin",
			status: "completed",
			fileSize: "0.9 MB",
			soldierCount: 12,
		},
		{
			id: 6,
			name: "Unit Fitness Assessment - January 2026",
			type: "fitness-assessment",
			dateGenerated: "2026-01-06",
			dateRange: "Jan 1 - Jan 6, 2026",
			generatedBy: "Clark - Admin",
			status: "pending",
			fileSize: "-",
		},
	];

	const fitnessTestData = [
		{ test: "Mile", avg: 8.2, target: 8.0, min: 7.5, max: 9.1 },
		{ test: "Push-up", avg: 35, target: 40, min: 20, max: 50 },
		{ test: "Sit-up", avg: 38, target: 40, min: 25, max: 48 },
		{ test: "Pull-up", avg: 9, target: 10, min: 5, max: 15 },
		{ test: "Swimming", avg: 7.5, target: 8.0, min: 6.0, max: 8.5 },
	];

	const quarterlyProgressData = [
		{ quarter: "Q1 2025", fit: 110, unfit: 40 },
		{ quarter: "Q2 2025", fit: 118, unfit: 32 },
		{ quarter: "Q3 2025", fit: 125, unfit: 25 },
		{ quarter: "Q4 2025", fit: 132, unfit: 18 },
	];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "completed":
				return (
					<Badge className="bg-green-100 text-green-800">
						<CheckCircle2 className="h-3 w-3 mr-1" />
						Completed
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-blue-100 text-blue-800">
						<Clock className="h-3 w-3 mr-1" />
						Pending
					</Badge>
				);
			case "failed":
				return (
					<Badge className="bg-red-100 text-red-800">
						<AlertCircle className="h-3 w-3 mr-1" />
						Failed
					</Badge>
				);
		}
	};

	const handleGenerateReport = () => {
		if (!selectedReportType || !startDate || !endDate) {
			alert("Please fill in all fields");
			return;
		}
		alert(
			`Generating ${selectedReportType} report for ${startDate} to ${endDate}\nThis will be queued for processing...`
		);
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold">Reports</h1>
					<p className="text-muted-foreground mt-1">Generate and manage fitness reports</p>
				</div>

				{/* Report Generator */}
				<Card>
					<CardHeader>
						<CardTitle>Generate Report</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div>
								<Label htmlFor="report-type">Report Type</Label>
								<Select value={selectedReportType} onValueChange={setSelectedReportType}>
									<SelectTrigger id="report-type">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="fitness-assessment">Fitness Assessment</SelectItem>
										<SelectItem value="ipft">IPFT Report</SelectItem>
										<SelectItem value="nutrition">Nutrition & Hydration</SelectItem>
										<SelectItem value="medical">Medical Category</SelectItem>
										<SelectItem value="alert">High-Risk Alert</SelectItem>
										<SelectItem value="weight-limit">Weight & BMI</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="start-date">Start Date</Label>
								<Input
									id="start-date"
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
								/>
							</div>

							<div>
								<Label htmlFor="end-date">End Date</Label>
								<Input
									id="end-date"
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
								/>
							</div>

							<div className="flex items-end">
								<Button onClick={handleGenerateReport} className="w-full" disabled={!selectedReportType}>
									<FileText className="mr-2 h-4 w-4" />
									Generate
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Quick Report Templates */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Fitness Test Performance</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={250}>
								<BarChart data={fitnessTestData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="test" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="avg" fill="#3b82f6" name="Average" />
									<Bar dataKey="target" fill="#10b981" name="Target" />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Quarterly Progress</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={250}>
								<LineChart data={quarterlyProgressData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="quarter" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="fit" stroke="#10b981" strokeWidth={2} name="Fit" />
									<Line type="monotone" dataKey="unfit" stroke="#ef4444" strokeWidth={2} name="Unfit" />
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>
				{/* Generated Reports History */}
				<Card>
					<CardHeader>
						<CardTitle>Report History</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b">
									<tr className="text-left">
										<th className="pb-3 font-semibold">Report Name</th>
										<th className="pb-3 font-semibold">Type</th>
										<th className="pb-3 font-semibold">Date Generated</th>
										<th className="pb-3 font-semibold">Status</th>
										<th className="pb-3 font-semibold">Size</th>
										<th className="pb-3 font-semibold">Actions</th>
									</tr>
								</thead>
								<tbody>
									{generatedReports.map((report) => (
										<tr key={report.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
											<td className="py-3">{report.name}</td>
											<td className="py-3">
												<Badge variant="outline">{report.type.replace("-", " ")}</Badge>
											</td>
											<td className="py-3 text-xs">{report.dateGenerated}</td>
											<td className="py-3">{getStatusBadge(report.status)}</td>
											<td className="py-3 text-xs">{report.fileSize}</td>
											<td className="py-3 flex gap-2">
												{report.status === "completed" && (
													<>
														<Button variant="ghost" size="sm" title="Download">
															<Download className="h-4 w-4" />
														</Button>
													</>
												)}
												<Button
													variant="ghost"
													size="sm"
													className="text-red-600 hover:text-red-700"
													title="Delete"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
