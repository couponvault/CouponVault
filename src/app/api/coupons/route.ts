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

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '30', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const skip = (page - 1) * limit;

        // Fetch latest active coupons
        const coupons = await Coupon.find({
            isActive: true,
            isClaimed: false,
            isExpired: false
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('platform', 'name logo slug backgroundColor textColor category');

        const total = await Coupon.countDocuments({
            isActive: true,
            isClaimed: false,
            isExpired: false
        });

        return NextResponse.json({
            success: true,
            coupons,
            hasMore: skip + coupons.length < total
        });
    } catch (error: any) {
        console.error('Get coupons error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
