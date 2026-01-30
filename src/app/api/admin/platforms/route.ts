import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Platform from '@/models/Platform';
import { verifyAdmin } from '@/lib/auth'; // Assuming this exists for security

export async function GET() {
    try {
        await connectDB();
        const platforms = await Platform.find({}).sort({ name: 1 });
        return NextResponse.json({ success: true, platforms });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Simple security check (you might want to use your actual auth logic here)
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Basic validation
        if (!data.name || !data.slug) {
            return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });
        }

        const platform = await Platform.create(data);
        return NextResponse.json({ success: true, platform });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { id, ...updateData } = data;

        if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

        const platform = await Platform.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ success: true, platform });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

        await Platform.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Platform deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
