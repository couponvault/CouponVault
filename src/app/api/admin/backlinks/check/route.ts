import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Backlink from '@/models/Backlink';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 mins for checking many links

// POST /api/admin/backlinks/check — Check if backlinks are still live
export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const backlinkId = body.id; // Optional: check single link

        let backlinksToCheck;
        if (backlinkId) {
            const single = await Backlink.findById(backlinkId);
            backlinksToCheck = single ? [single] : [];
        } else {
            // Check all pending or check all
            backlinksToCheck = await Backlink.find({}).limit(50); // Max 50 at a time
        }

        if (backlinksToCheck.length === 0) {
            return NextResponse.json({ success: true, message: 'No backlinks to check', checked: 0 });
        }

        let activeCount = 0;
        let lostCount = 0;
        let errorCount = 0;

        for (const backlink of backlinksToCheck) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

                const response = await fetch(backlink.url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; CouponVaultBot/1.0; +https://couponvault.in)',
                    },
                    signal: controller.signal,
                    redirect: 'follow',
                });

                clearTimeout(timeout);

                if (response.ok) {
                    const html = await response.text();
                    const lowerHtml = html.toLowerCase();

                    // Check if our domain is mentioned in the page
                    const hasLink = lowerHtml.includes('couponvault.in') || 
                                    lowerHtml.includes('couponvault');

                    if (hasLink) {
                        // Check dofollow/nofollow
                        let linkType: 'dofollow' | 'nofollow' | 'unknown' = 'dofollow';
                        
                        // Find all links containing our domain
                        const linkRegex = /<a[^>]*href=[^>]*couponvault[^>]*>/gi;
                        const matches = html.match(linkRegex);
                        
                        if (matches) {
                            for (const match of matches) {
                                if (match.toLowerCase().includes('nofollow')) {
                                    linkType = 'nofollow';
                                    break;
                                }
                            }
                        }

                        await Backlink.findByIdAndUpdate(backlink._id, {
                            status: 'active',
                            type: linkType,
                            lastCheckedAt: new Date(),
                        });
                        activeCount++;
                    } else {
                        // Page loads but our link is not found
                        await Backlink.findByIdAndUpdate(backlink._id, {
                            status: 'lost',
                            lastCheckedAt: new Date(),
                        });
                        lostCount++;
                    }
                } else {
                    // Page returned error (404, 500, etc.)
                    await Backlink.findByIdAndUpdate(backlink._id, {
                        status: 'lost',
                        lastCheckedAt: new Date(),
                    });
                    lostCount++;
                }
            } catch (err) {
                // Network error or timeout
                await Backlink.findByIdAndUpdate(backlink._id, {
                    status: 'lost',
                    lastCheckedAt: new Date(),
                    notes: backlink.notes ? backlink.notes + ' | Check failed: timeout/network error' : 'Check failed: timeout/network error',
                });
                errorCount++;
            }

            // Small delay between requests to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return NextResponse.json({
            success: true,
            message: 'Link check completed',
            stats: {
                checked: backlinksToCheck.length,
                active: activeCount,
                lost: lostCount,
                errors: errorCount,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
