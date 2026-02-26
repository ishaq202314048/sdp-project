"use client";
import React from "react";
import { Shield, Users, ClipboardCheck, Activity, FileText, Bell, Download, Lock, ChevronRight, Dumbbell, Calendar, BarChart3, UserCheck, AlertTriangle, Heart } from "lucide-react";

export default function PosterPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white p-2 md:p-4 print:p-1 print:bg-white print:text-black">
            <div className="max-w-[1400px] mx-auto space-y-2 p-1 md:p-2 print:p-1 print:bg-white print:text-black">

                {/* ============ HEADER ============ */}
                <div className="rounded-xl border border-white/10 p-2 text-center space-y-1">
                    {/* Project Icon */}
                    <div className="flex justify-center mb-1">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-lg overflow-hidden">
                            <img src="/logo.png" alt="Project Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                        TROOP TRACK
                    </h1>
                    <h2 className="text-lg md:text-xl font-bold text-white/90 uppercase">
                        Soldier's Fitness Assessment & Monitoring System
                    </h2>
                    <p className="text-emerald-200/80 text-sm max-w-xl mx-auto">
                        Digital platform for military fitness management, real-time tracking, and reporting.
                    </p>
                </div>

                {/* ============ INTRODUCTION + OBJECTIVES ============ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Introduction */}
                    <div className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-wider text-white">Introduction</h3>
                        </div>
                        <div className="h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
                        <ul className="space-y-3 text-slate-300 text-base leading-relaxed">
                            <li className="flex gap-2">
                                <span className="text-emerald-400 mt-1">●</span>
                                <span><strong className="text-white">Troop Track</strong> is a role-based digital fitness management system designed for military units to monitor and assess soldier physical fitness.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-emerald-400 mt-1">●</span>
                                <span><strong className="text-white">Three-tier architecture</strong> with Adjutant, Clerk, and Soldier dashboards — each with specific responsibilities and permissions.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-emerald-400 mt-1">●</span>
                                <span><strong className="text-white">Real-time tracking</strong> of fitness status (Fit/Unfit), BMI calculation, weekly exercise plans, IPFT scheduling, and PDF report generation.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-emerald-400 mt-1">●</span>
                                <span><strong className="text-white">Secure authentication</strong> with JWT tokens, bcrypt password hashing, and adjutant-controlled soldier approval system.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Objectives */}
                    <div className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                                <ClipboardCheck className="w-5 h-5 text-teal-400" />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider text-white">Objectives</h3>
                        </div>
                        <div className="h-[2px] bg-gradient-to-r from-teal-500/50 to-transparent" />
                        <ul className="space-y-3 text-slate-300 text-sm leading-relaxed">
                            <li className="flex gap-2">
                                <span className="text-teal-400 mt-1">●</span>
                                <span><strong className="text-white">Digitize fitness management</strong> with centralized soldier data, replacing manual tracking methods.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-teal-400 mt-1">●</span>
                                <span><strong className="text-white">Automate fitness assessments</strong> — BMI calculation, fitness status classification, and weekly exercise plan assignment.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-teal-400 mt-1">●</span>
                                <span><strong className="text-white">Enable real-time reporting</strong> — PDF generation for fitness tests, IPFT reports, and soldier lists with download capability.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-teal-400 mt-1">●</span>
                                <span><strong className="text-white">Improve unit readiness</strong> through data-driven fitness insights, progress charts, and notification systems.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ============ SYSTEM FEATURES ============ */}
                <div className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold uppercase tracking-wider text-white">System Features</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {[
                            { icon: Dumbbell, title: "Fitness Plans", desc: "Create separate weekly workout plans for Fit and Unfit soldiers with daily exercises", color: "emerald" },
                            { icon: ClipboardCheck, title: "Exercise Marking", desc: "Clerks mark daily exercise pass/fail for each soldier from the assigned plan", color: "blue" },
                            { icon: Calendar, title: "IPFT Scheduling", desc: "Adjutant sets IPFT dates visible to all soldiers with countdown display", color: "purple" },
                            { icon: FileText, title: "PDF Reports", desc: "Generate & download reports for fit/unfit soldiers, IPFT results, and weekly plans", color: "amber" },
                            { icon: Bell, title: "Notifications", desc: "Real-time alerts for unfit soldiers, missing data, upcoming IPFT, and clerk reports", color: "red" },
                            { icon: UserCheck, title: "Soldier Approval", desc: "New soldier accounts require adjutant approval before they can access the system", color: "teal" },
                            { icon: BarChart3, title: "Progress Charts", desc: "Visual pass rate trends, monthly fitness data, and per-exercise progress tracking", color: "cyan" },
                            { icon: Download, title: "PDF Downloads", desc: "Download weekly fitness plans, fitness test reports, and clerk-attached PDF documents", color: "orange" },
                        ].map((feature, i) => (
                            <div key={i} className={`rounded-xl bg-${feature.color}-500/[0.08] border border-${feature.color}-500/20 p-4 space-y-2`}
                                style={{
                                    backgroundColor: feature.color === 'emerald' ? 'rgba(16,185,129,0.08)' :
                                        feature.color === 'blue' ? 'rgba(59,130,246,0.08)' :
                                        feature.color === 'purple' ? 'rgba(168,85,247,0.08)' :
                                        feature.color === 'amber' ? 'rgba(245,158,11,0.08)' :
                                        feature.color === 'red' ? 'rgba(239,68,68,0.08)' :
                                        feature.color === 'teal' ? 'rgba(20,184,166,0.08)' :
                                        feature.color === 'cyan' ? 'rgba(6,182,212,0.08)' :
                                        feature.color === 'pink' ? 'rgba(236,72,153,0.08)' :
                                        'rgba(249,115,22,0.08)',
                                    borderColor: feature.color === 'emerald' ? 'rgba(16,185,129,0.2)' :
                                        feature.color === 'blue' ? 'rgba(59,130,246,0.2)' :
                                        feature.color === 'purple' ? 'rgba(168,85,247,0.2)' :
                                        feature.color === 'amber' ? 'rgba(245,158,11,0.2)' :
                                        feature.color === 'red' ? 'rgba(239,68,68,0.2)' :
                                        feature.color === 'teal' ? 'rgba(20,184,166,0.2)' :
                                        feature.color === 'cyan' ? 'rgba(6,182,212,0.2)' :
                                        feature.color === 'pink' ? 'rgba(236,72,153,0.2)' :
                                        'rgba(249,115,22,0.2)'
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <feature.icon className="w-5 h-5" style={{
                                        color: feature.color === 'emerald' ? '#34d399' :
                                            feature.color === 'blue' ? '#60a5fa' :
                                            feature.color === 'purple' ? '#c084fc' :
                                            feature.color === 'amber' ? '#fbbf24' :
                                            feature.color === 'red' ? '#f87171' :
                                            feature.color === 'teal' ? '#2dd4bf' :
                                            feature.color === 'cyan' ? '#22d3ee' :
                                            feature.color === 'pink' ? '#f472b6' :
                                            '#fb923c'
                                    }} />
                                    <h4 className="font-bold text-white text-base">{feature.title}</h4>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            

                

                {/* ============ TECHNOLOGY STACK ============ */}
                <div className="rounded-xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-2 space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-white">Technology Stack</h3>
                    </div>
                    <div className="h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent mb-1" />
                    <div className="grid grid-cols-8 gap-2">
                        {[
                            { name: "Next.js 16", desc: "React Framework", icon: "⚡", bg: "rgba(255,255,255,0.06)" },
                            { name: "TypeScript", desc: "Type Safety", icon: "📘", bg: "rgba(59,130,246,0.08)" },
                            { name: "SQLite", desc: "Database", icon: "🗄️", bg: "rgba(168,85,247,0.08)" },
                            { name: "JWT Auth", desc: "Authentication", icon: "🔐", bg: "rgba(245,158,11,0.08)" },
                            { name: "Tailwind CSS", desc: "Styling", icon: "🎨", bg: "rgba(6,182,212,0.08)" },
                            { name: "Recharts", desc: "Data Visualization", icon: "📊", bg: "rgba(239,68,68,0.08)" },
                            { name: "pdf-lib", desc: "PDF Generation", icon: "📄", bg: "rgba(236,72,153,0.08)" },
                            { name: "bcryptjs", desc: "Password Hashing", icon: "🔒", bg: "rgba(20,184,166,0.08)" },
                        ].map((tech, i) => (
                            <div
                                key={i}
                                className="rounded border border-white/10 p-1 flex flex-col items-center text-center"
                                style={{ backgroundColor: tech.bg }}
                            >
                                <span className="text-lg">{tech.icon}</span>
                                <p className="font-bold text-white text-sm">{tech.name}</p>
                                <p className="text-xs text-slate-400">{tech.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ============ WORKFLOW: ROLE-BASED SYSTEM ============ */}
                <div className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-white">Workflow: Role-Based System</h3>
                    </div>
                    <div className="h-[2px] bg-gradient-to-r from-amber-500/50 to-transparent" />

                    {/* Flow arrows */}
                    <div className="flex flex-col md:flex-row items-stretch gap-4">
                        {/* Adjutant */}
                        <div className="flex-1 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/[0.06] p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h4 className="font-bold text-emerald-400 uppercase tracking-wide text-sm">Adjutant</h4>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0" /> Approve new soldier registrations</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0" /> Create weekly fitness plans (Fit/Unfit)</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0" /> Schedule IPFT dates</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0" /> View soldiers list & remove soldiers</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0" /> Review notifications & reports</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0" /> Download PDF reports</li>
                            </ul>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:flex items-center">
                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                <ChevronRight className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* Clerk */}
                        <div className="flex-1 rounded-xl border-2 border-blue-500/30 bg-blue-500/[0.06] p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center">
                                    <ClipboardCheck className="w-4 h-4 text-blue-400" />
                                </div>
                                <h4 className="font-bold text-blue-400 uppercase tracking-wide text-sm">Clerk</h4>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" /> View all soldiers with fitness status</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" /> Mark daily exercise pass/fail</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" /> Send reports to adjutant (with PDF)</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" /> Generate fitness/IPFT reports</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" /> View monthly fitness trends</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" /> Send new soldiers report</li>
                            </ul>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:flex items-center">
                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                <ChevronRight className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* Soldier */}
                        <div className="flex-1 rounded-xl border-2 border-amber-500/30 bg-amber-500/[0.06] p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-amber-400" />
                                </div>
                                <h4 className="font-bold text-amber-400 uppercase tracking-wide text-sm">Soldier</h4>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400 flex-shrink-0" /> View personal fitness dashboard</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400 flex-shrink-0" /> Check weekly workout routine</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400 flex-shrink-0" /> Track fitness progress & charts</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400 flex-shrink-0" /> View next IPFT date & countdown</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400 flex-shrink-0" /> Download weekly plan as PDF</li>
                                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400 flex-shrink-0" /> Update personal profile</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ============ WORKFLOW: FITNESS ASSESSMENT CYCLE ============ */}
                <div className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-4 space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h3 className="text-base font-bold uppercase tracking-wider text-white">Workflow: Fitness Assessment Cycle</h3>
                    </div>
                    <div className="h-[2px] bg-gradient-to-r from-cyan-500/50 to-transparent mb-2" />

                    <div className="flex flex-wrap justify-center items-center gap-2">
                        {[
                            { step: "1", title: "Signup", icon: "👤", color: "#34d399" },
                            { step: "2", title: "Approval", icon: "✅", color: "#60a5fa" },
                            { step: "3", title: "Plan", icon: "📋", color: "#c084fc" },
                            { step: "4", title: "Exercise", icon: "💪", color: "#fbbf24" },
                            { step: "5", title: "Status", icon: "📊", color: "#f87171" },
                            { step: "6", title: "IPFT", icon: "🏃", color: "#2dd4bf" },
                            { step: "7", title: "Report", icon: "📄", color: "#f472b6" },
                        ].map((item, i) => (
                            <React.Fragment key={i}>
                                <div className="flex flex-col items-center w-[70px]">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg mb-1" style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-white">{item.title}</span>
                                </div>
                                {i < 6 && (
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* ============ USER METRICS + FUTURE SCOPE ============ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* User Metrics */}
                    <div className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider text-white">Key Metrics</h3>
                        </div>
                        <div className="h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: "3", label: "User Roles", color: "#34d399" },
                                { value: "15+", label: "API Endpoints", color: "#60a5fa" },
                                { value: "7", label: "Database Models", color: "#c084fc" },
                                { value: "20+", label: "Dashboard Pages", color: "#fbbf24" },
                                { value: "5+", label: "PDF Templates", color: "#f87171" },
                                { value: "4+", label: "Chart Types", color: "#2dd4bf" },
                            ].map((metric, i) => (
                                <div key={i} className="rounded-xl bg-white/[0.06] border border-white/10 p-3 text-center">
                                    <p className="text-2xl font-black" style={{ color: metric.color }}>{metric.value}</p>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{metric.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Future Scope */}
                    <div className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wider text-white">Future Scope</h3>
                        </div>
                        <div className="h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent" />
                        <ul className="space-y-2.5 text-slate-300 text-sm">
                            <li className="flex gap-2">
                                <span className="text-purple-400 mt-0.5">●</span>
                                <span>Integrate <strong className="text-white">AI-powered fitness predictions</strong> based on historical soldier data</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-purple-400 mt-0.5">●</span>
                                <span>Add <strong className="text-white">mobile app</strong> for soldiers with push notifications and offline support</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-purple-400 mt-0.5">●</span>
                                <span>Implement <strong className="text-white">multi-unit support</strong> with battalion-level fitness dashboards</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-purple-400 mt-0.5">●</span>
                                <span>Add <strong className="text-white">dietary tracking</strong> and meal planning integration for holistic health management</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-purple-400 mt-0.5">●</span>
                                <span>Deploy to <strong className="text-white">PostgreSQL + Vercel</strong> for production-grade cloud hosting</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ============ CONCLUSION ============ */}
                <div className="rounded-xl bg-gradient-to-br from-emerald-900/40 via-emerald-800/20 to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 p-3 space-y-2">
    <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Lock className="w-4 h-4 text-emerald-400" />
        </div>
        <h3 className="text-base font-bold uppercase tracking-wider text-white">Conclusion</h3>
    </div>
    <div className="h-[1.5px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
    <p className="text-slate-300 text-sm leading-tight">
        <strong className="text-white">Troop Track</strong> is a modern digital fitness management platform for military units.
        Built with <strong className="text-emerald-400">Next.js 16</strong>, <strong className="text-emerald-400">TypeScript</strong>, and other tools,
        it provides a secure, role-based system for adjutants, clerks, and soldiers. The system automates BMI calculation, generates PDF reports,
        provides real-time charts, and ensures unit readiness through centralized monitoring — all in a premium dark glassmorphism UI.
    </p>
</div>

                {/* ============ FOOTER ============ */}
                <div className="text-center py-4 space-y-1">
                    <p className="text-slate-500 text-sm">
                        Developed with ❤️ using Next.js, TypeScript, Prisma, and Tailwind CSS
                    </p>
                    <p className="text-slate-600 text-xs">
                        TROOP TRACK — Soldier&apos;s Fitness Assessment & Monitoring System | 2026
                    </p>
                </div>
            </div>
        </div>
    );
}