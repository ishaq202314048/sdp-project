"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, CheckCircle2, UserPlus, Send } from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

type Exercise = { name: string; duration?: string; focus?: string };
type DayBlock = { day: string; items: Exercise[] };
type Plan = { id: string; title: string; status: string; createdBy?: string; createdAt?: string; exercises?: DayBlock[] };
type NewSoldier = { id: string; name: string; email: string; serviceNo: string; rank: string; joinedAt: string };
type SoldierItem = { id: string; name: string; serviceNo: string; rank: string; fitnessStatus: 'Fit' | 'Unfit' };

export default function ClarkOverviewPage() {

	const [plans, setPlans] = useState<Plan[]>([]);
	const [newSoldiers, setNewSoldiers] = useState<NewSoldier[]>([]);
	const [allSoldiers, setAllSoldiers] = useState<SoldierItem[]>([]);
	const [monthlyFitnessData, setMonthlyFitnessData] = useState<{ month: string; fit: number; unfit: number }[]>([]);
	const [reportStatus, setReportStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

		useEffect(() => {
			const load = async () => {
				try {
					const res = await fetch('/api/fitness/plans');
					if (res.ok) {
						const json = await res.json();
						setPlans(json || []);
					}
				} catch (err) {
					console.error('Failed to load plans', err);
				}

				try {
					const res = await fetch('/api/soldiers/new');
					if (res.ok) {
						const json = await res.json();
						setNewSoldiers(json.soldiers || []);
					}
				} catch (err) {
					console.error('Failed to load new soldiers', err);
				}

				try {
					const res = await fetch('/api/soldiers');
					if (res.ok) {
						const json = await res.json();
						setAllSoldiers(json || []);
					}
				} catch (err) {
					console.error('Failed to load soldiers', err);
				}

				try {
					const res = await fetch('/api/fitness/monthly-trend');
					if (res.ok) {
						const json = await res.json();
						setMonthlyFitnessData(json.trend || []);
					}
				} catch (err) {
					console.error('Failed to load monthly trend', err);
				}
			};
			load();
		}, []);

		const sendReportToAdjutant = async () => {
			if (newSoldiers.length === 0) return;
			setReportStatus('sending');
			try {
				// Get clerk info from localStorage
				const stored = localStorage.getItem('user');
				const user = stored ? JSON.parse(stored) : {};

				const res = await fetch('/api/reports/new-soldiers', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						soldiers: newSoldiers,
						sentBy: user.id || 'unknown',
						sentByName: user.fullName || user.email || 'Clerk',
					}),
				});
				if (res.ok) {
					setReportStatus('sent');
					setTimeout(() => setReportStatus('idle'), 4000);
				} else {
					setReportStatus('error');
					setTimeout(() => setReportStatus('idle'), 4000);
				}
			} catch {
				setReportStatus('error');
				setTimeout(() => setReportStatus('idle'), 4000);
			}
		};

		// Compute real stats from DB data
		const totalSoldiers = allSoldiers.length;
		const fitSoldiers = allSoldiers.filter(s => s.fitnessStatus === 'Fit').length;
		const unfitSoldiers = allSoldiers.filter(s => s.fitnessStatus === 'Unfit').length;
		const fitnessRate = totalSoldiers > 0 ? Math.round((fitSoldiers / totalSoldiers) * 100) : 0;

		// Get only the most recent plan for Fit and Unfit
		const latestFitPlan = plans.find(p => p.status === 'Fit');
		const latestUnfitPlan = plans.find(p => p.status === 'Unfit');

		return (
			<div className="min-h-screen bg-[#020617] p-6">
				<div className="max-w-7xl mx-auto space-y-6">
					{/* Header */}
					<div>
						<h1 className="text-3xl font-bold text-white">Unit Overview</h1>
						<p className="text-slate-400 mt-1">Real-time fitness monitoring and analytics</p>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<Card>
							<CardHeader>
								<CardDescription className="flex items-center gap-2">
									<Users className="h-4 w-4" />
									Total Soldiers
								</CardDescription>
								<CardTitle className="text-3xl">{totalSoldiers}</CardTitle>
							</CardHeader>
						</Card>

						<Card>
							<CardHeader>
								<CardDescription className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-emerald-400" />
									Fit Soldiers
								</CardDescription>
								<div className="flex items-baseline justify-between">
									<CardTitle className="text-3xl text-emerald-400">{fitSoldiers}</CardTitle>
									<span className="text-sm text-slate-400">({fitnessRate}%)</span>
								</div>
							</CardHeader>
						</Card>

						<Card>
							<CardHeader>
								<CardDescription className="flex items-center gap-2">
									<AlertTriangle className="h-4 w-4 text-red-400" />
									Unfit Soldiers
								</CardDescription>
								<CardTitle className="text-3xl text-red-400">{unfitSoldiers}</CardTitle>
							</CardHeader>
						</Card>
					</div>

					{/* New Soldiers — signed up in last 7 days */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<UserPlus className="h-5 w-5 text-emerald-400" />
										New Soldiers ({newSoldiers.length})
									</CardTitle>
									<CardDescription className="mt-1">Soldiers who signed up in the last 7 days</CardDescription>
								</div>
								{newSoldiers.length > 0 && (
									<Button
										onClick={sendReportToAdjutant}
										disabled={reportStatus === 'sending' || reportStatus === 'sent'}
										className={
											reportStatus === 'sent'
												? 'bg-green-600 hover:bg-green-700'
												: reportStatus === 'error'
												? 'bg-red-600 hover:bg-red-700'
												: ''
										}
										size="sm"
									>
										<Send className="h-4 w-4 mr-2" />
										{reportStatus === 'sending'
											? 'Sending...'
											: reportStatus === 'sent'
											? '✓ Report Sent!'
											: reportStatus === 'error'
											? 'Failed — Retry'
											: 'Send Report to Adjutant'}
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{newSoldiers.length === 0 ? (
								<p className="text-sm text-muted-foreground">No new soldiers signed up in the last 7 days.</p>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead className="border-b border-white/[0.1]">
											<tr className="text-left">
												<th className="pb-3 font-semibold text-slate-300">Name</th>
												<th className="pb-3 font-semibold text-slate-300">Email</th>
												<th className="pb-3 font-semibold text-slate-300">Service No</th>
												<th className="pb-3 font-semibold text-slate-300">Rank</th>
												<th className="pb-3 font-semibold text-slate-300">Joined</th>
											</tr>
										</thead>
										<tbody>
											{newSoldiers.map((soldier) => (
												<tr key={soldier.id} className="border-b border-white/[0.06] hover:bg-white/[0.04]">
													<td className="py-3 font-medium text-white">{soldier.name}</td>
													<td className="py-3 text-slate-400">{soldier.email}</td>
													<td className="py-3 font-mono text-xs text-slate-300">{soldier.serviceNo}</td>
													<td className="py-3 text-slate-300">{soldier.rank}</td>
													<td className="py-3">
														<Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
															{new Date(soldier.joinedAt).toLocaleDateString()}
														</Badge>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Weekly Workout Plans (from Adjutant) — Fit left, Unfit right */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Fit Soldiers Plan */}
						<Card className="border-emerald-500/30">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Fit</Badge>
									<CardTitle className="text-lg">
										{latestFitPlan ? latestFitPlan.title : 'No Plan'}
									</CardTitle>
								</div>
								{latestFitPlan && (
									<CardDescription>
										by {latestFitPlan.createdBy} • {latestFitPlan.createdAt ? new Date(latestFitPlan.createdAt).toLocaleString() : '—'}
									</CardDescription>
								)}
							</CardHeader>
							<CardContent>
								{!latestFitPlan ? (
									<p className="text-sm text-slate-400">No fitness plan available for Fit soldiers.</p>
								) : (
									<div className="space-y-2">
										{Array.isArray(latestFitPlan.exercises) ? (
											latestFitPlan.exercises.map((dayBlock: DayBlock) => (
												<div key={dayBlock.day} className="border border-white/[0.08] rounded-lg p-2">
													<p className="font-medium text-sm text-slate-300">{dayBlock.day}</p>
													{(dayBlock.items || []).length === 0 ? (
														<p className="text-xs text-slate-500">No exercises</p>
													) : (
														<ul className="text-sm list-disc ml-4">
															{dayBlock.items.map((it: Exercise, i: number) => (
																<li key={i}>{it.name} {it.duration ? `• ${it.duration}` : ''} {it.focus ? `(${it.focus})` : ''}</li>
															))}
														</ul>
													)}
												</div>
											))
										) : null}
									</div>
								)}
							</CardContent>
						</Card>

						{/* Unfit Soldiers Plan */}
						<Card className="border-red-500/30">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Unfit</Badge>
									<CardTitle className="text-lg">
										{latestUnfitPlan ? latestUnfitPlan.title : 'No Plan'}
									</CardTitle>
								</div>
								{latestUnfitPlan && (
									<CardDescription>
										by {latestUnfitPlan.createdBy} • {latestUnfitPlan.createdAt ? new Date(latestUnfitPlan.createdAt).toLocaleString() : '—'}
									</CardDescription>
								)}
							</CardHeader>
							<CardContent>
								{!latestUnfitPlan ? (
									<p className="text-sm text-slate-400">No fitness plan available for Unfit soldiers.</p>
								) : (
									<div className="space-y-2">
										{Array.isArray(latestUnfitPlan.exercises) ? (
											latestUnfitPlan.exercises.map((dayBlock: DayBlock) => (
												<div key={dayBlock.day} className="border border-white/[0.08] rounded-lg p-2">
													<p className="font-medium text-sm text-slate-300">{dayBlock.day}</p>
													{(dayBlock.items || []).length === 0 ? (
														<p className="text-xs text-slate-500">No exercises</p>
													) : (
														<ul className="text-sm list-disc ml-4">
															{dayBlock.items.map((it: Exercise, i: number) => (
																<li key={i}>{it.name} {it.duration ? `• ${it.duration}` : ''} {it.focus ? `(${it.focus})` : ''}</li>
															))}
														</ul>
													)}
												</div>
											))
										) : null}
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Monthly Fitness Trend */}
					<Card>
						<CardHeader>
							<CardTitle>Monthly Fitness Trend</CardTitle>
							<CardDescription>Fit vs Unfit soldiers over time</CardDescription>
						</CardHeader>
						<CardContent>
							{monthlyFitnessData.length === 0 ? (
								<p className="text-sm text-muted-foreground">No trend data available yet.</p>
							) : (
								<ResponsiveContainer width="100%" height={350}>
									<LineChart data={monthlyFitnessData}>
										<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
										<XAxis dataKey="month" stroke="#94a3b8" />
										<YAxis stroke="#94a3b8" />
										<Tooltip contentStyle={{ backgroundColor: '#0c1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
										<Legend wrapperStyle={{ color: '#94a3b8' }} />
										<Line type="monotone" dataKey="fit" stroke="#10b981" strokeWidth={2} name="Fit Soldiers" dot={{ fill: "#10b981", r: 5 }} />
										<Line type="monotone" dataKey="unfit" stroke="#ef4444" strokeWidth={2} name="Unfit Soldiers" dot={{ fill: "#ef4444", r: 5 }} />
									</LineChart>
								</ResponsiveContainer>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5 text-emerald-400" />
								Soldiers Fitness Status ({allSoldiers.length})
							</CardTitle>
							<CardDescription>Current fitness status of all soldiers — Fit or Unfit</CardDescription>
						</CardHeader>
						<CardContent>
							{allSoldiers.length === 0 ? (
								<p className="text-sm text-muted-foreground">No soldiers found.</p>
							) : (
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead className="border-b border-white/[0.1]">
										<tr className="text-left">
											<th className="pb-3 font-semibold text-slate-300">#</th>
											<th className="pb-3 font-semibold text-slate-300">Name</th>
											<th className="pb-3 font-semibold text-slate-300">Service No</th>
											<th className="pb-3 font-semibold text-slate-300">Rank</th>
											<th className="pb-3 font-semibold text-slate-300">Fitness Status</th>
										</tr>
									</thead>
									<tbody>
										{allSoldiers.map((soldier, idx) => (
											<tr key={soldier.id} className="border-b border-white/[0.06] hover:bg-white/[0.04]">
												<td className="py-3 text-slate-400">{idx + 1}</td>
												<td className="py-3 font-medium text-white">{soldier.name}</td>
												<td className="py-3 font-mono text-xs text-slate-300">{soldier.serviceNo}</td>
												<td className="py-3 text-slate-300">{soldier.rank}</td>
												<td className="py-3">
													<Badge className={
														soldier.fitnessStatus === 'Fit'
															? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
															: 'bg-red-500/20 text-red-400 border border-red-500/30'
													}>
														{soldier.fitnessStatus === 'Fit' ? '✓ Fit' : '✗ Unfit'}
													</Badge>
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