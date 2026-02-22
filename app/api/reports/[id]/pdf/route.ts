import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const db = getDb();
    const rows = await db.sql`SELECT * FROM Report WHERE id = ${id} LIMIT 1`;
    const report = rows?.[0] as Record<string, string> | undefined;
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const soldiers = JSON.parse(report.content) as Array<{
      id?: string;
      name?: string;
      email?: string;
      serviceNo?: string;
      armyId?: string;
      rank?: string;
      joinedAt?: string;
      createdAt?: string;
    }>;

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = 595.28; // A4
    const pageHeight = 841.89;
    const margin = 50;
    const usableWidth = pageWidth - 2 * margin;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Helper: draw text
    const drawText = (
      text: string,
      x: number,
      yPos: number,
      options: { font?: typeof bold; size?: number; color?: [number, number, number]; maxWidth?: number } = {}
    ) => {
      const font = options.font || regular;
      const size = options.size || 10;
      const color = options.color || [0, 0, 0];
      // Truncate text if it's too wide
      let t = text;
      const mw = options.maxWidth;
      if (mw) {
        while (font.widthOfTextAtSize(t, size) > mw && t.length > 1) {
          t = t.slice(0, -1);
        }
      }
      page.drawText(t, {
        x,
        y: yPos,
        size,
        font,
        color: rgb(color[0], color[1], color[2]),
      });
    };

    // Helper: new page if needed
    const ensureSpace = (needed: number) => {
      if (y - needed < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
    };

    // ── Title ──
    const titleText = 'TROOP TRACK';
    const titleWidth = bold.widthOfTextAtSize(titleText, 22);
    drawText(titleText, (pageWidth - titleWidth) / 2, y, { font: bold, size: 22, color: [0.12, 0.16, 0.22] });
    y -= 20;

    const subtitleText = 'Military Fitness Management System';
    const subWidth = regular.widthOfTextAtSize(subtitleText, 10);
    drawText(subtitleText, (pageWidth - subWidth) / 2, y, { size: 10, color: [0.4, 0.4, 0.4] });
    y -= 20;

    // ── Blue line ──
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 2,
      color: rgb(0.23, 0.51, 0.96),
    });
    y -= 25;

    // ── Report title ──
    const rTitle = report.title;
    const rTitleWidth = bold.widthOfTextAtSize(rTitle, 16);
    drawText(rTitle, (pageWidth - rTitleWidth) / 2, y, { font: bold, size: 16, color: [0.12, 0.16, 0.22] });
    y -= 25;

    // ── Meta info ──
    drawText(`Sent by: ${report.sentByName}`, margin, y, { size: 10, color: [0.28, 0.33, 0.42] });
    y -= 16;
    drawText(`Date: ${new Date(report.createdAt).toLocaleString()}`, margin, y, { size: 10, color: [0.28, 0.33, 0.42] });
    y -= 16;
    drawText(`Total Soldiers: ${soldiers.length}`, margin, y, { size: 10, color: [0.28, 0.33, 0.42] });
    y -= 30;

    // ── Table ──
    const colWidths = [30, 120, 155, 85, 60, 80]; // #, Name, Email, ServiceNo, Rank, Joined
    const headers = ['#', 'Name', 'Email', 'Service No', 'Rank', 'Joined'];
    const rowHeight = 22;

    // Header background
    page.drawRectangle({
      x: margin,
      y: y - 5,
      width: usableWidth,
      height: rowHeight,
      color: rgb(0.12, 0.25, 0.69),
    });

    // Header text
    let colX = margin + 5;
    headers.forEach((h, i) => {
      drawText(h, colX, y, { font: bold, size: 9, color: [1, 1, 1], maxWidth: colWidths[i] - 10 });
      colX += colWidths[i];
    });
    y -= rowHeight;

    // Rows
    soldiers.forEach((s, idx) => {
      ensureSpace(rowHeight + 5);

      // Alternating row background
      if (idx % 2 === 0) {
        page.drawRectangle({
          x: margin,
          y: y - 5,
          width: usableWidth,
          height: rowHeight,
          color: rgb(0.94, 0.96, 0.97),
        });
      }

      const serviceNo = s.serviceNo || s.armyId || '—';
      const joined = s.joinedAt || s.createdAt;
      const joinedStr = joined ? new Date(joined).toLocaleDateString() : '—';

      const row = [String(idx + 1), s.name || '—', s.email || '—', serviceNo, s.rank || '—', joinedStr];

      colX = margin + 5;
      row.forEach((val, i) => {
        drawText(val, colX, y, { size: 8, color: [0.12, 0.16, 0.22], maxWidth: colWidths[i] - 10 });
        colX += colWidths[i];
      });

      y -= rowHeight;
    });

    // ── Footer ──
    y -= 15;
    ensureSpace(30);
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 0.5,
      color: rgb(0.8, 0.84, 0.88),
    });
    y -= 15;

    const footerText = `Generated by Troop Track on ${new Date().toLocaleString()}`;
    const footerWidth = regular.widthOfTextAtSize(footerText, 8);
    drawText(footerText, (pageWidth - footerWidth) / 2, y, { size: 8, color: [0.58, 0.64, 0.72] });

    // Serialize
    const pdfBytes = await pdfDoc.save();

    const filename = `New_Soldiers_Report_${new Date(report.createdAt)
      .toISOString()
      .slice(0, 10)}.pdf`;

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBytes.length),
      },
    });
  } catch (error) {
    console.error('[GET /api/reports/[id]/pdf]', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
