import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Backlink from '@/models/Backlink';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/backlinks — Fetch all backlinks
export async function GET(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        const filter: any = {};
        if (status && status !== 'all') filter.status = status;
        if (type && type !== 'all') filter.type = type;

        const [backlinks, total] = await Promise.all([
            Backlink.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Backlink.countDocuments(filter),
        ]);

        // Get summary stats
        const [totalCount, activeCount, lostCount, pendingCount, dofollowCount, nofollowCount] = await Promise.all([
            Backlink.countDocuments(),
            Backlink.countDocuments({ status: 'active' }),
            Backlink.countDocuments({ status: 'lost' }),
            Backlink.countDocuments({ status: 'pending' }),
            Backlink.countDocuments({ type: 'dofollow' }),
            Backlink.countDocuments({ type: 'nofollow' }),
        ]);

        return NextResponse.json({
            success: true,
            backlinks,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            stats: {
                total: totalCount,
                active: activeCount,
                lost: lostCount,
                pending: pendingCount,
                dofollow: dofollowCount,
                nofollow: nofollowCount,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/admin/backlinks — Add a new backlink
export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const data = await request.json();

        if (!data.url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Basic URL validation
        try {
            new URL(data.url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        // Check for duplicate
        const existing = await Backlink.findOne({ url: data.url });
        if (existing) {
            return NextResponse.json({ error: 'This backlink URL already exists' }, { status: 400 });
        }

        const backlink = await Backlink.create({
            url: data.url,
            anchorText: data.anchorText || '',
            targetUrl: data.targetUrl || 'https://couponvault.in',
            type: data.type || 'unknown',
            status: 'pending',
            source: 'manual',
            domainAuthority: data.domainAuthority || 0,
            notes: data.notes || '',
        });

        return NextResponse.json({ success: true, backlink }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/backlinks — Delete a backlink
export async function DELETE(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Backlink ID is required' }, { status: 400 });
        }

        await Backlink.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Backlink deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
