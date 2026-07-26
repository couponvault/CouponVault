import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import Platform from '@/models/Platform';

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        // Basic validation
        if (!data.platform || !data.code || !data.description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const platform = await Platform.findById(data.platform);
        if (!platform) {
            return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
        }

        // Check for duplicate
        const existing = await Coupon.findOne({ code: data.code, platform: platform._id });
        if (existing) {
            return NextResponse.json({ error: 'Coupon code already exists for this platform' }, { status: 400 });
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90); // Default to 90 days for manual coupons

        const newCoupon = await Coupon.create({
            code: data.code,
            platform: platform._id,
            platformName: platform.name,
            discountType: data.discountType,
            discountValue: Number(data.discountValue) || 0,
            minPurchase: Number(data.minPurchase) || 0,
            description: data.description,
            expiresAt: expiryDate,
            usageLimit: 999999,
            isActive: true,
            isClaimed: false,
            isExpired: false
        });

        // Sync platform stats
        const count = await Coupon.countDocuments({ platform: platform._id });
        await Platform.updateOne({ _id: platform._id }, { $set: { 'stats.activeCount': count } });

        return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
