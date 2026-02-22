"use client";

import React from "react";

type Item = {
    id: string;
    name: string;
    serviceNo: string;
    rank: string;
    fitnessStatus: string;
};

export default function SoldiersList({ items, limit }: { items: Item[]; limit?: number }) {
    const list = typeof limit === "number" ? items.slice(0, limit) : items;

    if (!list || list.length === 0) {
        return <p className="text-sm text-gray-600">No soldiers found.</p>;
    }

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
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
