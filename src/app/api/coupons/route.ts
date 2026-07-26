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

        // Fetch top 10 most recent active coupons
        const coupons = await Coupon.find({
            isActive: true,
            isClaimed: false,
            isExpired: false
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('platform', 'name logo slug backgroundColor textColor');

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
