import { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

export function rateLimit(config: RateLimitConfig) {
    return (identifier: string): { success: boolean; remaining: number; resetAt: number } => {
        const now = Date.now();
        const limitData = rateLimitStore.get(identifier);

        // Clean up expired entries
        if (limitData && limitData.resetAt < now) {
            rateLimitStore.delete(identifier);
        }

        const currentData = rateLimitStore.get(identifier);

        if (!currentData) {
            // First request
            rateLimitStore.set(identifier, {
                count: 1,
                resetAt: now + config.windowMs
            });

            return {
                success: true,
                remaining: config.maxRequests - 1,
                resetAt: now + config.windowMs
            };
        }

        if (currentData.count >= config.maxRequests) {
            return {
                success: false,
                remaining: 0,
                resetAt: currentData.resetAt
            };
        }

        currentData.count++;

        return {
            success: true,
            remaining: config.maxRequests - currentData.count,
            resetAt: currentData.resetAt
        };
    };
}

// Get client IP from request
export function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    return 'unknown';
}

// API rate limiter
export const apiRateLimit = rateLimit({
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || '15')) * 60 * 1000
});

// Strict rate limiter for sensitive operations
export const strictRateLimit = rateLimit({
    maxRequests: 10,
    windowMs: 60 * 1000 // 1 minute
});

// Daily claim rate limiter
export const dailyClaimLimit = rateLimit({
    maxRequests: 10,
    windowMs: 24 * 60 * 60 * 1000 // 24 hours
});

// Contact form rate limiter
export const contactLimit = rateLimit({
    maxRequests: 5,
    windowMs: 24 * 60 * 60 * 1000 // 24 hours
});

// Clean up old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetAt < now) {
            rateLimitStore.delete(key);
        }
    }
}, 60 * 1000); // Clean every minute
