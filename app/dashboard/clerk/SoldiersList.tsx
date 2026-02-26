"use client";

import React, { useState, useEffect } from "react";

type Item = {
    id: string;
    name: string;
    serviceNo: string;
    rank: string;
    fitnessStatus: string;
};

type Mark = { id: string; name: string; duration?: string; result?: string; createdAt: string };

export default function SoldiersList({ items, limit }: { items: Item[]; limit?: number }) {
    const list = typeof limit === "number" ? items.slice(0, limit) : items;

    const [openFor, setOpenFor] = useState<string | null>(null);
    const [marks, setMarks] = useState<Record<string, Mark[]>>({});
    const [form, setForm] = useState<Record<string, { name: string; customName?: string; duration: string; result: string }>>({});
    const [loadingFor, setLoadingFor] = useState<string | null>(null);
    const [allocatedExercises, setAllocatedExercises] = useState<Record<string, string[]>>({});
    const [loadingExercises, setLoadingExercises] = useState<Record<string, boolean>>({});
    const [clerkUserId, setClerkUserId] = useState<string | null>(null);

    // Get clerk's user ID from localStorage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setClerkUserId(user.id);
        }
    }, []);

    // Fetch allocated exercises for each soldier for today
    useEffect(() => {
        const fetchExercisesForSoldiers = async () => {
            const exercises: Record<string, string[]> = {};
            
            for (const soldier of list) {
                setLoadingExercises((prev) => ({ ...prev, [soldier.id]: true }));
                try {
                    const response = await fetch(`/api/soldier-exercises?userId=${soldier.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        exercises[soldier.id] = data.exercises || [];
                    } else {
                        exercises[soldier.id] = [];
                    }
                } catch (error) {
                    console.error(`Failed to fetch exercises for soldier ${soldier.id}:`, error);
                    exercises[soldier.id] = [];
                } finally {
                    setLoadingExercises((prev) => ({ ...prev, [soldier.id]: false }));
                }
            }
            
            setAllocatedExercises(exercises);
        };

        if (list.length > 0) {
            fetchExercisesForSoldiers();
        }
    }, [list]);

    if (!list || list.length === 0) {
        return <p className="text-sm text-slate-400">No soldiers found.</p>;
    }

    const submitMark = async (soldier: Item) => {
        const f = form[soldier.id] || { name: "", customName: "", duration: "", result: "" };
        // Resolve actual exercise name: use customName when "Custom" is selected
        const exerciseName = f.name === '__custom__' ? (f.customName || '').trim() : f.name.trim();
        if (!exerciseName) return;
        if (!clerkUserId) {
            console.error('Clerk user ID not found');
            return;
        }

        setLoadingFor(soldier.id);
        try {
            // Save fitness test to database
            const res = await fetch('/api/fitness-test/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    soldierUserId: soldier.id,
                    clerkUserId: clerkUserId,
                    exerciseName: exerciseName,
                    duration: f.duration || null,
                    result: f.result || 'Unknown',
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to save fitness test');
            }

            const json = await res.json();
            console.log('Fitness test saved:', json);

            const newMark: Mark = { 
                id: json.test.id, 
                name: exerciseName, 
                duration: f.duration, 
                result: f.result, 
                createdAt: new Date().toISOString() 
            };
            setMarks((p) => ({ ...p, [soldier.id]: [...(p[soldier.id] || []), newMark] }));
            
            // Calculate and update soldier's fitness status based on pass rate
            try {
                const statusRes = await fetch(`/api/fitness/calculate-status?userId=${soldier.id}`, {
                    method: 'POST',
                });
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    console.log('Fitness status updated:', statusData);
                } else {
                    console.warn('Failed to update fitness status');
                }
            } catch (statusErr) {
                console.error('Error updating fitness status:', statusErr);
            }
            
            // reset form for this soldier
            setForm((p) => ({ ...p, [soldier.id]: { name: '', customName: '', duration: '', result: '' } }));
            setOpenFor(null);
        } catch (err) {
            console.error('Failed to submit mark', err);
        } finally {
            setLoadingFor(null);
        }
    };

    return (
        <div className="space-y-2">
            {list.map((s) => (
                <div key={s.id} className="border border-white/[0.08] rounded-xl p-3 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-white">{s.name} <span className="ml-2 text-sm text-slate-400">({s.rank})</span></h3>
                            <p className="text-sm text-slate-400">Service No: {s.serviceNo}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-300">{s.fitnessStatus}</p>
                            <div className="mt-2 flex justify-end gap-2">
                                <button className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500 transition" onClick={() => setOpenFor(openFor === s.id ? null : s.id)}>Add Exercise Mark</button>
                            </div>
                        </div>
                    </div>

                    {/* form */}
                    {openFor === s.id && (
                        <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <select value={form[s.id]?.name || ''} onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '', customName: '', duration: '', result: '' }), name: e.target.value, customName: '' } }))} className="border border-white/[0.1] bg-white/[0.05] text-slate-200 px-2 py-1 rounded-lg outline-none focus:ring-1 focus:ring-emerald-400/30">
                                    <option value="" className="bg-[#0c1425] text-slate-200">Select exercise</option>
                                    {loadingExercises[s.id] ? (
                                        <option disabled className="bg-[#0c1425] text-slate-400">Loading exercises...</option>
                                    ) : allocatedExercises[s.id] && allocatedExercises[s.id].length > 0 ? (
                                        allocatedExercises[s.id].map((ex) => (
                                            <option key={ex} value={ex} className="bg-[#0c1425] text-slate-200">{ex}</option>
                                        ))
                                    ) : (
                                        <option disabled className="bg-[#0c1425] text-slate-400">No exercises assigned for today</option>
                                    )}
                                    <option value="__custom__" className="bg-[#0c1425] text-slate-200">-- Custom --</option>
                                </select>
                                {/* Custom exercise name input — only shown when Custom is selected */}
                                {form[s.id]?.name === '__custom__' && (
                                    <input
                                        value={form[s.id]?.customName || ''}
                                        onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '__custom__', customName: '', duration: '', result: '' }), customName: e.target.value } }))}
                                        placeholder="Enter custom exercise name"
                                        className="border border-white/[0.1] bg-white/[0.05] text-slate-200 placeholder-slate-500 px-2 py-1 rounded-lg outline-none focus:ring-1 focus:ring-emerald-400/30"
                                        autoFocus
                                    />
                                )}
                                <select value={form[s.id]?.result || ''} onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '', duration: '', result: '' }), result: e.target.value } }))} className="border border-white/[0.1] bg-white/[0.05] text-slate-200 px-2 py-1 rounded-lg outline-none focus:ring-1 focus:ring-emerald-400/30">
                                    <option value="" className="bg-[#0c1425] text-slate-200">Result</option>
                                    <option value="Pass" className="bg-[#0c1425] text-slate-200">Pass</option>
                                    <option value="Fail" className="bg-[#0c1425] text-slate-200">Fail</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition" onClick={() => submitMark(s)} disabled={loadingFor === s.id}>{loadingFor === s.id ? 'Saving...' : 'Save Mark'}</button>
                                <button className="px-3 py-1 rounded-lg border border-white/[0.1] text-slate-300 hover:bg-white/[0.05] transition" onClick={() => setOpenFor(null)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* marks list */}
                    {marks[s.id] && marks[s.id].length > 0 && (
                        <div className="mt-3">
                            <h4 className="text-sm font-medium text-slate-300">Exercise Marks</h4>
                            <ul className="mt-2 text-sm list-disc ml-5 text-slate-400">
                                {marks[s.id].map(m => (
                                    <li key={m.id}>{m.name} {m.duration ? `• ${m.duration}` : ''} {m.result ? `• ${m.result}` : ''} <span className="text-xs text-slate-500">({new Date(m.createdAt).toLocaleString()})</span></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
