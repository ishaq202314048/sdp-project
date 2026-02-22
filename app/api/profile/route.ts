import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET(request: NextRequest) {
    try {
        const db = getDb();
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
        }

        const rows = await db.sql`SELECT * FROM User WHERE id = ${userId} LIMIT 1`;
        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('[GET /api/profile]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const db = getDb();
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
        }

        const body = await request.json();

        const allowedFields = [
            'phone', 'address', 'emergencyContactName', 'emergencyContact',
            'rank', 'unit', 'bloodGroup', 'height', 'weight', 'medicalCategory',
        ];

        const updates: string[] = [];
        const values: unknown[] = [];

        for (const field of allowedFields) {
            if (field in body) {
                updates.push(`${field} = ?`);
                values.push(body[field]);
            }
        }

        // Auto-calculate BMI when height or weight changes
        if ('height' in body || 'weight' in body) {
            const currentRows = await db.sql`SELECT height, weight FROM User WHERE id = ${userId} LIMIT 1`;
            const current = currentRows?.[0] as { height: number | null; weight: number | null } | undefined;
            const h = Number(body.height ?? current?.height);
            const w = Number(body.weight ?? current?.weight);
            if (h && w && h > 0) {
                const bmi = parseFloat((w / ((h / 100) ** 2)).toFixed(1));
                updates.push('bmi = ?');
                values.push(bmi);
            }
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const now = new Date().toISOString();
        updates.push('updatedAt = ?');
        values.push(now);
        values.push(userId);

        const sql = `UPDATE User SET ${updates.join(', ')} WHERE id = ?`;
        await db.sql(sql, ...values);

        const updatedRows = await db.sql`SELECT * FROM User WHERE id = ${userId} LIMIT 1`;
        return NextResponse.json(updatedRows?.[0] ?? {});
    } catch (error) {
        console.error('[PATCH /api/profile]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
