import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const soldiers = await prisma.user.findMany({
            where: { userType: 'soldier' },
            select: {
                id: true,
                fullName: true,
                serviceNo: true,
                rank: true,
                fitnessStatus: true,
            },
        });

        // Transform to match SoldierItem interface
        const formattedSoldiers = soldiers.map((soldier) => ({
            id: soldier.id,
            name: soldier.fullName,
            serviceNo: soldier.serviceNo || 'N/A',
            rank: soldier.rank || 'N/A',
            fitnessStatus: (soldier.fitnessStatus || 'At Risk') as 'Fit' | 'At Risk' | 'Unfit',
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
