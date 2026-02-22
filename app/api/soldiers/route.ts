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
