import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const newMessage = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        return NextResponse.json({
            success: true,
            data: newMessage,
            message: 'Message sent successfully'
        }, { status: 201 });
    } catch (error: any) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
