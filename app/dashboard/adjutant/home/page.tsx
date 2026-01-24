"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, AlertTriangle, CheckCircle2, Activity, FileText, UserX } from "lucide-react";
import { useState } from "react";

export default function AdjudantHomePage() {
	// Mock data - replace with real data from API
	const stats = {
		totalSoldiers: 150,
		fitSoldiers: 132,
		unfitSoldiers: 18,
		highRiskSoldiers: 8,
	};

	const recentAlerts = [
		{ id: 1, message: "5 soldiers overweight - immediate attention required", type: "warning" },
		{ id: 2, message: "Monthly mile test due in 3 days", type: "info" },
		{ id: 3, message: "3 soldiers failed IPFT standards", type: "danger" },
	];

	const upcomingTests = [
		{ id: 1, name: "Lt. Ahmed Khan", serviceNo: "BA-10234", date: "Jan 8, 2026" },
		{ id: 2, name: "Cpl. Rahman Ali", serviceNo: "BA-10567", date: "Jan 10, 2026" },
		{ id: 3, name: "Sgt. Karim Hassan", serviceNo: "BA-10892", date: "Jan 12, 2026" },
	];

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Adjutant Dashboard</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardHeader>
							<CardDescription className="flex items-center gap-2">
								<Users className="h-4 w-4" />
								Total Soldiers
							</CardDescription>
							<CardTitle className="text-3xl">{stats.totalSoldiers}</CardTitle>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardDescription className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-600" />
								Fit Soldiers
							</CardDescription>
							<CardTitle className="text-3xl text-green-600">{stats.fitSoldiers}</CardTitle>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardDescription className="flex items-center gap-2">
								<UserX className="h-4 w-4 text-red-600" />
								Unfit Soldiers
							</CardDescription>
							<CardTitle className="text-3xl text-red-600">{stats.unfitSoldiers}</CardTitle>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader>
							<CardDescription className="flex items-center gap-2">
								<AlertTriangle className="h-4 w-4 text-orange-600" />
								High Risk
							</CardDescription>
							<CardTitle className="text-3xl text-orange-600">{stats.highRiskSoldiers}</CardTitle>
						</CardHeader>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Recent Alerts</CardTitle>
							<CardDescription>Important updates and reminders</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{recentAlerts.map((alert) => (
									<div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
										<AlertTriangle className={`h-5 w-5 ${alert.type === "warning" ? "text-orange-600" : alert.type === "danger" ? "text-red-600" : "text-blue-600"}`} />
										<p className="text-sm flex-1">{alert.message}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Upcoming IPFT</CardTitle>
							<CardDescription>Scheduled fitness tests</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{upcomingTests.map((test) => (
									<div key={test.id} className="flex items-center justify-between p-3 rounded-lg border">
										<div>
											<p className="font-medium text-sm">{test.name}</p>
											<p className="text-xs text-muted-foreground">{test.serviceNo}</p>
										</div>
										<p className="text-sm">{test.date}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
							<Button variant="outline" className="justify-start" asChild>
								<Link href="/dashboard/adjutant/soldiers">
									<Users className="mr-2 h-4 w-4" />
									View Soldiers
								</Link>
							</Button>
							<Button variant="outline" className="justify-start" asChild>
								<Link href="/dashboard/adjutant/fitness-tests">
									<Activity className="mr-2 h-4 w-4" />
									Manage Tests
								</Link>
							</Button>
							<Button variant="outline" className="justify-start">
								<FileText className="mr-2 h-4 w-4" />
								Generate Report
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Create Weekly Plan</CardTitle>
						<CardDescription>Provide a weekly workout plan for Fit or Unfit soldiers</CardDescription>
					</CardHeader>
					<CardContent>
						<PlanForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function PlanForm() {
		// use Sunday-first ordering per request
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const [title, setTitle] = useState("");
	const [status, setStatus] = useState<"Fit" | "Unfit">("Fit");

		// Selected day shown in dropdown; default to Sunday
		const [selectedDay, setSelectedDay] = useState<string>(days[0]);

		// Exercises stored per-day so switching days shows their own list
		const [exercisesByDay, setExercisesByDay] = useState<Record<string, Array<{ name: string; duration: string; focus: string }>>>(() => {
			const initial: Record<string, Array<{ name: string; duration: string; focus: string }>> = {};
			days.forEach((d) => (initial[d] = [{ name: "", duration: "", focus: "" }]));
			return initial;
		});
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

		const updateExerciseForDay = (day: string, idx: number, field: keyof (typeof exercisesByDay)[string][number], value: string) => {
			setExercisesByDay((prev) => {
				const copy = { ...prev };
				copy[day] = copy[day].map((e) => ({ ...e }));
				copy[day][idx][field] = value;
				return copy;
			});
		};


		const addExerciseForDay = (day: string) => {
			setExercisesByDay((p) => ({ ...p, [day]: [...p[day], { name: "", duration: "", focus: "" }] }));
		};

		const removeExerciseForDay = (day: string, idx: number) => {
			setExercisesByDay((p) => ({ ...p, [day]: p[day].filter((_, i) => i !== idx) }));
		};

	const submit = async () => {
		if (!title.trim()) {
			setMessage("Please provide a title");
			return;
		}
		// ensure at least one exercise exists across the week
		const exercisesPayload = days.map((d) => ({ day: d, items: exercisesByDay[d].filter((it) => it.name.trim() !== "") }));
		const hasAny = exercisesPayload.some((p) => p.items.length > 0);
		if (!hasAny) {
			setMessage("Add at least one exercise to the plan");
			return;
		}
		setSubmitting(true);
		setMessage(null);
		try {
			// send to debug endpoint first to confirm payload reaches server
			try {
				const dbg = await fetch('/api/fitness/debug', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
				const dbgJson = await dbg.json().catch(() => ({}));
				console.log('Debug endpoint response', dbg.status, dbgJson);
				// surface debug info in message briefly (if debug fails, continue)
				if (!dbg.ok) {
					console.warn('Debug endpoint returned non-ok', dbg.status, dbgJson);
				}
			} catch (e) {
				console.warn('Failed to call debug endpoint', e);
			}

			// prepare payload containing per-day exercises (only non-empty items)
						const payload = {
							title,
							status,
							exercises: exercisesPayload,
							createdBy: 'adjutant',
						};

			const res = await fetch('/api/fitness/plans', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			console.log('Create plan response:', json, 'status', res.status);
			if (json?.ok) {
				setMessage(`Plan created${json.plan?.id ? ` (id: ${json.plan.id})` : ''}`);
				setTitle('');
						// reset per-day exercises to single empty row each
						setExercisesByDay(() => {
							const init: Record<string, Array<{ name: string; duration: string; focus: string }>> = {};
							days.forEach((d) => (init[d] = [{ name: '', duration: '', focus: '' }]));
							return init;
						});
			} else {
				// show error payload if present for easier debugging
				console.error('Failed to create plan', json);
				setMessage(json?.error || `Failed to create plan (status ${res.status})`);
			}
		} catch (err) {
			setMessage(String(err));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Plan title" className="border px-2 py-1 rounded" />
				<select value={status} onChange={(e) => setStatus(e.target.value as "Fit" | "Unfit")} className="border px-2 py-1 rounded">
					<option value="Fit">Fit</option>
					<option value="Unfit">Unfit</option>
				</select>
			</div>

			<div className="max-w-xs">
				<label className="text-sm block mb-1">Select day</label>
				<select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="border px-2 py-1 rounded w-full">
					{days.map((day) => (
						<option key={day} value={day}>{day}</option>
					))}
				</select>
			</div>

			<div className="border rounded p-3">
				<div className="flex items-center justify-between mb-2">
					<h4 className="font-semibold">Exercises for {selectedDay}</h4>
					<button type="button" className="text-sm text-blue-600" onClick={() => addExerciseForDay(selectedDay)}>Add Exercise</button>
				</div>
				<div className="space-y-2">
					{exercisesByDay[selectedDay].map((ex, idx) => (
						<div key={idx} className="grid grid-cols-3 gap-2 items-center">
							<input value={ex.name} onChange={(e) => updateExerciseForDay(selectedDay, idx, 'name', e.target.value)} placeholder="Exercise name" className="border px-2 py-1 rounded" />
							<input value={ex.duration} onChange={(e) => updateExerciseForDay(selectedDay, idx, 'duration', e.target.value)} placeholder="Duration" className="border px-2 py-1 rounded" />
							<div className="flex gap-2 items-center">
								<input value={ex.focus} onChange={(e) => updateExerciseForDay(selectedDay, idx, 'focus', e.target.value)} placeholder="Focus" className="border px-2 py-1 rounded" />
								{exercisesByDay[selectedDay].length > 1 && (
									<button type="button" className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => removeExerciseForDay(selectedDay, idx)}>Remove</button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{message && <div className="text-sm text-red-600">{message}</div>}

			<div>
				<button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={submit} disabled={submitting}>{submitting ? 'Creating...' : 'Create Plan'}</button>
			</div>
		</div>
	);
}
