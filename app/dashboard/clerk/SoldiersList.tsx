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

// Predefined exercises for Fit vs Unfit soldiers (fallback if no allocated exercises)
const FIT_EXERCISES = [
    "Timed Run - 20m",
    "Push-ups - 3 sets",
    "Sit-ups - 3 sets",
    "Interval Sprints - 10x",
    "Swimming - 30m",
];

const UNFIT_EXERCISES = [
    "Brisk Walk - 20m",
    "Light Jog - 15m",
    "Assisted Push-ups - 3 sets",
    "Core Mobility - 10m",
    "Low-Impact Cycling - 20m",
];

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
        return <p className="text-sm text-gray-600">No soldiers found.</p>;
    }

    const submitMark = async (soldier: Item) => {
        const f = form[soldier.id] || { name: "", duration: "", result: "" };
        if (!f.name.trim()) return;
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
                    exerciseName: f.name,
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
                name: f.name, 
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
            setForm((p) => ({ ...p, [soldier.id]: { name: '', duration: '', result: '' } }));
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
                <div key={s.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">{s.name} <span className="ml-2 text-sm text-gray-500">({s.rank})</span></h3>
                            <p className="text-sm text-gray-600">Service No: {s.serviceNo}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm">{s.fitnessStatus}</p>
                            <div className="mt-2 flex justify-end gap-2">
                                <button className="px-2 py-1 rounded bg-blue-600 text-white text-sm" onClick={() => setOpenFor(openFor === s.id ? null : s.id)}>Add Exercise Mark</button>
                            </div>
                        </div>
                    </div>

                    {/* form */}
                    {openFor === s.id && (
                        <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <select value={form[s.id]?.name || ''} onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '', duration: '', result: '' }), name: e.target.value } }))} className="border px-2 py-1 rounded">
                                    <option value="">Select exercise</option>
                                    {loadingExercises[s.id] ? (
                                        <option disabled>Loading exercises...</option>
                                    ) : allocatedExercises[s.id] && allocatedExercises[s.id].length > 0 ? (
                                        allocatedExercises[s.id].map((ex) => (
                                            <option key={ex} value={ex}>{ex}</option>
                                        ))
                                    ) : (
                                        (s.fitnessStatus === 'Fit' ? FIT_EXERCISES : UNFIT_EXERCISES).map((ex) => (
                                            <option key={ex} value={ex}>{ex}</option>
                                        ))
                                    )}
                                    <option value="__custom__">-- Custom --</option>
                                </select>
                                {/* allow manual override when custom selected or to tweak name */}
                                <input value={form[s.id]?.name === '__custom__' ? form[s.id]?.customName || '' : (form[s.id]?.name || '')} onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '', customName: '', duration: '', result: '' }), customName: e.target.value, name: '__custom__' } }))} placeholder="Or enter exercise name" className="border px-2 py-1 rounded" />
                                <select value={form[s.id]?.result || ''} onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '', duration: '', result: '' }), result: e.target.value } }))} className="border px-2 py-1 rounded">
                                    <option value="">Result</option>
                                    <option value="Pass">Pass</option>
                                    <option value="Fail">Fail</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => submitMark(s)} disabled={loadingFor === s.id}>{loadingFor === s.id ? 'Saving...' : 'Save Mark'}</button>
                                <button className="px-3 py-1 rounded border" onClick={() => setOpenFor(null)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* marks list */}
                    {marks[s.id] && marks[s.id].length > 0 && (
                        <div className="mt-3">
                            <h4 className="text-sm font-medium">Exercise Marks</h4>
                            <ul className="mt-2 text-sm list-disc ml-5">
                                {marks[s.id].map(m => (
                                    <li key={m.id}>{m.name} {m.duration ? `• ${m.duration}` : ''} {m.result ? `• ${m.result}` : ''} <span className="text-xs text-gray-400">({new Date(m.createdAt).toLocaleString()})</span></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
