import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pending = searchParams.get('pending');

        // Build where clause
        const whereClause: Record<string, unknown> = { userType: 'soldier' };
        if (pending === 'true') {
            whereClause.approved = false;
        } else if (pending === 'false') {
            whereClause.approved = true;
        }
        // If pending is not specified, return all soldiers

        const soldiers = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                fullName: true,
                email: true,
                serviceNo: true,
                rank: true,
                unit: true,
                fitnessStatus: true,
                dateOfBirth: true,
                height: true,
                weight: true,
                bmi: true,
                medicalCategory: true,
                approved: true,
                createdAt: true,
            },
        });

        // Calculate age from dateOfBirth
        const getAge = (dob: Date | null) => {
            if (!dob) return null;
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
            return age;
        };

        const formattedSoldiers = soldiers.map((soldier) => ({
            id: soldier.id,
            name: soldier.fullName,
            email: soldier.email,
            serviceNo: soldier.serviceNo || 'N/A',
            rank: soldier.rank || 'N/A',
            unit: soldier.unit || 'N/A',
            fitnessStatus: (soldier.fitnessStatus || 'Unfit') as 'Fit' | 'Unfit',
            age: getAge(soldier.dateOfBirth),
            height: soldier.height,
            weight: soldier.weight,
            bmi: soldier.bmi,
            medicalCategory: soldier.medicalCategory || null,
            approved: (soldier as Record<string, unknown>).approved ?? false,
            joinedAt: soldier.createdAt?.toISOString() || null,
        }));

        return NextResponse.json(formattedSoldiers);
    } catch (error) {
        console.error('[GET /api/soldiers]', error);
        return NextResponse.json(
            { error: 'Failed to fetch soldiers' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { soldierId } = await request.json();

        if (!soldierId) {
            return NextResponse.json({ error: 'Soldier ID is required' }, { status: 400 });
        }

        // Verify the soldier exists and is actually a soldier
        const soldier = await prisma.user.findUnique({
            where: { id: soldierId },
            select: { id: true, userType: true, fullName: true },
        });

        if (!soldier) {
            return NextResponse.json({ error: 'Soldier not found' }, { status: 404 });
        }

        if (soldier.userType !== 'soldier') {
            return NextResponse.json({ error: 'User is not a soldier' }, { status: 400 });
        }

        // Delete all related records first, then the user
        await prisma.$transaction([
            prisma.assignedPlan.deleteMany({ where: { userId: soldierId } }),
            prisma.loginSession.deleteMany({ where: { userId: soldierId } }),
            prisma.fitnessTest.deleteMany({ where: { soldierUserId: soldierId } }),
            prisma.user.delete({ where: { id: soldierId } }),
        ]);

        return NextResponse.json({ message: `Soldier "${soldier.fullName}" has been removed successfully` });
    } catch (error) {
        console.error('[DELETE /api/soldiers]', error);
        return NextResponse.json(
            { error: 'Failed to remove soldier' },
            { status: 500 }
        );
    }
}
