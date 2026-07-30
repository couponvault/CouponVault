import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import Platform from '@/models/Platform';

export const dynamic = 'force-dynamic';

async function fetchCoupons(limit: number, excludeIds: string[] = []) {
    await connectDB();
    const p = Platform; // Ensure registered

    const matchQuery: any = {
        isActive: true,
        isClaimed: false,
        isExpired: false
    };

    if (excludeIds.length > 0) {
        matchQuery._id = { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) };
    }

    const couponsAggregation = await Coupon.aggregate([
        { $match: matchQuery },
        { $sample: { size: limit } }
    ]);

    const coupons = await Coupon.populate(couponsAggregation, {
        path: 'platform',
        select: 'name logo slug backgroundColor textColor category'
    });

    const totalLeft = await Coupon.countDocuments(matchQuery);

    return {
        coupons,
        hasMore: totalLeft > coupons.length
    };
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '30', 10);
        
        const result = await fetchCoupons(limit);
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        console.error('Get coupons error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const limit = body.limit || 30;
        const exclude = body.exclude || [];
        
        const result = await fetchCoupons(limit, exclude);
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        console.error('Post coupons error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
