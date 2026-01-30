import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Platform from '@/models/Platform';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Contact from '@/models/Contact';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/stats
export async function GET(request: NextRequest) {
    try {
        const user = getUserFromRequest(request);

        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get statistics
        const [
            totalPlatforms,
            activePlatforms,
            totalCoupons,
            activeCoupons,
            claimedCoupons,
            expiredCoupons,
            totalUsers,
            recentActivity,
            recentMessages
        ] = await Promise.all([
            Platform.countDocuments(),
            Platform.countDocuments({ isActive: true }),
            Coupon.countDocuments(),
            Coupon.countDocuments({ isActive: true, isClaimed: false, isExpired: false }),
            Coupon.countDocuments({ isClaimed: true }),
            Coupon.countDocuments({ isExpired: true }),
            User.countDocuments(),
            Activity.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('userId', 'name email')
                .populate('platformId', 'name'),
            Contact.find()
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        // Platform statistics
        const platformStats = await Platform.aggregate([
            {
                $project: {
                    name: 1,
                    'stats.totalGenerated': 1,
                    'stats.totalClaimed': 1,
                    'stats.activeCount': 1
                }
            },
            { $sort: { 'stats.totalClaimed': -1 } },
            { $limit: 5 }
        ]);

        // All active platforms for the dropdown
        const allPlatforms = await Platform.find({ isActive: true }).select('name _id');

        return NextResponse.json({
            success: true,
            stats: {
                platforms: {
                    total: totalPlatforms,
                    active: activePlatforms
                },
                coupons: {
                    total: totalCoupons,
                    active: activeCoupons,
                    claimed: claimedCoupons,
                    expired: expiredCoupons
                },
                users: {
                    total: totalUsers
                }
            },
            topPlatforms: platformStats,
            allPlatforms,
            recentActivity,
            recentMessages
        });
    } catch (error: any) {
        console.error('Get admin stats error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
