import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { comparePassword, generateToken } from '@/lib/auth';
import { strictRateLimit, getClientIp } from '@/lib/rateLimit';

// POST /api/auth/login
export async function POST(request: NextRequest) {
    try {
        // Strict rate limiting for login
        const ip = getClientIp(request);
        const rateLimitResult = strictRateLimit(ip);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
                { status: 429 }
            );
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            return NextResponse.json(
                { error: `Account locked. Try again in ${remainingTime} minutes.` },
                { status: 423 }
            );
        }

        // Check if account is active
        if (!user.isActive) {
            return NextResponse.json(
                { error: 'Account is disabled' },
                { status: 403 }
            );
        }

        // Verify password
        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            // Increment login attempts
            user.loginAttempts += 1;

            // Lock account after 5 failed attempts
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
                await user.save();

                // Log suspicious activity
                await Activity.create({
                    type: 'suspicious_activity',
                    userId: user._id,
                    details: {
                        ip,
                        action: 'multiple_failed_login_attempts',
                        userAgent: request.headers.get('user-agent') || 'unknown'
                    },
                    severity: 'high'
                });

                return NextResponse.json(
                    { error: 'Account locked due to multiple failed login attempts. Try again in 30 minutes.' },
                    { status: 423 }
                );
            }

            await user.save();

            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        // Log activity
        await Activity.create({
            type: 'login',
            userId: user._id,
            details: {
                ip,
                userAgent: request.headers.get('user-agent') || 'unknown'
            },
            severity: 'low'
        });

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
