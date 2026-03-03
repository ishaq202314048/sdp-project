"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, UserPlus, Clock, Download, AlertTriangle, ShieldAlert, Dumbbell, Calendar, Check, List } from "lucide-react";
import { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Report = {
  id: string;
  title: string;
  type: string;
  content: { length: number }[];
  sentBy: string;
  sentByName: string;
  sentTo: string;
  status: string;
  createdAt: string;
};

export default function AdjutantReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Alerts state
  type AlertItem = {
    id: string;
    icon: React.ReactNode;
    message: string;
    severity: "red" | "yellow" | "blue";
    details: string[]; // list of soldier names or info items
    fileName?: string;  // attached PDF file name
    fileData?: string;  // attached PDF base64 data
  };
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  // Load current user and acknowledged alerts from database
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
        // Load acknowledged alerts from database
        fetch(`/api/acknowledged-alerts?userId=${user.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.acknowledgedAlerts) {
              setAcknowledgedAlerts(new Set(data.acknowledgedAlerts));
            }
          })
          .catch((err) => console.error("Failed to load acknowledged alerts:", err));
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/reports/new-soldiers");
        if (res.ok) {
          const json = await res.json();
          setReports(json || []);
        }
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Load alerts from real data
    const loadAlerts = async () => {
      const alertsList: AlertItem[] = [];
      try {
        // Fetch soldiers
        const soldiersRes = await fetch("/api/soldiers");
        if (soldiersRes.ok) {
          const soldiers = await soldiersRes.json();

          const unfitSoldiers = soldiers.filter((s: { fitnessStatus: string }) => s.fitnessStatus === "Unfit");
          if (unfitSoldiers.length > 0) {
            alertsList.push({
              id: "unfit-soldiers",
              icon: <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />,
              message: `${unfitSoldiers.length} soldier${unfitSoldiers.length > 1 ? "s" : ""} marked as Unfit`,
              severity: "red",
              details: unfitSoldiers.map((s: { name: string; serviceNo: string }) => `${s.name} (${s.serviceNo})`),
            });
          }

          const noBmi = soldiers.filter((s: { bmi: number | null }) => !s.bmi);
          if (noBmi.length > 0) {
            alertsList.push({
              id: "missing-bmi",
              icon: <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />,
              message: `${noBmi.length} soldier${noBmi.length > 1 ? "s" : ""} missing BMI data`,
              severity: "yellow",
              details: noBmi.map((s: { name: string; serviceNo: string }) => `${s.name} (${s.serviceNo})`),
            });
          }

          const noMedCat = soldiers.filter((s: { medicalCategory: string | null }) => !s.medicalCategory);
          if (noMedCat.length > 0) {
            alertsList.push({
              id: "missing-medcat",
              icon: <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />,
              message: `${noMedCat.length} soldier${noMedCat.length > 1 ? "s" : ""} missing Medical Category`,
              severity: "yellow",
              details: noMedCat.map((s: { name: string; serviceNo: string }) => `${s.name} (${s.serviceNo})`),
            });
          }
        }

        // Fetch IPFT date
        const ipftRes = await fetch("/api/fitness-test/ipft-date");
        if (ipftRes.ok) {
          const ipftData = await ipftRes.json();
          if (ipftData.date) {
            const daysLeft = Math.ceil((new Date(ipftData.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 0) {
              alertsList.push({
                id: "ipft-passed",
                icon: <Calendar className="w-5 h-5 text-red-500 shrink-0" />,
                message: `IPFT date has passed (${new Date(ipftData.date).toLocaleDateString()})`,
                severity: "red",
                details: [`Scheduled: ${new Date(ipftData.date).toLocaleDateString()}`],
              });
            } else if (daysLeft <= 7) {
              alertsList.push({
                id: "ipft-soon",
                icon: <Calendar className="w-5 h-5 text-red-500 shrink-0" />,
                message: `IPFT is in ${daysLeft} day${daysLeft > 1 ? "s" : ""} (${new Date(ipftData.date).toLocaleDateString()})`,
                severity: "red",
                details: [`Date: ${new Date(ipftData.date).toLocaleDateString()}`, `${daysLeft} day${daysLeft > 1 ? "s" : ""} remaining`],
              });
            } else if (daysLeft <= 30) {
              alertsList.push({
                id: "ipft-upcoming",
                icon: <Calendar className="w-5 h-5 text-yellow-500 shrink-0" />,
                message: `IPFT is in ${daysLeft} days (${new Date(ipftData.date).toLocaleDateString()})`,
                severity: "yellow",
                details: [`Date: ${new Date(ipftData.date).toLocaleDateString()}`, `${daysLeft} days remaining`],
              });
            }
          } else {
            alertsList.push({
              id: "no-ipft",
              icon: <Calendar className="w-5 h-5 text-yellow-500 shrink-0" />,
              message: "No IPFT date has been scheduled",
              severity: "yellow",
              details: ["No IPFT date set by adjutant"],
            });
          }
        }

        // Check fitness plans
        const fitPlanRes = await fetch("/api/fitness/plans?status=Fit");
        const unfitPlanRes = await fetch("/api/fitness/plans?status=Unfit");
        if (fitPlanRes.ok) {
          const fitPlans = await fitPlanRes.json();
          if (!Array.isArray(fitPlans) || fitPlans.length === 0) {
            alertsList.push({
              id: "no-fit-plan",
              icon: <Dumbbell className="w-5 h-5 text-yellow-500 shrink-0" />,
              message: "No fitness plan assigned for Fit soldiers",
              severity: "yellow",
              details: ["Create a weekly plan for Fit soldiers"],
            });
          }
        }
        if (unfitPlanRes.ok) {
          const unfitPlans = await unfitPlanRes.json();
          if (!Array.isArray(unfitPlans) || unfitPlans.length === 0) {
            alertsList.push({
              id: "no-unfit-plan",
              icon: <Dumbbell className="w-5 h-5 text-yellow-500 shrink-0" />,
              message: "No fitness plan assigned for Unfit soldiers",
              severity: "yellow",
              details: ["Create a weekly plan for Unfit soldiers"],
            });
          }
        }

        // Fetch clerk reports
        try {
          const clerkRes = await fetch("/api/reports/clerk-report");
          if (clerkRes.ok) {
            const clerkReports = await clerkRes.json();
            if (Array.isArray(clerkReports)) {
              for (const cr of clerkReports) {
                const hasFile = cr.content?.fileName && cr.content?.fileData;
                alertsList.push({
                  id: `clerk-report-${cr.id}`,
                  icon: <FileText className="w-5 h-5 text-blue-500 shrink-0" />,
                  message: cr.title,
                  severity: "blue",
                  details: [
                    cr.content?.message || "",
                    `Sent by: ${cr.sentByName}`,
                    `Date: ${new Date(cr.createdAt).toLocaleString()}`,
                    hasFile ? `📎 Attached: ${cr.content.fileName}` : "",
                  ].filter(Boolean),
                  ...(hasFile ? { fileName: cr.content.fileName, fileData: cr.content.fileData } : {}),
                });
              }
            }
          }
        } catch (err) {
          console.error("Failed to load clerk reports", err);
        }
      } catch (err) {
        console.error("Failed to load alerts", err);
      }

      if (alertsList.length === 0) {
        alertsList.push({
          id: "all-clear",
          icon: <ShieldAlert className="w-5 h-5 text-green-500 shrink-0" />,
          message: "All clear — no alerts at this time",
          severity: "blue",
          details: [],
        });
      }

      setAlerts(alertsList);
      setAlertsLoading(false);
    };
    loadAlerts();
  }, []);

  // Acknowledge an alert (dismiss it) - persists to database
  const handleAcknowledge = async (alertId: string) => {
    // Update local state immediately for responsive UI
    setAcknowledgedAlerts((prev) => new Set(prev).add(alertId));
    
    // Save to database if user is logged in
    if (currentUserId) {
      try {
        await fetch("/api/acknowledged-alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alertId, userId: currentUserId }),
        });
        // Dispatch event to notify navigation to refresh alert count
        window.dispatchEvent(new CustomEvent('alertsAcknowledged'));
      } catch (err) {
        console.error("Failed to persist acknowledgement:", err);
      }
    }
  };

  // Toggle show list for an alert
  const handleToggleList = (alertId: string) => {
    setExpandedAlerts((prev) => {
      const next = new Set(prev);
      if (next.has(alertId)) next.delete(alertId);
      else next.add(alertId);
      return next;
    });
  };

  // Download alert details as PDF
  const handleAlertDownload = async (alert: AlertItem) => {
    // If this alert has an attached PDF file from clerk, download it directly
    if (alert.fileData && alert.fileName) {
      const byteCharacters = atob(alert.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = alert.fileName;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // Otherwise generate a PDF from alert details
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage([595, 842]);
    const margin = 50;
    let y = 842 - margin;

    // Title
    page.drawText("Alert Report", { x: margin, y, size: 20, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    y -= 28;
    page.drawText(alert.message, { x: margin, y, size: 13, font, color: rgb(0.3, 0.3, 0.3) });
    y -= 18;
    page.drawText(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, { x: margin, y, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
    y -= 30;

    // Divider
    page.drawLine({ start: { x: margin, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 20;

    // Details list
    if (alert.details.length > 0) {
      page.drawText("Details:", { x: margin, y, size: 12, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
      y -= 22;
      for (const item of alert.details) {
        page.drawText(`•  ${item}`, { x: margin + 10, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) });
        y -= 18;
        if (y < 60) break;
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Alert_${alert.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async (reportId: string, title: string) => {
    setDownloading(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/pdf`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Remove the report from the list
      setReports((prev) => prev.filter((r) => r.id !== reportId));

      // Delete the report from the database
      await fetch(`/api/reports/new-soldiers?id=${reportId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to download PDF", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#020617] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <FileText className="h-8 w-8 text-emerald-400" />
            Reports
          </h1>
          <p className="text-slate-400 mt-1">
            Reports sent by clerks — download as PDF
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports - Left Side */}
          <div className="lg:col-span-2">
            {loading ? (
              <p className="text-muted-foreground">Loading reports...</p>
            ) : reports.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground">No reports received yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <UserPlus className="h-5 w-5 text-emerald-400" />
                            {report.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            Sent by <span className="font-medium">{report.sentByName}</span> •{" "}
                            {timeAgo(report.createdAt)} •{" "}
                            {new Date(report.createdAt).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {report.content.length} new soldier{report.content.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleDownload(report.id, report.title)}
                        disabled={downloading === report.id}
                        className="w-full sm:w-auto bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {downloading === report.id ? "Downloading..." : "Download PDF"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Alerts - Right Side */}
          <div>
            <Card className="border-amber-500/30 sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Notifications
                </CardTitle>
                <CardDescription>Notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                {alertsLoading ? (
                  <p className="text-sm text-slate-400">Checking alerts...</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.filter((a) => !acknowledgedAlerts.has(a.id)).length === 0 ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20">
                        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />
                        <p className="text-sm text-slate-300">All alerts acknowledged</p>
                      </div>
                    ) : (
                      alerts.filter((a) => !acknowledgedAlerts.has(a.id)).map((alert) => {
                        const bgColor =
                          alert.severity === "red"
                            ? "bg-red-500/10 border-red-500/20"
                            : alert.severity === "yellow"
                            ? "bg-yellow-500/10 border-yellow-500/20"
                            : "bg-blue-500/10 border-blue-500/20";
                        return (
                          <div key={alert.id} className={`rounded-xl border ${bgColor}`}>
                            {/* Alert message */}
                            <div className="flex items-center gap-3 p-3">
                              {alert.icon}
                              <p className="text-sm text-slate-300 flex-1">{alert.message}</p>
                            </div>

                            {/* Expanded list */}
                            {expandedAlerts.has(alert.id) && alert.details.length > 0 && (
                              <div className="px-3 pb-2">
                                <div className="bg-white/[0.05] rounded-lg border border-white/[0.08] p-2 space-y-1 max-h-40 overflow-y-auto">
                                  {alert.details.map((item, i) => (
                                    <p key={i} className="text-xs text-slate-400 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                                      {item}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 3 Buttons */}
                            <div className="flex items-center gap-1 px-3 pb-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                onClick={() => handleAcknowledge(alert.id)}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Acknowledge
                              </Button>
                              {alert.details.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                  onClick={() => handleToggleList(alert.id)}
                                >
                                  <List className="w-3 h-3 mr-1" />
                                  {expandedAlerts.has(alert.id) ? "Hide List" : "Show List"}
                                </Button>
                              )}
                              {alert.fileName && alert.fileData && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                  onClick={() => handleAlertDownload(alert)}
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
