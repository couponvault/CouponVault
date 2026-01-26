import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Platform from '@/models/Platform';
import { apiRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// GET /api/platforms
export async function GET(request: NextRequest) {
    try {
        // Rate limiting
        const ip = getClientIp(request);
        const rateLimitResult = apiRateLimit(ip);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const active = searchParams.get('active');

        const query: any = {};

        if (category) {
            query.category = category;
        }

        if (active === 'true') {
            query.isActive = true;
        }

        const platforms = await Platform.find(query)
            .select('-__v')
            .sort({ name: 1 });

        return NextResponse.json({
            success: true,
            count: platforms.length,
            platforms
        });
    } catch (error: any) {
        console.error('Get platforms error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
