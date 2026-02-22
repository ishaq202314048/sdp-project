"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, UserX, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdjudantHomePage() {
	const [stats, setStats] = useState({ totalSoldiers: 0, fitSoldiers: 0, unfitSoldiers: 0 });

	const [ipftDate, setIpftDate] = useState<string>("");
	const [ipftSaved, setIpftSaved] = useState(false);

	useEffect(() => {
		// Fetch soldiers from database
		fetch("/api/soldiers")
			.then(res => res.json())
			.then(data => {
				if (Array.isArray(data)) {
					const fitCount = data.filter((s: { fitnessStatus: string }) => s.fitnessStatus === 'Fit').length;
					const unfitCount = data.filter((s: { fitnessStatus: string }) => s.fitnessStatus === 'Unfit').length;
					setStats({ totalSoldiers: data.length, fitSoldiers: fitCount, unfitSoldiers: unfitCount });
				}
			})
			.catch(err => console.error('Failed to fetch soldiers:', err));

		fetch("/api/fitness-test/ipft-date")
			.then(res => res.json())
			.then(data => { if (data.date) setIpftDate(data.date); })
			.catch(() => {});
	}, []);

	const handleSaveIpftDate = async () => {
		if (!ipftDate) return;
		try {
			const res = await fetch("/api/fitness-test/ipft-date", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ date: ipftDate }),
			});
			if (res.ok) {
				setIpftSaved(true);
				setTimeout(() => setIpftSaved(false), 3000);
			}
		} catch (err) {
			console.error("Failed to save IPFT date", err);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Adjutant Dashboard</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CalendarDays className="h-5 w-5" />
							IPFT Date
						</CardTitle>
						<CardDescription>Set the date for the next Individual Physical Fitness Test</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
							<div className="space-y-2 flex-1">
								<label htmlFor="ipft-date" className="text-sm font-medium">Select Date</label>
								<input
									id="ipft-date"
									type="date"
									value={ipftDate}
									onChange={(e) => setIpftDate(e.target.value)}
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
								/>
							</div>
							<button
								onClick={handleSaveIpftDate}
								disabled={!ipftDate}
								className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							>
								Save IPFT Date
							</button>
						</div>
						{ipftSaved && (
							<p className="mt-3 text-sm text-green-600 font-medium">✓ IPFT date saved successfully!</p>
						)}
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

		// prepare payload containing per-day exercises (only non-empty items)
		const payload = {
			title,
			status,
			exercises: exercisesPayload,
			createdBy: 'adjutant',
		};

		setSubmitting(true);
		setMessage(null);
		try {
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
		<div className="space-y-6">
			{/* Status Selection */}
			<div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-bold text-lg mb-3">Select Soldier Category</h3>
				<div className="grid grid-cols-2 gap-3">
					<button
						onClick={() => {
							setStatus("Fit");
							setMessage(null);
						}}
						className={`p-4 rounded-lg border-2 transition ${
							status === "Fit" ? "border-green-500 bg-green-100 text-green-700" : "border-gray-300 bg-white text-gray-700 hover:bg-green-50"
						}`}
					>
						<div className="font-semibold">Fit Soldiers</div>
						<div className="text-xs text-gray-600">High-intensity training</div>
					</button>
					<button
						onClick={() => {
							setStatus("Unfit");
							setMessage(null);
						}}
						className={`p-4 rounded-lg border-2 transition ${
							status === "Unfit" ? "border-orange-500 bg-orange-100 text-orange-700" : "border-gray-300 bg-white text-gray-700 hover:bg-orange-50"
						}`}
					>
						<div className="font-semibold">Unfit Soldiers</div>
						<div className="text-xs text-gray-600">Moderate-intensity training</div>
					</button>
				</div>
			</div>

			{/* Plan Title Input */}
			<div>
				<label className="block text-sm font-semibold mb-2">Plan Title</label>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder={`e.g., Weekly ${status} Training Program`}
					className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
				/>
			</div>

			{/* Weekly Day Selection */}
			<div>
				<label className="block text-sm font-semibold mb-2">Select Day to Add Exercises</label>
				<select
					value={selectedDay}
					onChange={(e) => setSelectedDay(e.target.value)}
					className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
				>
					{days.map((day) => (
						<option key={day} value={day}>
							{day}
						</option>
					))}
				</select>
			</div>

			{/* Weekly Preview */}
			<div className="bg-gray-50 rounded-lg p-3">
				<div className="text-sm font-semibold text-gray-700 mb-2">Week Overview (exercises added)</div>
				<div className="grid grid-cols-7 gap-1">
					{days.map((day) => {
						const hasExercises = exercisesByDay[day].some((e) => e.name.trim() !== "");
						return (
							<div
								key={day}
								className={`p-2 rounded text-center text-xs font-semibold ${
									hasExercises ? (day === selectedDay ? "bg-blue-500 text-white" : "bg-green-500 text-white") : day === selectedDay ? "bg-blue-300 text-white" : "bg-gray-200 text-gray-600"
								}`}
							>
								{day.slice(0, 3)}
								{hasExercises && <div className="text-xs">✓</div>}
							</div>
						);
					})}
				</div>
			</div>

			{/* Exercise Editor */}
			<div className="border rounded-lg p-4 bg-white">
				<div className="flex items-center justify-between mb-3">
					<h4 className="font-semibold text-lg">Exercises for {selectedDay}</h4>
					<button
						type="button"
						className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
						onClick={() => addExerciseForDay(selectedDay)}
					>
						+ Add Exercise
					</button>
				</div>
				<div className="space-y-3">
					{exercisesByDay[selectedDay].map((ex, idx) => (
						<div key={idx} className="border rounded p-3 bg-gray-50">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
								<div>
									<label className="text-xs font-semibold text-gray-600">Exercise Name</label>
									<input
										value={ex.name}
										onChange={(e) => updateExerciseForDay(selectedDay, idx, "name", e.target.value)}
										placeholder="e.g., Push-ups, Running"
										className="w-full border px-2 py-1 rounded"
									/>
								</div>
								<div>
									<label className="text-xs font-semibold text-gray-600">Duration</label>
									<input
										value={ex.duration}
										onChange={(e) => updateExerciseForDay(selectedDay, idx, "duration", e.target.value)}
										placeholder="e.g., 30 min"
										className="w-full border px-2 py-1 rounded"
									/>
								</div>
								<div className="flex gap-2 items-end">
									<div className="flex-1">
										<label className="text-xs font-semibold text-gray-600">Focus Area</label>
										<input
											value={ex.focus}
											onChange={(e) => updateExerciseForDay(selectedDay, idx, "focus", e.target.value)}
											placeholder="e.g., Cardio, Strength"
											className="w-full border px-2 py-1 rounded"
										/>
									</div>
									{exercisesByDay[selectedDay].length > 1 && (
										<button
											type="button"
											className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 whitespace-nowrap"
											onClick={() => removeExerciseForDay(selectedDay, idx)}
										>
											Remove
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Messages */}
			{message && <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">{message}</div>}

			{/* Submit Button */}
			<div>
				<button
					className={`w-full py-2 rounded-lg font-semibold text-white transition ${
						submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
					}`}
					onClick={submit}
					disabled={submitting}
				>
					{submitting ? "Creating Plan..." : `Create ${status} Weekly Plan`}
				</button>
			</div>

			{/* Saved Plans Summary */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="text-sm text-gray-600">
					<p className="font-semibold mb-1">💡 Tip:</p>
					<p>Create separate plans for Fit and Unfit soldiers. The weekly routine will repeat monthly for each soldier group.</p>
				</div>
			</div>
		</div>
	);
}
