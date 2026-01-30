import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout
export async function POST(request: NextRequest) {
    const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully'
    });

    // Clear cookie
    response.cookies.delete('token');

    return response;
}
