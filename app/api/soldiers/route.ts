import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET(request: NextRequest) {
    try {
        const db = getDb();
        
        // Check if filtering by pending status
        const pendingParam = request.nextUrl.searchParams.get('pending');
        
        let soldiers: Array<Record<string, unknown>>;
        
        if (pendingParam === 'true') {
            // Fetch only pending (unapproved) soldiers
            soldiers = await db.sql`SELECT id, fullName, email, serviceNo, rank, unit, fitnessStatus, dateOfBirth, height, weight, bmi, medicalCategory, approved, createdAt FROM User WHERE userType = 'soldier' AND approved = 0` as Array<Record<string, unknown>>;
        } else if (pendingParam === 'false') {
            // Fetch only approved soldiers
            soldiers = await db.sql`SELECT id, fullName, email, serviceNo, rank, unit, fitnessStatus, dateOfBirth, height, weight, bmi, medicalCategory, approved, createdAt FROM User WHERE userType = 'soldier' AND approved = 1` as Array<Record<string, unknown>>;
        } else {
            // Fetch all soldiers (no filter)
            soldiers = await db.sql`SELECT id, fullName, email, serviceNo, rank, unit, fitnessStatus, dateOfBirth, height, weight, bmi, medicalCategory, approved, createdAt FROM User WHERE userType = 'soldier'` as Array<Record<string, unknown>>;
        }

        const getAge = (dob: string | null) => {
            if (!dob) return null;
            const today = new Date();
            const d = new Date(dob);
            let age = today.getFullYear() - d.getFullYear();
            const m = today.getMonth() - d.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
            return age;
        };

        const formattedSoldiers = soldiers.map((soldier) => ({
            id: soldier.id as string,
            name: soldier.fullName as string,
            email: soldier.email as string,
            serviceNo: (soldier.serviceNo as string) || 'N/A',
            rank: (soldier.rank as string) || 'N/A',
            unit: (soldier.unit as string) || 'N/A',
            fitnessStatus: ((soldier.fitnessStatus as string) || 'Unfit') as 'Fit' | 'Unfit',
            age: getAge(soldier.dateOfBirth as string | null),
            height: soldier.height as number | null,
            weight: soldier.weight as number | null,
            bmi: soldier.bmi as number | null,
            medicalCategory: (soldier.medicalCategory as string | null) || null,
            approved: Boolean(soldier.approved),
            joinedAt: soldier.createdAt ? String(soldier.createdAt) : null,
        }));

        return NextResponse.json(formattedSoldiers);
    } catch (error) {
        console.error('[GET /api/soldiers]', error);
        return NextResponse.json({ error: 'Failed to fetch soldiers' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { soldierId } = await request.json();

        if (!soldierId) {
            return NextResponse.json({ error: 'Soldier ID is required' }, { status: 400 });
        }

        const db = getDb();

        // Verify the soldier exists and is actually a soldier
        const rows = await db.sql`SELECT id, userType, fullName FROM User WHERE id = ${soldierId} LIMIT 1` as Array<{ id: string; userType: string; fullName: string }>;
        const soldier = rows?.[0];

        if (!soldier) {
            return NextResponse.json({ error: 'Soldier not found' }, { status: 404 });
        }

        if (soldier.userType !== 'soldier') {
            return NextResponse.json({ error: 'User is not a soldier' }, { status: 400 });
        }

        // Delete all related records first, then the user
        await db.sql`DELETE FROM AssignedPlan WHERE userId = ${soldierId}`;
        await db.sql`DELETE FROM LoginSession WHERE userId = ${soldierId}`;
        await db.sql`DELETE FROM FitnessTest WHERE soldierUserId = ${soldierId}`;
        await db.sql`DELETE FROM User WHERE id = ${soldierId}`;

        return NextResponse.json({ message: `Soldier "${soldier.fullName}" has been removed successfully` });
    } catch (error) {
        console.error('[DELETE /api/soldiers]', error);
        return NextResponse.json(
            { error: 'Failed to remove soldier' },
            { status: 500 }
        );
    }
}
