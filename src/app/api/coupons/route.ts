import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import Platform from '@/models/Platform';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        
        // Ensure Platform is registered
        const p = Platform; 

        // Fetch 10 random active coupons to ensure brand diversity on homepage
        const couponsAggregation = await Coupon.aggregate([
            {
                $match: {
                    isActive: true,
                    isClaimed: false,
                    isExpired: false
                }
            },
            { $sample: { size: 10 } }
        ]);

        // Populate platform manually since aggregate doesn't populate directly
        const coupons = await Coupon.populate(couponsAggregation, {
            path: 'platform',
            select: 'name logo slug backgroundColor textColor category'
        });

        return NextResponse.json({
            success: true,
            coupons
        });
    } catch (error: any) {
        console.error('Get coupons error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
