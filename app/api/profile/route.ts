import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId parameter' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('[GET /api/profile]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId parameter' },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Allowed fields to update
        const allowedFields = [
            'phone',
            'address',
            'emergencyContactName',
            'emergencyContact',
            'rank',
            'unit',
            'bloodGroup',
            'height',
            'weight',
            'medicalCategory',
        ];

        const updateData: Record<string, unknown> = {};
        for (const field of allowedFields) {
            if (field in body) {
                updateData[field] = body[field];
            }
        }

        // Auto-calculate BMI when height or weight changes
        if ('height' in body || 'weight' in body) {
            // Get current user to fill in missing height/weight
            const currentUser = await prisma.user.findUnique({ where: { id: userId } });
            const h = Number(body.height ?? currentUser?.height);
            const w = Number(body.weight ?? currentUser?.weight);
            if (h && w && h > 0) {
                updateData['bmi'] = parseFloat((w / ((h / 100) ** 2)).toFixed(1));
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('[PATCH /api/profile]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
