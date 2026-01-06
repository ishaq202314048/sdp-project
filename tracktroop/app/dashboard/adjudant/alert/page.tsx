"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Alert {
    id: string;
    type: "IPFT Reminder" | "Low Performance" | "Overweight" | "Medical" | "Injury" | "Test Due";
    priority: "High" | "Medium" | "Low";
    soldierName: string;
    serviceNo: string;
    rank: string;
    message: string;
    date: string;
    status: "Unread" | "Read" | "Acknowledged";
    details?: string;
}

const mockAlerts: Alert[] = [
    {
        id: "1",
        type: "IPFT Reminder",
        priority: "High",
        soldierName: "Lt. Rahman",
        serviceNo: "202114190",
        rank: "Lieutenant",
        message: "IPFT test scheduled for next week",
        date: "2026-01-07",
        status: "Unread",
        details: "Annual IPFT test due on January 14, 2026. Please ensure soldier is prepared."
    },
    {
        id: "2",
        type: "Low Performance",
        priority: "High",
        soldierName: "Lt. Ahmed",
        serviceNo: "202114193",
        rank: "Lieutenant",
        message: "Failed 3 consecutive monthly fitness tests",
        date: "2026-01-06",
        status: "Unread",
        details: "Soldier scored 392/600 in last test. Mile run time: 9:15 (Failed). Requires immediate intervention and remedial training."
    },
    {
        id: "3",
        type: "Overweight",
        priority: "High",
        soldierName: "Sgt. Khan",
        serviceNo: "202114201",
        rank: "Sergeant",
        message: "BMI exceeds military standard (32.5)",
        date: "2026-01-06",
        status: "Read",
        details: "Current weight: 95kg, Height: 170cm. BMI: 32.5. Standard limit: 27.5. Requires nutrition plan adjustment."
    },
    {
        id: "4",
        type: "Test Due",
        priority: "Medium",
        soldierName: "Capt. Hassan",
        serviceNo: "202114194",
        rank: "Captain",
        message: "Quarterly fitness test overdue by 5 days",
        date: "2026-01-05",
        status: "Read",
        details: "Last test completed on October 5, 2025. Quarterly test was due on January 1, 2026."
    },
    {
        id: "5",
        type: "Injury",
        priority: "Medium",
        soldierName: "Cpl. Hasan",
        serviceNo: "202114205",
        rank: "Corporal",
        message: "Recovering from knee injury - fitness test exemption expires soon",
        date: "2026-01-04",
        status: "Acknowledged",
        details: "Medical exemption ends on January 15, 2026. Requires medical clearance before resuming full fitness activities."
    },
    {
        id: "6",
        type: "Medical",
        priority: "Medium",
        soldierName: "Lt. Karim",
        serviceNo: "202114198",
        rank: "Lieutenant",
        message: "Medical category changed to C - fitness standards adjusted",
        date: "2026-01-03",
        status: "Acknowledged",
        details: "Medical category downgraded from B to C. Modified fitness standards now apply."
    },
    {
        id: "7",
        type: "IPFT Reminder",
        priority: "Low",
        soldierName: "Pvt. Rahim",
        serviceNo: "202114210",
        rank: "Private",
        message: "IPFT test scheduled in 30 days",
        date: "2026-01-02",
        status: "Read",
        details: "Annual IPFT scheduled for February 7, 2026. Standard preparation time provided."
    },
    {
        id: "8",
        type: "Low Performance",
        priority: "High",
        soldierName: "Sgt. Aziz",
        serviceNo: "202114207",
        rank: "Sergeant",
        message: "Swimming test failed - below minimum standard",
        date: "2026-01-01",
        status: "Unread",
        details: "Swimming time: 5:30 (Standard: 4:00). Requires additional training and retest."
    }
];

