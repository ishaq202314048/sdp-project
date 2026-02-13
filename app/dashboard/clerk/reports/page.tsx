"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Download,
	CheckCircle2,
	AlertCircle,
	Send,
	Paperclip,
	X,
	FileText,
	Loader2,
} from "lucide-react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

export default function ClarkReportsPage() {

	const [fitnessTestData, setFitnessTestData] = useState<{ exercise: string; pass: number; fail: number; total: number }[]>([]);
	const [quarterlyProgressData, setQuarterlyProgressData] = useState<{ quarter: string; fit: number; unfit: number }[]>([]);
	const [reportTitle, setReportTitle] = useState("");
	const [reportMessage, setReportMessage] = useState("");
	const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
	const [attachedFile, setAttachedFile] = useState<{ name: string; data: string } | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Generate Reports state
	const [genReportType, setGenReportType] = useState("");
	const [genLoading, setGenLoading] = useState(false);
	const [genData, setGenData] = useState<Record<string, string | number | null>[]>([]);
	const [genIpftDate, setGenIpftDate] = useState<string | null>(null);
	const [genColumns, setGenColumns] = useState<{ key: string; label: string }[]>([]);

	useEffect(() => {
		const fetchChartData = async () => {
			try {
				const res = await fetch('/api/fitness/reports-chart');
				if (res.ok) {
					const data = await res.json();
					setFitnessTestData(data.fitnessTestPerformance || []);
					setQuarterlyProgressData(data.quarterlyProgress || []);
				}
			} catch (err) {
				console.error('Failed to load chart data', err);
			}
		};
		fetchChartData();
	}, []);

	const handleGenerateReport = async () => {
		if (!genReportType) return;
		setGenLoading(true);
		setGenData([]);
		setGenIpftDate(null);
		try {
			if (genReportType === 'fit-soldiers' || genReportType === 'unfit-soldiers') {
				const soldiersRes = await fetch('/api/soldiers');
				if (!soldiersRes.ok) throw new Error('Failed to fetch soldiers');
				const soldiers = await soldiersRes.json();

				if (genReportType === 'fit-soldiers') {
					const fit = soldiers.filter((s: { fitnessStatus: string }) => s.fitnessStatus === 'Fit');
					setGenColumns([
						{ key: 'name', label: 'Name' },
						{ key: 'serviceNo', label: 'Service No' },
						{ key: 'rank', label: 'Rank' },
						{ key: 'unit', label: 'Unit' },
						{ key: 'bmi', label: 'BMI' },
						{ key: 'medicalCategory', label: 'Medical Cat' },
					]);
					setGenData(fit);
				} else {
					const unfit = soldiers.filter((s: { fitnessStatus: string }) => s.fitnessStatus === 'Unfit');
					setGenColumns([
						{ key: 'name', label: 'Name' },
						{ key: 'serviceNo', label: 'Service No' },
						{ key: 'rank', label: 'Rank' },
						{ key: 'unit', label: 'Unit' },
						{ key: 'bmi', label: 'BMI' },
						{ key: 'medicalCategory', label: 'Medical Cat' },
					]);
					setGenData(unfit);
				}
			} else if (genReportType === 'ipft-report') {
				// Fetch actual IPFT test results from database
				const ipftRes = await fetch('/api/fitness-test/ipft-results');
				if (ipftRes.ok) {
					const ipftData = await ipftRes.json();
					setGenIpftDate(ipftData.scheduledDate || 'Not Scheduled');
					setGenColumns([
						{ key: 'name', label: 'Name' },
						{ key: 'serviceNo', label: 'Service No' },
						{ key: 'rank', label: 'Rank' },
						{ key: 'fitnessStatus', label: 'Fitness Status' },
						{ key: 'ipftResult', label: 'IPFT Result' },
						{ key: 'medicalCategory', label: 'Medical Cat' },
					]);
					setGenData(ipftData.results || []);
				} else {
					throw new Error('Failed to fetch IPFT results');
				}
			}
		} catch (err) {
			console.error('Failed to generate report', err);
		} finally {
			setGenLoading(false);
		}
	};

	const handleDownloadGeneratedPdf = async () => {
		const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
		const pdfDoc = await PDFDocument.create();
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		const reportLabel =
			genReportType === 'fit-soldiers' ? 'Fit Soldiers Report' :
			genReportType === 'unfit-soldiers' ? 'Unfit Soldiers Report' : 'IPFT Report';

		const pageWidth = 595;
		const pageHeight = 842;
		const margin = 40;
		const rowHeight = 20;
		const colWidths = genColumns.map(() => Math.floor((pageWidth - margin * 2) / genColumns.length));

		let page = pdfDoc.addPage([pageWidth, pageHeight]);
		let y = pageHeight - margin;

		// Title
		page.drawText(reportLabel, { x: margin, y, size: 18, font: fontBold, color: rgb(0.1, 0.1, 0.4) });
		y -= 22;
		page.drawText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
			x: margin, y, size: 10, font, color: rgb(0.5, 0.5, 0.5),
		});
		y -= 14;
		page.drawText(`Total: ${genData.length} soldier${genData.length !== 1 ? 's' : ''}`, {
			x: margin, y, size: 10, font, color: rgb(0.5, 0.5, 0.5),
		});
		y -= 8;

		if (genReportType === 'ipft-report' && genIpftDate) {
			y -= 14;
			page.drawText(`Next IPFT Date: ${genIpftDate === 'Not Scheduled' ? genIpftDate : new Date(genIpftDate).toLocaleDateString()}`, {
				x: margin, y, size: 11, font: fontBold, color: rgb(0.7, 0.2, 0.1),
			});
		}

		y -= 10;
		page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
		y -= rowHeight;

		// Table header
		let xPos = margin;
		for (let i = 0; i < genColumns.length; i++) {
			page.drawText(genColumns[i].label, { x: xPos, y, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
			xPos += colWidths[i];
		}
		y -= 4;
		page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
		y -= rowHeight;

		// Table rows
		for (const row of genData) {
			if (y < margin + 30) {
				page = pdfDoc.addPage([pageWidth, pageHeight]);
				y = pageHeight - margin;
			}
			xPos = margin;
			for (let i = 0; i < genColumns.length; i++) {
				const val = row[genColumns[i].key];
				const text = val !== null && val !== undefined ? String(val) : 'N/A';
				page.drawText(text.substring(0, 20), { x: xPos, y, size: 8, font, color: rgb(0.3, 0.3, 0.3) });
				xPos += colWidths[i];
			}
			y -= rowHeight;
		}

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([new Uint8Array(pdfBytes) as unknown as BlobPart], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${reportLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.type !== 'application/pdf') {
			alert('Only PDF files are allowed');
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			alert('File size must be less than 5MB');
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const base64 = (reader.result as string).split(',')[1];
			setAttachedFile({ name: file.name, data: base64 });
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveFile = () => {
		setAttachedFile(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleSendReport = async () => {
		if (!reportTitle.trim() || !reportMessage.trim()) return;
		setSendStatus('sending');
		try {
			const userStr = localStorage.getItem('user');
			const user = userStr ? JSON.parse(userStr) : null;
			const payload: Record<string, string> = {
				title: reportTitle,
				message: reportMessage,
				sentBy: user?.id || 'unknown',
				sentByName: user ? `${user.firstName} ${user.lastName}` : 'Clerk',
			};
			if (attachedFile) {
				payload.fileName = attachedFile.name;
				payload.fileData = attachedFile.data;
			}
			const res = await fetch('/api/reports/clerk-report', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (res.ok) {
				setSendStatus('sent');
				setReportTitle('');
				setReportMessage('');
				setAttachedFile(null);
				if (fileInputRef.current) fileInputRef.current.value = '';
				setTimeout(() => setSendStatus('idle'), 3000);
			} else {
				setSendStatus('error');
				setTimeout(() => setSendStatus('idle'), 3000);
			}
		} catch {
			setSendStatus('error');
			setTimeout(() => setSendStatus('idle'), 3000);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold">Reports</h1>
					<p className="text-muted-foreground mt-1">Fitness reports and analytics</p>
				</div>

				{/* Quick Report Templates */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Fitness Test Performance</CardTitle>
						</CardHeader>
						<CardContent>
							{fitnessTestData.length === 0 ? (
								<p className="text-sm text-muted-foreground">No fitness test data available yet.</p>
							) : (
								<ResponsiveContainer width="100%" height={250}>
									<BarChart data={fitnessTestData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="exercise" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey="pass" fill="#10b981" name="Pass" />
										<Bar dataKey="fail" fill="#ef4444" name="Fail" />
									</BarChart>
								</ResponsiveContainer>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Quarterly Progress</CardTitle>
						</CardHeader>
						<CardContent>
							{quarterlyProgressData.length === 0 ? (
								<p className="text-sm text-muted-foreground">No quarterly data available yet.</p>
							) : (
								<ResponsiveContainer width="100%" height={250}>
									<LineChart data={quarterlyProgressData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="quarter" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Line type="monotone" dataKey="fit" stroke="#10b981" strokeWidth={2} name="Fit" />
										<Line type="monotone" dataKey="unfit" stroke="#ef4444" strokeWidth={2} name="Unfit" />
									</LineChart>
								</ResponsiveContainer>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Send Report to Adjutant */}
				<Card className="border-blue-200 dark:border-blue-800">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Send className="h-5 w-5 text-blue-600" />
							Send Report to Adjutant
						</CardTitle>
						<CardDescription>Send a report or message to the Adjutant. It will appear in their Alerts box.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-1 block">Title</label>
							<input
								type="text"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Report title..."
								value={reportTitle}
								onChange={(e) => setReportTitle(e.target.value)}
							/>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">Message</label>
							<textarea
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Write your report message..."
								value={reportMessage}
								onChange={(e) => setReportMessage(e.target.value)}
							/>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">Attach PDF (optional)</label>
							<div className="flex items-center gap-3">
								<input
									ref={fileInputRef}
									type="file"
									accept=".pdf"
									className="hidden"
									onChange={handleFileChange}
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => fileInputRef.current?.click()}
								>
									<Paperclip className="h-4 w-4 mr-2" />
									{attachedFile ? 'Change File' : 'Choose PDF'}
								</Button>
								{attachedFile && (
									<div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-1.5 text-sm">
										<Paperclip className="h-3.5 w-3.5 text-blue-600" />
										<span className="text-blue-700 dark:text-blue-300 max-w-[200px] truncate">{attachedFile.name}</span>
										<button onClick={handleRemoveFile} className="text-blue-400 hover:text-red-500 ml-1">
											<X className="h-3.5 w-3.5" />
										</button>
									</div>
								)}
							</div>
							<p className="text-xs text-muted-foreground mt-1">Max 5MB, PDF only</p>
						</div>
						<div className="flex items-center gap-3">
							<Button
								onClick={handleSendReport}
								disabled={sendStatus === 'sending' || !reportTitle.trim() || !reportMessage.trim()}
								className="bg-blue-600 hover:bg-blue-700 text-white"
							>
								<Send className="h-4 w-4 mr-2" />
								{sendStatus === 'sending' ? 'Sending...' : 'Send to Adjutant'}
							</Button>
							{sendStatus === 'sent' && (
								<span className="text-sm text-green-600 flex items-center gap-1">
									<CheckCircle2 className="h-4 w-4" /> Report sent successfully!
								</span>
							)}
							{sendStatus === 'error' && (
								<span className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="h-4 w-4" /> Failed to send report
								</span>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Generated Reports History */}
				<Card className="border-emerald-200 dark:border-emerald-800">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<FileText className="h-5 w-5 text-emerald-600" />
							Generate Report
						</CardTitle>
						<CardDescription>Select a report type, generate the data, and download as PDF.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Dropdown */}
						<div className="flex flex-col sm:flex-row gap-3">
							<select
								className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
								value={genReportType}
								onChange={(e) => { setGenReportType(e.target.value); setGenData([]); setGenIpftDate(null); }}
							>
								<option value="">Select Type</option>
								<option value="fit-soldiers">Fit Soldiers</option>
								<option value="unfit-soldiers">Unfit Soldiers</option>
								<option value="ipft-report">IPFT Report</option>
							</select>
							<Button
								onClick={handleGenerateReport}
								disabled={!genReportType || genLoading}
								className="bg-emerald-600 hover:bg-emerald-700 text-white"
							>
								{genLoading ? (
									<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
								) : (
									<><FileText className="h-4 w-4 mr-2" /> Generate</>
								)}
							</Button>
						</div>

						{/* IPFT Date info */}
						{genReportType === 'ipft-report' && genIpftDate && (
							<div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md px-4 py-2 text-sm">
								<span className="font-medium text-amber-800 dark:text-amber-300">Next IPFT Date: </span>
								<span className="text-amber-700 dark:text-amber-400">
									{genIpftDate === 'Not Scheduled' ? genIpftDate : new Date(genIpftDate).toLocaleDateString()}
								</span>
							</div>
						)}

						{/* Data Table */}
						{genData.length > 0 && (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
										{genData.length} soldier{genData.length !== 1 ? 's' : ''} found
									</p>
									<Badge className="bg-emerald-100 text-emerald-800">
										{genReportType === 'fit-soldiers' ? 'Fit' : genReportType === 'unfit-soldiers' ? 'Unfit' : 'IPFT'}
									</Badge>
								</div>
								<div className="overflow-x-auto border rounded-lg">
									<table className="w-full text-sm">
										<thead className="bg-slate-100 dark:bg-slate-800">
											<tr>
												<th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">#</th>
												{genColumns.map((col) => (
													<th key={col.key} className="px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
														{col.label}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{genData.map((row, idx) => (
												<tr key={idx} className="border-t hover:bg-slate-50 dark:hover:bg-slate-900">
													<td className="px-3 py-2 text-xs text-slate-500">{idx + 1}</td>
													{genColumns.map((col) => (
														<td key={col.key} className="px-3 py-2 text-xs">
															{col.key === 'fitnessStatus' ? (
																<Badge className={row[col.key] === 'Fit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
																	{String(row[col.key] || 'N/A')}
																</Badge>
															) : col.key === 'ipftResult' ? (
																<Badge className={row[col.key] === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
																	{String(row[col.key] || 'N/A')}
																</Badge>
															) : (
																String(row[col.key] ?? 'N/A')
															)}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Download Button */}
								<Button
									onClick={handleDownloadGeneratedPdf}
									className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
								>
									<Download className="h-4 w-4 mr-2" />
									Download as PDF
								</Button>
							</div>
						)}

						{/* Empty state after generate with no results */}
						{!genLoading && genReportType && genData.length === 0 && genColumns.length > 0 && (
							<div className="text-center py-8 text-muted-foreground">
								<FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
								<p className="text-sm">No soldiers found for this report type.</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
