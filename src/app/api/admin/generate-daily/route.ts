import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { generateDailyBatch, markExpiredCoupons } from '@/utils/couponGenerator';

export const dynamic = 'force-dynamic';

// This API will be called by Vercel Cron every night
export async function GET(request: NextRequest) {
    // Security: Check for Vercel Cron Secret (Optional but recommended)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    try {
        await connectDB();

        // 1. Mark old coupons as expired
        const expiredCount = await markExpiredCoupons();

        // 2. Generate new batch for today
        const batchResult = await generateDailyBatch();

        return NextResponse.json({
            success: true,
            message: 'Daily automation completed',
            expiredCount,
            generatedCount: batchResult.generated
        });
    } catch (error: any) {
        console.error('Automation error:', error);
        return NextResponse.json({ error: 'Daily automation failed' }, { status: 500 });
    }
}
