import { customAlphabet } from 'nanoid';
import Coupon from '@/models/Coupon';
import Platform, { IPlatform } from '@/models/Platform';
import connectDB from '@/lib/mongodb';

const EVERGREEN_CODES = [
    'WELCOME50', 'FIRSTORDER', 'FREEDELIVERY', 'SAVE20', 'NEWUSER',
    'FESTIVAL25', 'MEGA10', 'SUPERDEAL', 'CASHBACK', 'GRABNOW',
    'TRYME', 'DISCOUNT20', 'FLAT50', 'BOGO', 'EXTRA10'
];

// Generate realistic evergreen coupon codes
const generateCouponCode = (length: number = 12, prefix: string = ''): string => {
    const baseCode = EVERGREEN_CODES[Math.floor(Math.random() * EVERGREEN_CODES.length)];
    // Add a random 2-digit number to prevent strict collisions
    const randomSuffix = Math.floor(Math.random() * 90) + 10;
    const code = `${baseCode}${randomSuffix}`;
    return prefix ? `${prefix}${code}` : code;
};

// Generate a random discount value within range
const generateDiscountValue = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate expiry date
const calculateExpiryDate = (days: number): Date => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
};

// Generate a single coupon for a platform
export async function generateCouponForPlatform(
    platform: IPlatform,
    customConfig?: Partial<IPlatform['couponConfig']>
): Promise<any> {
    const config = { ...platform.couponConfig, ...customConfig };

    if (!config.enabled) {
        throw new Error(`Coupon generation is disabled for ${platform.name}`);
    }

    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure unique code
    while (!isUnique && attempts < maxAttempts) {
        code = generateCouponCode(config.codeLength, config.prefix);
        const existing = await Coupon.findOne({ code });
        if (!existing) {
            isUnique = true;
        }
        attempts++;
    }

    if (!isUnique) {
        throw new Error('Failed to generate unique coupon code');
    }

    const discountValue = generateDiscountValue(
        config.discountValue.min,
        config.discountValue.max
    );

    const expiresAt = calculateExpiryDate(config.expiryDays);

    const coupon = await Coupon.create({
        code: code!,
        platform: platform._id,
        platformName: platform.name,
        discountType: config.discountType,
        discountValue,
        minPurchase: config.minPurchase,
        maxDiscount: config.discountType === 'percentage' ? discountValue * 5 : undefined,
        usageLimit: config.usageLimit,
        expiresAt,
        isActive: true,
        isClaimed: false,
        isExpired: false,
        usedCount: 0,
        description: `Get ${discountValue}${config.discountType === 'percentage' ? '%' : '$'} off on ${platform.name}`,
        terms: `Valid until ${expiresAt.toDateString()}. ${config.minPurchase ? `Minimum purchase: $${config.minPurchase}` : ''}`
    });

    // Update platform stats
    await Platform.findByIdAndUpdate(platform._id, {
        $inc: {
            'stats.totalGenerated': 1,
            'stats.activeCount': 1
        }
    });

    return coupon;
}

// Bulk generate coupons for a platform
export async function bulkGenerateCoupons(
    platformId: string,
    count: number
): Promise<any[]> {
    await connectDB();

    const platform = await Platform.findById(platformId);
    if (!platform) {
        throw new Error('Platform not found');
    }

    if (!platform.couponConfig.enabled) {
        throw new Error(`Coupon generation is disabled for ${platform.name}`);
    }

    const coupons = [];
    const errors = [];

    for (let i = 0; i < count; i++) {
        try {
            const coupon = await generateCouponForPlatform(platform);
            coupons.push(coupon);
        } catch (error: any) {
            errors.push({ index: i, error: error.message });
        }
    }

    return coupons;
}

// Generate daily batch for all active platforms
export async function generateDailyBatch(): Promise<{
    success: boolean;
    generated: number;
    platforms: string[];
    errors: any[];
}> {
    await connectDB();

    const activePlatforms = await Platform.find({
        isActive: true,
        'couponConfig.enabled': true
    });

    let totalGenerated = 0;
    const platformsProcessed: string[] = [];
    const errors: any[] = [];

    for (const platform of activePlatforms) {
        try {
            const count = platform.couponConfig.dailyGeneration;
            const coupons = await bulkGenerateCoupons(platform._id.toString(), count);
            totalGenerated += coupons.length;
            platformsProcessed.push(platform.name);
        } catch (error: any) {
            errors.push({ platform: platform.name, error: error.message });
        }
    }

    return {
        success: errors.length === 0,
        generated: totalGenerated,
        platforms: platformsProcessed,
        errors
    };
}

// Auto-refill when stock is low
export async function checkAndRefillLowStock(): Promise<any> {
    await connectDB();

    const threshold = parseInt(process.env.AUTO_REFILL_THRESHOLD || '20');
    const activePlatforms = await Platform.find({
        isActive: true,
        'couponConfig.enabled': true
    });

    const refilled: any[] = [];

    for (const platform of activePlatforms) {
        // Count available coupons
        const availableCount = await Coupon.countDocuments({
            platform: platform._id,
            isActive: true,
            isClaimed: false,
            isExpired: false,
            expiresAt: { $gt: new Date() }
        });

        if (availableCount < threshold) {
            const toGenerate = platform.couponConfig.dailyGeneration;
            const coupons = await bulkGenerateCoupons(platform._id.toString(), toGenerate);

            refilled.push({
                platform: platform.name,
                previous: availableCount,
                generated: coupons.length,
                new: availableCount + coupons.length
            });
        }
    }

    return refilled;
}

// Mark expired coupons
export async function markExpiredCoupons(): Promise<number> {
    await connectDB();

    const result = await Coupon.updateMany(
        {
            isExpired: false,
            expiresAt: { $lt: new Date() }
        },
        {
            $set: {
                isExpired: true,
                isActive: false
            }
        }
    );

    // Update platform stats
    const expiredCoupons = await Coupon.find({
        isExpired: true,
        updatedAt: { $gte: new Date(Date.now() - 60000) } // Last minute
    }).distinct('platform');

    for (const platformId of expiredCoupons) {
        const expiredCount = await Coupon.countDocuments({
            platform: platformId,
            isExpired: true,
            updatedAt: { $gte: new Date(Date.now() - 60000) }
        });

        await Platform.findByIdAndUpdate(platformId, {
            $inc: { 'stats.activeCount': -expiredCount }
        });
    }

    return result.modifiedCount;
}

export {
    generateCouponCode,
    generateDiscountValue,
    calculateExpiryDate
};
