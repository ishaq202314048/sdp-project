import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Fetch all soldiers with 'Unfit' status from the database
        const unfitSoldiers = await prisma.User.findMany({
            where: {
                userType: 'soldier',
                fitnessStatus: 'Unfit',
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                rank: true,
                serviceNo: true,
                fitnessStatus: true,
            },
            orderBy: {
                fullName: 'asc',
            },
        });

        // Transform to HighRiskSoldier format
        // Unfit soldiers are considered "high risk" and need immediate attention
        const highRiskSoldiers = unfitSoldiers.map((soldier) => ({
            id: soldier.id,
            name: soldier.fullName || 'Unknown Soldier',
            serviceNo: soldier.serviceNo || 'N/A',
            rank: soldier.rank || 'Unknown',
            riskType: 'Low Fitness' as const,
            status: 'Below fitness threshold - Unfit status',
            lastTestScore: 0,
        }));

        return NextResponse.json({
            highRiskSoldiers: highRiskSoldiers,
            totalRiskCount: highRiskSoldiers.length,
        });
    } catch (error) {
        console.error('Error fetching high-risk soldiers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch high-risk soldiers' },
            { status: 500 }
        );
    }
}
