import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    platform: mongoose.Types.ObjectId;
    platformName: string;

    // Discount details
    discountType: 'percentage' | 'fixed' | 'freeShipping' | 'bogo';
    discountValue: number;
    currency?: string;
    minPurchase?: number;
    maxDiscount?: number;

    // Status and usage
    isActive: boolean;
    isClaimed: boolean;
    isExpired: boolean;
    usageLimit: number;
    usedCount: number;

    // Timing
    expiresAt: Date;
    claimedAt?: Date;
    claimedBy?: mongoose.Types.ObjectId;

    // Metadata
    title?: string;
    description?: string;
    terms?: string;

    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        platform: {
            type: Schema.Types.ObjectId,
            ref: 'Platform',
            required: true
        },
        platformName: { type: String, required: true },

        discountType: {
            type: String,
            required: true,
            enum: ['percentage', 'fixed', 'freeShipping', 'bogo']
        },
        discountValue: { type: Number, required: true },
        currency: { type: String },
        minPurchase: { type: Number },
        maxDiscount: { type: Number },

        isActive: { type: Boolean, default: true },
        isClaimed: { type: Boolean, default: false },
        isExpired: { type: Boolean, default: false },
        usageLimit: { type: Number, default: 1 },
        usedCount: { type: Number, default: 0 },

        expiresAt: { type: Date, required: true },
        claimedAt: { type: Date },
        claimedBy: { type: Schema.Types.ObjectId, ref: 'User' },

        title: { type: String },
        description: { type: String },
        terms: { type: String }
    },
    { timestamps: true }
);

// Indexes for performance
CouponSchema.index({ platform: 1, isActive: 1, isClaimed: 1 });
CouponSchema.index({ expiresAt: 1 });
CouponSchema.index({ isActive: 1, isClaimed: 1, isExpired: 1 });

// Compound index for efficient querying
CouponSchema.index({
    platform: 1,
    isActive: 1,
    isClaimed: 1,
    isExpired: 1,
    expiresAt: -1
});

const Coupon: Model<ICoupon> =
    mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
