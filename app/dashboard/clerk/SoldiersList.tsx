"use client";

import React, { useState } from "react";

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
    const [form, setForm] = useState<Record<string, { name: string; duration: string; result: string }>>({});
    const [loadingFor, setLoadingFor] = useState<string | null>(null);

    if (!list || list.length === 0) {
        return <p className="text-sm text-gray-600">No soldiers found.</p>;
    }

    const submitMark = async (soldier: Item) => {
        const f = form[soldier.id] || { name: "", duration: "", result: "" };
        if (!f.name.trim()) return;
        setLoadingFor(soldier.id);
        try {
            const payload = { userId: soldier.id, exercise: { name: f.name, duration: f.duration, result: f.result } };
            // send to debug endpoint (server will echo). Replace with real API when available.
            const res = await fetch('/api/fitness/debug', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json().catch(() => ({}));
            console.log('Mark response', res.status, json);
            const newMark: Mark = { id: String(Date.now()), name: f.name, duration: f.duration, result: f.result, createdAt: new Date().toISOString() };
            setMarks((p) => ({ ...p, [soldier.id]: [...(p[soldier.id] || []), newMark] }));
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
                                <input value={form[s.id]?.name || ''} onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '', duration: '', result: '' }), name: e.target.value } }))} placeholder="Exercise name" className="border px-2 py-1 rounded" />
                                <input value={form[s.id]?.duration || ''} onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '', duration: '', result: '' }), duration: e.target.value } }))} placeholder="Duration (e.g. 20m)" className="border px-2 py-1 rounded" />
                                <select value={form[s.id]?.result || ''} onChange={(e) => setForm(p => ({ ...p, [s.id]: { ...(p[s.id] || { name: '', duration: '', result: '' }), result: e.target.value } }))} className="border px-2 py-1 rounded">
                                    <option value="">Result</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Missed">Missed</option>
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
