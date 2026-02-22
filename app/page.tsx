"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { Activity, Shield, Users, Bell, TrendingUp, FileText, Target, Heart, Database } from "lucide-react";

function WelcomeScreen({ onFinish }: { onFinish: () => void }) {
	const [phase, setPhase] = useState(0); // 0=logo, 1=title, 2=subtitle, 3=bars, 4=fadeout

	useEffect(() => {
		const timers = [
			setTimeout(() => setPhase(1), 600),
			setTimeout(() => setPhase(2), 1400),
			setTimeout(() => setPhase(3), 2200),
			setTimeout(() => setPhase(4), 3800),
			setTimeout(() => onFinish(), 4600),
		];
		return () => timers.forEach(clearTimeout);
	}, [onFinish]);

	return (
		<div
			className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ${phase >= 4 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
		>
			{/* Animated background grid */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
				{/* Floating particles */}
				{[
					{ left: "10%", top: "15%", delay: "0s", dur: "3s" },
					{ left: "25%", top: "30%", delay: "0.5s", dur: "4s" },
					{ left: "45%", top: "10%", delay: "1s", dur: "2.5s" },
					{ left: "70%", top: "25%", delay: "1.5s", dur: "3.5s" },
					{ left: "85%", top: "45%", delay: "0.3s", dur: "4.5s" },
					{ left: "15%", top: "60%", delay: "2s", dur: "3s" },
					{ left: "55%", top: "70%", delay: "0.8s", dur: "2s" },
					{ left: "80%", top: "80%", delay: "1.2s", dur: "3.8s" },
					{ left: "35%", top: "85%", delay: "0.6s", dur: "4.2s" },
					{ left: "60%", top: "50%", delay: "1.8s", dur: "2.8s" },
					{ left: "5%", top: "40%", delay: "2.5s", dur: "3.2s" },
					{ left: "90%", top: "15%", delay: "0.2s", dur: "4s" },
					{ left: "40%", top: "40%", delay: "1.3s", dur: "3.6s" },
					{ left: "20%", top: "75%", delay: "0.9s", dur: "2.2s" },
					{ left: "75%", top: "60%", delay: "1.7s", dur: "3.4s" },
				].map((p, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 rounded-full bg-emerald-500/30 animate-pulse"
						style={{
							left: p.left,
							top: p.top,
							animationDelay: p.delay,
							animationDuration: p.dur,
						}}
					/>
				))}
			</div>

			{/* Logo */}
			<div
				className={`relative transition-all duration-700 ease-out ${phase >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
			>
				<div className="relative">
					{/* Glow ring */}
					<div className={`absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl transition-all duration-1000 ${phase >= 1 ? "scale-110 opacity-100" : "scale-75 opacity-0"}`} />
					<div className={`absolute -inset-2 rounded-full border-2 border-emerald-500/30 transition-all duration-1000 ${phase >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
						style={{ animation: phase >= 1 ? "spin 8s linear infinite" : "none" }}
					/>
					<Logo size={100} />
				</div>
			</div>

			{/* Title */}
			<div className={`mt-8 transition-all duration-700 ease-out ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
				<h1 className="text-5xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-green-300 to-emerald-500">
					TROOP TRACK
				</h1>
			</div>

			{/* Subtitle */}
			<div className={`mt-4 transition-all duration-700 ease-out ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
				<p className="text-lg md:text-xl text-slate-400 tracking-[0.3em] uppercase font-light">
					Soldier&apos;s Fitness Assessment & Monitoring
				</p>
			</div>

			{/* Loading bars */}
			<div className={`mt-12 w-64 transition-all duration-700 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}>
				<div className="flex gap-1.5 justify-center">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className="w-10 h-1 rounded-full bg-emerald-500/80"
							style={{
								animation: "pulse 1s ease-in-out infinite",
								animationDelay: `${i * 0.15}s`,
							}}
						/>
					))}
				</div>
				<p className="text-center text-xs text-slate-500 mt-4 tracking-widest uppercase">Initializing System</p>
			</div>

			{/* Military badge */}
			<div className={`absolute bottom-12 transition-all duration-700 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
				<div className="flex items-center gap-2 text-slate-600">
					<Shield className="w-4 h-4" />
					<span className="text-xs tracking-[0.2em] uppercase">Military Grade Fitness Solution</span>
					<Shield className="w-4 h-4" />
				</div>
			</div>
		</div>
	);
}

export default function HomePage() {
	const [showWelcome, setShowWelcome] = useState(true);

	return (
		<>
			{showWelcome && <WelcomeScreen onFinish={() => setShowWelcome(false)} />}
			<div className={`min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 transition-opacity duration-500 ${showWelcome ? "opacity-0" : "opacity-100"}`}>
			{/* Hero Section */}
			<section className="container mx-auto px-4 py-20 md:py-32">
				<div className="text-center space-y-6">
					<Badge variant="secondary" className="mb-4">
						<Shield className="w-3 h-3 mr-1" />
						Military Grade Fitness Solution
					</Badge>
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
						<span className="inline-flex items-center gap-3">
							<Logo size={56} />
							<span>TROOP TRACK</span>
						</span>
					</h1>
					<p className="text-xl md:text-2xl text-slate-300 mb-4">
						Soldier&apos;s Fitness Assessment & Monitoring System
					</p>
					<p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
						A centralized, efficient, and accurate platform to manage military fitness-related records.
						Replacing manual paperwork with automated scoring, real-time monitoring, and data-driven decision-making.
					</p>
					<div className="flex gap-4 justify-center flex-wrap">
						<Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
							<Link href="/auth">Get Started</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Problem Statement */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<Card className="bg-slate-900/50 border-slate-800">
					<CardHeader>
						<CardTitle className="text-2xl md:text-3xl text-white flex items-center gap-2">
							<Target className="w-8 h-8 text-red-500" />
							The Challenge
						</CardTitle>
					</CardHeader>
					<CardContent className="text-slate-300 space-y-3">
						<p>• Manual fitness evaluations result in delayed assessments and poor decision-making</p>
						<p>• Frequent errors and inconsistencies reduce accuracy of IPFT & fitness data</p>
						<p>• Important IPFT records are misplaced or incomplete, creating accountability gaps</p>
						<p>• Difficulty monitoring high-risk soldiers (injury, obesity, low fitness)</p>
						<p>• No automated alerts for soldiers failing to meet military fitness standards</p>
					</CardContent>
				</Card>
			</section>

			{/* Key Features */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
					<p className="text-slate-400 text-lg">Comprehensive tools for complete fitness management</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-colors">
						<CardHeader>
							<Users className="w-10 h-10 text-emerald-500 mb-2" />
							<CardTitle className="text-white">Soldier&apos;s Dashboard</CardTitle>
							<CardDescription className="text-slate-400">
								Comprehensive personal profiles with unique Service No, medical categories, injury tracking, and automated BMI calculations
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-colors">
						<CardHeader>
							<Activity className="w-10 h-10 text-blue-500 mb-2" />
							<CardTitle className="text-white">Fitness Test Module</CardTitle>
							<CardDescription className="text-slate-400">
								Standard military tests (mile, push-ups, sit-ups, pull-ups, rope climbing, swimming) with automated pass/fail and progress tracking
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-colors">
						<CardHeader>
							<Heart className="w-10 h-10 text-purple-500 mb-2" />
							<CardTitle className="text-white">Nutrition & Hydration</CardTitle>
							<CardDescription className="text-slate-400">
								Personalized nutrition and hydration plans based on medical conditions, training intensity, and weight goals
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="bg-slate-900/50 border-slate-800 hover:border-yellow-500/50 transition-colors">
						<CardHeader>
							<Bell className="w-10 h-10 text-yellow-500 mb-2" />
							<CardTitle className="text-white">Alerts & Notifications</CardTitle>
							<CardDescription className="text-slate-400">
								IPFT reminders, low-performance alerts, overweight notifications, and military standards compliance tracking
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="bg-slate-900/50 border-slate-800 hover:border-orange-500/50 transition-colors">
						<CardHeader>
							<TrendingUp className="w-10 h-10 text-orange-500 mb-2" />
							<CardTitle className="text-white">Command Dashboard</CardTitle>
							<CardDescription className="text-slate-400">
								Real-time unit and individual fitness monitoring with fit vs unfit percentages and training effectiveness comparison
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="bg-slate-900/50 border-slate-800 hover:border-pink-500/50 transition-colors">
						<CardHeader>
							<FileText className="w-10 h-10 text-pink-500 mb-2" />
							<CardTitle className="text-white">Reports & Documentation</CardTitle>
							<CardDescription className="text-slate-400">
								Comprehensive fitness test reports, weight limitations, medical categories, and meal schedules in PDF format
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</section>

			{/* Objectives */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mission Objectives</h2>
					<p className="text-slate-400 text-lg">Advancing military fitness through technology</p>
				</div>

				<div className="max-w-4xl mx-auto space-y-4">
					{[
						"Automate fitness evaluations for timely, accurate assessments with real-time visibility",
						"Ensure complete, error-free, and securely stored IPFT records through centralization",
						"Identify high-risk soldiers through integrated performance and health analytics",
						"Enable long-term tracking of soldier progress and overall unit readiness",
						"Issue automated notifications for monthly mile tests and required physical activities"
					].map((objective, index) => (
						<Card key={index} className="bg-slate-900/50 border-slate-800">
							<CardContent className="flex items-start gap-4 p-6">
								<Badge variant="secondary" className="mt-1">{index + 1}</Badge>
								<p className="text-slate-300 text-lg">{objective}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Technology Stack */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technology Stack</h2>
					<p className="text-slate-400 text-lg">Built with modern, reliable technologies</p>
				</div>

				<div className="max-w-3xl mx-auto">
					<Card className="bg-slate-900/50 border-slate-800">
						<CardContent className="p-8">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								<div className="text-center space-y-3">
									<Database className="w-12 h-12 mx-auto text-emerald-500" />
									<h3 className="text-white font-semibold text-lg">Frontend</h3>
									<div className="space-y-2">
										<Badge variant="outline" className="border-emerald-500/50 text-emerald-400">Next.js</Badge>
										<Badge variant="outline" className="border-emerald-500/50 text-emerald-400">Chart.js</Badge>
									</div>
								</div>

								<div className="text-center space-y-3">
									<Database className="w-12 h-12 mx-auto text-blue-500" />
									<h3 className="text-white font-semibold text-lg">Backend</h3>
									<div className="space-y-2">
										<Badge variant="outline" className="border-blue-500/50 text-blue-400">Express.js</Badge>
										<Badge variant="outline" className="border-blue-500/50 text-blue-400">Socket.io</Badge>
									</div>
								</div>

								<div className="text-center space-y-3">
									<Database className="w-12 h-12 mx-auto text-purple-500" />
									<h3 className="text-white font-semibold text-lg">Database</h3>
									<div className="space-y-2">
										<Badge variant="outline" className="border-purple-500/50 text-purple-400">PostgreSQL</Badge>
										<Badge variant="outline" className="border-purple-500/50 text-purple-400">Redis</Badge>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Target Users */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Target Users</h2>
					<p className="text-slate-400 text-lg">Designed for every level of military personnel</p>
				</div>

				<div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
					{["Unit Personnel (Soldiers)", "SM/JCOs", "Company Commanders", "Staff Officers", "Commanding Officer", "Health Staff"].map((user) => (
						<Badge key={user} variant="secondary" className="text-base py-2 px-4">
							{user}
						</Badge>
					))}
				</div>
			</section>

			{/* Footer CTA */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<Card className="bg-linear-to-r from-emerald-900/50 to-blue-900/50 border-emerald-500/30">
					<CardContent className="p-12 text-center space-y-6">
						<h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Transform Your Unit&apos;s Fitness?</h2>
						<p className="text-slate-300 text-lg max-w-2xl mx-auto">
							Join the modern defense forces in using data-driven decision-making to ensure soldier readiness and mission success.
						</p>
						<Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
							Request Demo
						</Button>
					</CardContent>
				</Card>
			</section>

			{/* Footer */}
			<footer className="border-t border-slate-800 py-8">
				<div className="container mx-auto px-4 text-center text-slate-400">
					<p>© 2026 TROOP TRACK - Military Institute of Science & Technology</p>
					<p className="text-sm mt-2">Department of Computer Science & Technology</p>
				</div>
			</footer>
		</div>
		</>
	);
}