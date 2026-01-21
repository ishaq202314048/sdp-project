"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Users,
	AlertTriangle,
	CheckCircle2,
	Activity,
	TrendingUp,
	TrendingDown,
	Zap,
	AlertCircle,
	BarChart3,
	FileText,
} from "lucide-react";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

export default function ClarkOverviewPage() {
	// Mock data - replace with real data from API
	const unitStats = {
		totalSoldiers: 150,
		fitSoldiers: 132,
		unfitSoldiers: 18,
		highRiskSoldiers: 12,
		fitnessRate: 88,
	};

	const monthlyFitnessData = [
		{ month: "Sep", fit: 120, unfit: 30 },
		{ month: "Oct", fit: 125, unfit: 25 },
		{ month: "Nov", fit: 130, unfit: 20 },
		{ month: "Dec", fit: 132, unfit: 18 },
		{ month: "Jan", fit: 132, unfit: 18 },
	];

	const testPerformanceData = [
		{ name: "Mile Test", average: 8.2, target: 8.0 },
		{ name: "Push-ups", average: 35, target: 40 },
		{ name: "Sit-ups", average: 38, target: 40 },
		{ name: "Pull-ups", average: 9, target: 10 },
		{ name: "Swimming", average: 7.5, target: 8.0 },
	];

	const fitnessDistribution = [
		{ name: "Excellent", value: 45, fill: "#10b981" },
		{ name: "Good", value: 65, fill: "#3b82f6" },
		{ name: "Average", value: 22, fill: "#f59e0b" },
		{ name: "Poor", value: 18, fill: "#ef4444" },
	];

	const highRiskSoldiers = [
		{
			id: 1,
			name: "Lt. Rahim Hassan",
			serviceNo: "BA-10045",
			risk: "Overweight",
			severity: "high",
			bmi: 28.5,
		},
		{
			id: 2,
			name: "Cpl. Khan Ali",
			serviceNo: "BA-10156",
			risk: "Low Fitness",
			severity: "high",
			bmi: 25.2,
		},
		{
			id: 3,
			name: "Sgt. Karim Ahmed",
			serviceNo: "BA-10234",
			risk: "Injury Recovery",
			severity: "medium",
			bmi: 26.1,
		},
		{
			id: 4,
			name: "Pte. Farhan Uddin",
			serviceNo: "BA-10567",
			risk: "Failed IPFT",
			severity: "high",
			bmi: 29.3,
		},
		{
			id: 5,
			name: "Sgt. Hasan Khan",
			serviceNo: "BA-10892",
			risk: "Below Standard",
			severity: "medium",
			bmi: 27.8,
		},
	];

	const recentAlerts = [
		{
			id: 1,
			message: "8 soldiers overweight - nutrition intervention recommended",
			type: "warning",
			time: "2 hours ago",
		},
		{
			id: 2,
			message: "Monthly mile test due in 3 days for 45 soldiers",
			type: "info",
			time: "5 hours ago",
		},
		{
			id: 3,
			message: "3 soldiers failed IPFT standards - remedial training assigned",
			type: "danger",
			time: "1 day ago",
		},
		{
			id: 4,
			message: "2 soldiers cleared from medical category B",
			type: "success",
			time: "2 days ago",
		},
	];

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getAlertColor = (type: string) => {
		switch (type) {
			case "danger":
				return "border-l-4 border-red-500 bg-red-50";
			case "warning":
				return "border-l-4 border-yellow-500 bg-yellow-50";
			case "success":
				return "border-l-4 border-green-500 bg-green-50";
			default:
				return "border-l-4 border-blue-500 bg-blue-50";
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold">Unit Overview</h1>
					<p className="text-muted-foreground mt-1">Real-time fitness monitoring and analytics</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardHeader>
							<CardDescription className="flex items-center gap-2">
								<Users className="h-4 w-4" />
								Total Soldiers
							</CardDescription>
							<CardTitle className="text-3xl">{unitStats.totalSoldiers}</CardTitle>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardDescription className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-600" />
								Fit Soldiers
							</CardDescription>
							<div className="flex items-baseline justify-between">
								<CardTitle className="text-3xl text-green-600">{unitStats.fitSoldiers}</CardTitle>
								<span className="text-sm text-muted-foreground">({unitStats.fitnessRate}%)</span>
							</div>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardDescription className="flex items-center gap-2">
								<AlertTriangle className="h-4 w-4 text-red-600" />
								Unfit Soldiers
							</CardDescription>
							<CardTitle className="text-3xl text-red-600">{unitStats.unfitSoldiers}</CardTitle>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardDescription className="flex items-center gap-2">
								<Zap className="h-4 w-4 text-orange-600" />
								High Risk
							</CardDescription>
							<CardTitle className="text-3xl text-orange-600">{unitStats.highRiskSoldiers}</CardTitle>
						</CardHeader>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Monthly Fitness Trend */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle>Monthly Fitness Trend</CardTitle>
							<CardDescription>Fit vs Unfit soldiers over time</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={monthlyFitnessData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="fit"
										stroke="#10b981"
										strokeWidth={2}
										name="Fit Soldiers"
										dot={{ fill: "#10b981", r: 5 }}
									/>
									<Line
										type="monotone"
										dataKey="unfit"
										stroke="#ef4444"
										strokeWidth={2}
										name="Unfit Soldiers"
										dot={{ fill: "#ef4444", r: 5 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					{/* Fitness Distribution */}
					<Card>
						<CardHeader>
							<CardTitle>Fitness Distribution</CardTitle>
							<CardDescription>Current soldier categories</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={fitnessDistribution}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, value }) => `${name} ${value}`}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
									>
										{fitnessDistribution.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.fill} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Test Performance Comparison */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle>Test Performance vs Target</CardTitle>
							<CardDescription>Average unit performance by test type</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={testPerformanceData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="average" fill="#3b82f6" name="Average" />
									<Bar dataKey="target" fill="#10b981" name="Target" />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5" />
								Recent Alerts
							</CardTitle>
							<CardDescription>Latest system notifications</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{recentAlerts.map((alert) => (
								<div key={alert.id} className={`p-3 rounded-lg ${getAlertColor(alert.type)}`}>
									<p className="text-sm font-medium">{alert.message}</p>
									<p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-orange-600" />
							High Risk Soldiers ({highRiskSoldiers.length})
						</CardTitle>
						<CardDescription>Soldiers requiring immediate attention or intervention</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b">
									<tr className="text-left">
										<th className="pb-3 font-semibold">Name</th>
										<th className="pb-3 font-semibold">Service No</th>
										<th className="pb-3 font-semibold">Risk Category</th>
										<th className="pb-3 font-semibold">BMI</th>
									</tr>
								</thead>
								<tbody className="space-y-2">
									{highRiskSoldiers.map((soldier) => (
										<tr key={soldier.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
											<td className="py-3">{soldier.name}</td>
											<td className="py-3 font-mono text-xs">{soldier.serviceNo}</td>
											<td className="py-3">
												<Badge className={getSeverityColor(soldier.severity)}>
													{soldier.risk}
												</Badge>
											</td>
											<td className="py-3">
												<span
													className={`px-2 py-1 rounded text-xs font-semibold ${
														soldier.bmi > 28
															? "bg-red-100 text-red-800"
															: "bg-yellow-100 text-yellow-800"
													}`}
												>
													{soldier.bmi}
												</span>
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