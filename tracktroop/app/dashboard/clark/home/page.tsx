"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Calendar,
  FileText,
  UserCheck,
  UserX
} from "lucide-react";

export default function ClarkHomePage() {
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

  const fitnessRate = ((stats.fitSoldiers / stats.totalSoldiers) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Clark Command Dashboard</h1>
          <p className="text-muted-foreground mt-1">Unit Overview & Fitness Monitoring</p>
        </div>

        {/* Stats Grid */}
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
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Important updates and reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.type === "warning" ? "text-orange-600" : 
                      alert.type === "danger" ? "text-red-600" : "text-blue-600"
                    }`} />
                    <p className="text-sm flex-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming IPFT */}
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/clark/soldiers">
                  <Users className="mr-2 h-4 w-4" />
                  View Soldiers
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/clark/fitness-tests">
                  <Activity className="mr-2 h-4 w-4" />
                  Manage Tests
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/clark/soldiers">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Add Soldier
                </Link>
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Unit Readiness */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Fitness Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Overall Fitness</span>
                <span className="text-2xl font-bold text-green-600">{fitnessRate}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${fitnessRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
