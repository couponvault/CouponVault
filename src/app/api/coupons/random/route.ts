import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import Platform from '@/models/Platform';
import Activity from '@/models/Activity';
import { getUserFromRequest } from '@/lib/auth';
import { dailyClaimLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// GET /api/coupons/random
export async function GET(request: NextRequest) {
    try {
        const ip = getClientIp(request);
        const user = getUserFromRequest(request);

        // Daily claim rate limiting
        const identifier = user ? user.userId : ip;
        const rateLimitResult = dailyClaimLimit(identifier);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: 'Daily coupon limit reached. Try again tomorrow!',
                    resetAt: rateLimitResult.resetAt
                },
                { status: 429 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const platformSlug = searchParams.get('platform');

        const query: any = {
            isActive: true,
            isClaimed: false,
            isExpired: false,
            expiresAt: { $gt: new Date() }
        };

        if (platformSlug) {
            const platform = await Platform.findOne({ slug: platformSlug, isActive: true });

            if (!platform) {
                return NextResponse.json(
                    { error: 'Platform not found' },
                    { status: 404 }
                );
            }

            query.platform = platform._id;
        }

        // Get random coupon
        const count = await Coupon.countDocuments(query);

        if (count === 0) {
            return NextResponse.json(
                { error: 'No coupons available at the moment. Please try again later.' },
                { status: 404 }
            );
        }

        const random = Math.floor(Math.random() * count);
        const coupon = await Coupon.findOne(query)
            .skip(random)
            .populate('platform', 'name logo slug backgroundColor textColor');

        if (!coupon) {
            return NextResponse.json(
                { error: 'No coupons available' },
                { status: 404 }
            );
        }

        // Increment usage
        coupon.usedCount += 1;
        coupon.claimedAt = new Date();

        if (user) {
            coupon.claimedBy = user.userId as any;
        }

        let isFullyClaimed = false;

        // Deactivate if usage limit reached
        if (coupon.usedCount >= coupon.usageLimit) {
            coupon.isActive = false;
            coupon.isClaimed = true;
            isFullyClaimed = true;
        }

        await coupon.save();

        // Update platform stats
        const platformUpdate: any = {
            $inc: {
                'stats.totalClaimed': 1
            }
        };

        if (isFullyClaimed) {
            platformUpdate.$inc['stats.activeCount'] = -1;
        }

        await Platform.findByIdAndUpdate(coupon.platform, platformUpdate);

        // Log activity
        await Activity.create({
            type: 'coupon_claimed',
            userId: user?.userId,
            couponId: coupon._id,
            platformId: coupon.platform,
            details: {
                ip,
                userAgent: request.headers.get('user-agent') || 'unknown',
                platform: coupon.platformName
            },
            severity: 'low'
        });

        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                platform: coupon.platform,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minPurchase: coupon.minPurchase,
                maxDiscount: coupon.maxDiscount,
                description: coupon.description,
                terms: coupon.terms,
                expiresAt: coupon.expiresAt
            },
            remaining: rateLimitResult.remaining
        });
    } catch (error: any) {
        console.error('Get random coupon error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
