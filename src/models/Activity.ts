import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
    type: 'coupon_claimed' | 'coupon_generated' | 'platform_added' | 'login' | 'suspicious_activity';
    userId?: mongoose.Types.ObjectId;
    couponId?: mongoose.Types.ObjectId;
    platformId?: mongoose.Types.ObjectId;

    details: {
        ip?: string;
        userAgent?: string;
        platform?: string;
        action?: string;
        metadata?: Record<string, any>;
    };

    severity: 'low' | 'medium' | 'high';

    createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
    {
        type: {
            type: String,
            required: true,
            enum: ['coupon_claimed', 'coupon_generated', 'platform_added', 'login', 'suspicious_activity']
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
        platformId: { type: Schema.Types.ObjectId, ref: 'Platform' },

        details: {
            ip: { type: String },
            userAgent: { type: String },
            platform: { type: String },
            action: { type: String },
            metadata: { type: Schema.Types.Mixed }
        },

        severity: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        }
    },
    { timestamps: true }
);

// Indexes
ActivitySchema.index({ type: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ severity: 1, createdAt: -1 });

const Activity: Model<IActivity> =
    mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
