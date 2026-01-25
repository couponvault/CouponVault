import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlatform extends Document {
    name: string;
    slug: string;
    description: string;
    logo: string;
    category: string;
    isActive: boolean;
    backgroundColor: string;
    textColor: string;

    // Coupon generation settings
    couponConfig: {
        enabled: boolean;
        dailyGeneration: number;
        expiryDays: number;
        usageLimit: number;
        codeLength: number;
        prefix: string;
        discountType: 'percentage' | 'fixed' | 'freeShipping' | 'bogo';
        discountValue: {
            min: number;
            max: number;
        };
        minPurchase?: number;
    };

    // Statistics
    stats: {
        totalGenerated: number;
        totalClaimed: number;
        activeCount: number;
    };

    // Affiliate
    affiliateTag?: string;
    affiliateUrl?: string;

    createdAt: Date;
    updatedAt: Date;
}

const PlatformSchema = new Schema<IPlatform>(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        logo: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['ecommerce', 'streaming', 'food', 'travel', 'fashion', 'other']
        },
        isActive: { type: Boolean, default: true },
        backgroundColor: { type: String, default: '#0ea5e9' },
        textColor: { type: String, default: '#ffffff' },

        couponConfig: {
            enabled: { type: Boolean, default: true },
            dailyGeneration: { type: Number, default: 50 },
            expiryDays: { type: Number, default: 30 },
            usageLimit: { type: Number, default: 1 },
            codeLength: { type: Number, default: 12 },
            prefix: { type: String, default: '' },
            discountType: {
                type: String,
                enum: ['percentage', 'fixed', 'freeShipping', 'bogo'],
                default: 'percentage'
            },
            discountValue: {
                min: { type: Number, default: 5 },
                max: { type: Number, default: 50 }
            },
            minPurchase: { type: Number }
        },

        stats: {
            totalGenerated: { type: Number, default: 0 },
            totalClaimed: { type: Number, default: 0 },
            activeCount: { type: Number, default: 0 }
        },

        affiliateTag: { type: String },
        affiliateUrl: { type: String }
    },
    { timestamps: true }
);

// Index for faster queries
PlatformSchema.index({ isActive: 1 });
PlatformSchema.index({ category: 1 });

const Platform: Model<IPlatform> =
    mongoose.models.Platform || mongoose.model<IPlatform>('Platform', PlatformSchema);

export default Platform;
