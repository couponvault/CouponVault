import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { bulkGenerateCoupons } from '@/utils/couponGenerator';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

// POST /api/admin/generate
export async function POST(request: NextRequest) {
    try {
        const user = getUserFromRequest(request);

        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { platformId, count } = await request.json();

        if (!platformId || !count) {
            return NextResponse.json(
                { error: 'Platform ID and count are required' },
                { status: 400 }
            );
        }

        if (count < 1 || count > 1000) {
            return NextResponse.json(
                { error: 'Count must be between 1 and 1000' },
                { status: 400 }
            );
        }

        await connectDB();

        const coupons = await bulkGenerateCoupons(platformId, count);

        return NextResponse.json({
            success: true,
            generated: coupons.length,
            message: `Successfully generated ${coupons.length} coupons`
        });
    } catch (error: any) {
        console.error('Generate coupons error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