export default function AlertPage() {
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Calculate statistics
    const totalAlerts = alerts.length;
    const unreadAlerts = alerts.filter(a => a.status === "Unread").length;
    const highPriorityAlerts = alerts.filter(a => a.priority === "High").length;
    const acknowledgedAlerts = alerts.filter(a => a.status === "Acknowledged").length;

    const statsCards = [
        {
            title: "Total Alerts",
            value: totalAlerts,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Unread",
            value: unreadAlerts,
            color: "text-red-600",
            bgColor: "bg-red-50"
        },
        {
            title: "High Priority",
            value: highPriorityAlerts,
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            title: "Acknowledged",
            value: acknowledgedAlerts,
            color: "text-green-600",
            bgColor: "bg-green-50"
        }
    ];

    // Filter alerts
    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch =
            alert.soldierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.serviceNo.includes(searchTerm) ||
            alert.message.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === "all" || alert.type === filterType;
        const matchesPriority = filterPriority === "all" || alert.priority === filterPriority;
        const matchesStatus = filterStatus === "all" || alert.status === filterStatus;

        return matchesSearch && matchesType && matchesPriority && matchesStatus;
    });

    const getAlertTypeColor = (type: string) => {
        switch (type) {
            case "IPFT Reminder": return "text-blue-600 bg-blue-50 border-blue-200";
            case "Low Performance": return "text-red-600 bg-red-50 border-red-200";
            case "Overweight": return "text-orange-600 bg-orange-50 border-orange-200";
            case "Medical": return "text-purple-600 bg-purple-50 border-purple-200";
            case "Injury": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Test Due": return "text-pink-600 bg-pink-50 border-pink-200";
            default: return "";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High": return "text-red-700 bg-red-100 border-red-300";
            case "Medium": return "text-yellow-700 bg-yellow-100 border-yellow-300";
            case "Low": return "text-green-700 bg-green-100 border-green-300";
            default: return "";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Unread": return "border-l-4 border-l-red-500 bg-red-50";
            case "Read": return "border-l-4 border-l-blue-500";
            case "Acknowledged": return "border-l-4 border-l-green-500 bg-gray-50";
            default: return "";
        }
    };

    const handleMarkAsRead = (id: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, status: "Read" as const } : alert
        ));
    };

    const handleAcknowledge = (id: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, status: "Acknowledged" as const } : alert
        ));
    };

    const handleMarkAllAsRead = () => {
        setAlerts(alerts.map(alert => ({ ...alert, status: "Read" as const })));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
                        <p className="text-gray-600 mt-1">Monitor and manage soldier fitness alerts</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="lg" onClick={handleMarkAllAsRead}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark All as Read
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((card, index) => (
                        <Card key={index} className={card.bgColor}>
                            <CardHeader className="pb-3">
                                <CardDescription>{card.title}</CardDescription>
                                <CardTitle className={`text-3xl ${card.color}`}>{card.value}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Alert List ({filteredAlerts.length})</CardTitle>
                        <CardDescription>All notifications and alerts requiring attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredAlerts.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-lg">No alerts found matching your filters</p>
                                </div>
                            ) : (
                                filteredAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`border rounded-lg p-4 hover:shadow-md transition-all ${getStatusColor(alert.status)}`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge className={getAlertTypeColor(alert.type)}>
                                                                {alert.type}
                                                            </Badge>
                                                            <Badge className={getPriorityColor(alert.priority)}>
                                                                {alert.priority}
                                                            </Badge>
                                                            {alert.status === "Unread" && (
                                                                <Badge variant="destructive" className="text-xs">New</Badge>
                                                            )}
                                                        </div>
                                                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                            {alert.message}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                                                            <span className="font-medium">{alert.soldierName}</span>
                                                            <span>•</span>
                                                            <span>{alert.rank}</span>
                                                            <span>•</span>
                                                            <span>Service No: {alert.serviceNo}</span>
                                                            <span>•</span>
                                                            <span>{new Date(alert.date).toLocaleDateString()}</span>
                                                        </div>
                                                        {alert.details && (
                                                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                                                                {alert.details}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex lg:flex-col gap-2">
                                                {alert.status === "Unread" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(alert.id)}
                                                    >
                                                        Mark as Read
                                                    </Button>
                                                )}
                                                {alert.status !== "Acknowledged" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAcknowledge(alert.id)}
                                                    >
                                                        Acknowledge
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
