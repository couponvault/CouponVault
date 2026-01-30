import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    isActive: boolean;

    // User preferences
    favorites: mongoose.Types.ObjectId[];

    // Usage tracking
    claimedCoupons: {
        coupon: mongoose.Types.ObjectId;
        claimedAt: Date;
        platform: string;
    }[];

    dailyClaimCount: number;
    lastClaimDate?: Date;
    totalClaims: number;

    // Security
    loginAttempts: number;
    lockUntil?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: { type: String, required: true },
        name: { type: String, required: true },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        isActive: { type: Boolean, default: true },

        favorites: [{ type: Schema.Types.ObjectId, ref: 'Platform' }],

        claimedCoupons: [{
            coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
            claimedAt: { type: Date, default: Date.now },
            platform: { type: String }
        }],

        dailyClaimCount: { type: Number, default: 0 },
        lastClaimDate: { type: Date },
        totalClaims: { type: Number, default: 0 },

        loginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date }
    },
    { timestamps: true }
);

// Indexes
UserSchema.index({ role: 1 });

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
