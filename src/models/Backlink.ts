import mongoose, { Schema, Document } from 'mongoose';

export interface IBacklink extends Document {
    url: string;
    anchorText: string;
    targetUrl: string;
    type: 'dofollow' | 'nofollow' | 'unknown';
    status: 'active' | 'lost' | 'pending';
    source: 'manual' | 'csv';
    domainAuthority: number;
    lastCheckedAt: Date | null;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const backlinkSchema = new Schema<IBacklink>({
    url: {
        type: String,
        required: true,
        trim: true,
    },
    anchorText: {
        type: String,
        default: '',
        trim: true,
    },
    targetUrl: {
        type: String,
        default: 'https://couponvault.in',
        trim: true,
    },
    type: {
        type: String,
        enum: ['dofollow', 'nofollow', 'unknown'],
        default: 'unknown',
    },
    status: {
        type: String,
        enum: ['active', 'lost', 'pending'],
        default: 'pending',
    },
    source: {
        type: String,
        enum: ['manual', 'csv'],
        default: 'manual',
    },
    domainAuthority: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    lastCheckedAt: {
        type: Date,
        default: null,
    },
    notes: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Index for faster queries
backlinkSchema.index({ status: 1 });
backlinkSchema.index({ type: 1 });
backlinkSchema.index({ createdAt: -1 });

const Backlink = mongoose.models.Backlink || mongoose.model<IBacklink>('Backlink', backlinkSchema);

export default Backlink;
