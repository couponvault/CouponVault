import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin route — redirect to /login if no token
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Verify the token is valid and user is admin
        try {
            // Decode JWT payload (middle part) without full verification
            // Full verification happens in API routes
            const payload = JSON.parse(
                Buffer.from(token.split('.')[1], 'base64').toString()
            );

            if (payload.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Check if token is expired
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                const loginUrl = new URL('/login', request.url);
                loginUrl.searchParams.set('redirect', pathname);
                const response = NextResponse.redirect(loginUrl);
                response.cookies.delete('token');
                return response;
            }
        } catch {
            // Invalid token — clear it and redirect to login
            const loginUrl = new URL('/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
