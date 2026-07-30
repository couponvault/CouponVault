import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Platform from '@/models/Platform';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await connectDB();
        
        const platform = await Platform.findOne({ slug: params.slug, isActive: true });
        if (!platform) {
            return NextResponse.json({ success: false, error: 'Platform not found' }, { status: 404 });
        }

        // Fetch all active coupons for this platform
        const coupons = await Coupon.find({
            platform: platform._id,
            isActive: true,
            isExpired: false
        })
        .populate('platform', 'name logo slug backgroundColor textColor')
        .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, platform, coupons });
    } catch (error: any) {
        console.error('Get platform details error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
