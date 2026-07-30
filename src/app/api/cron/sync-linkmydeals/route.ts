import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Coupon from '@/models/Coupon';
import Platform from '@/models/Platform';

export const maxDuration = 300; // 5 mins for cron
export const dynamic = 'force-dynamic';

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function parseDiscount(title: string, offerValue: string) {
    const titleUpper = title.toUpperCase();
    if (titleUpper.includes('%') || (offerValue && offerValue.includes('%'))) {
        return {
            type: 'percentage',
            value: parseInt(offerValue.replace(/[^0-9]/g, '')) || parseInt(title.match(/(\d+)%/)?.[1] || '10')
        };
    }
    if (titleUpper.includes('$') || titleUpper.includes('RS') || titleUpper.includes('₹') || (offerValue && offerValue.match(/[$₹]/))) {
        return {
            type: 'fixed',
            value: parseInt(offerValue.replace(/[^0-9]/g, '')) || parseInt(title.match(/[$₹](\d+)/)?.[1] || '50')
        };
    }
    if (titleUpper.includes('SHIPPING')) {
        return { type: 'freeShipping', value: 0 };
    }
    if (titleUpper.includes('BOGO') || titleUpper.includes('BUY 1 GET 1')) {
        return { type: 'bogo', value: 0 };
    }
    return { type: 'percentage', value: parseInt(offerValue.replace(/[^0-9]/g, '')) || 10 };
}

export async function GET(request: Request) {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
        
        try { await mongoose.connection.db.collection('coupons').dropIndex('code_1'); } catch(e) {}

        const apiKey = 'fc11b7de1adb1305bd0a3779615b7b91';
        const url = `https://feed.linkmydeals.com/getOffers/?API_KEY=${apiKey}&format=json`;
        
        console.log('Fetching LinkMyDeals API...');
        const response = await fetch(url);
        const data = await response.json();

        if (data.result !== true && data.result !== 1 && data.result !== '1' && data.Result !== true && data.Result !== 1 && data.Result !== '1') {
            return NextResponse.json({ success: false, message: 'LMD API returned false result', data });
        }

        const offers = data.offers || data.Offers || [];
        console.log(`Found ${offers.length} offers from LinkMyDeals`);

        let insertedCount = 0;
        let skippedCount = 0;
        let newPlatformsCount = 0;

        for (const offer of offers) {
            try {
                // Handle JSON keys that might have spaces or underscores
                const storeName = offer.Store || offer['Store'] || offer.store;
                if (!storeName) continue;

                // 1. Ensure Platform Exists
                const slug = slugify(storeName);
                let platform = await Platform.findOne({ slug });

                if (!platform) {
                    // Create new platform
                    const categoryMap: Record<string, string> = {
                        'fashion': 'fashion',
                        'electronics': 'ecommerce',
                        'food': 'food',
                        'travel': 'travel'
                    };
                    const catString = (offer.Categories || offer['Categories'] || '').toLowerCase();
                    let matchedCategory = 'other';
                    for (const [key, val] of Object.entries(categoryMap)) {
                        if (catString.includes(key)) {
                            matchedCategory = val;
                            break;
                        }
                    }

                    platform = new Platform({
                        name: storeName,
                        slug,
                        description: `Discover the best coupons and deals for ${storeName}.`,
                        logo: offer.Image_Url || offer['Image Url'] || offer.image_url || 'https://via.placeholder.com/150',
                        category: matchedCategory,
                        isActive: true,
                        backgroundColor: '#0ea5e9',
                        textColor: '#ffffff',
                    });
                    await platform.save();
                    newPlatformsCount++;
                    console.log(`Created new platform: ${storeName}`);
                }

                // 2. Prepare Coupon
                const lmdId = offer.lmd_id || offer.LMD_ID || offer['LMD ID'];
                const rawCode = offer.Code || offer['Code'] || offer.code;
                const isDeal = !rawCode || (offer.Type || offer['Type'] || offer.type)?.toLowerCase().includes('deal');
                
                // We use LMD ID in the code if it's a deal so it stays unique
                const code = isDeal ? `DEAL-${lmdId}` : rawCode;

                if (!code) {
                    skippedCount++;
                    continue; // Skip if completely empty
                }

                // Check if code exists for this platform
                const existing = await Coupon.findOne({ code: code.toUpperCase(), platform: platform._id });
                if (existing) {
                    skippedCount++;
                    continue; // Already exists
                }

                // Parse discount
                const title = offer.Title || offer['Title'] || offer.Offer_Text || '';
                const offerVal = offer.Offer_Value || offer['Offer Value'] || '';
                const parsedDiscount = parseDiscount(title, offerVal);

                // Parse Expiry
                let expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30); // Default +30 days
                const endDateStr = offer.End_Date || offer['End Date'];
                if (endDateStr && endDateStr !== '0000-00-00') {
                    const parsedDate = new Date(endDateStr);
                    if (!isNaN(parsedDate.getTime())) {
                        expiresAt = parsedDate;
                    }
                }

                // 3. Insert Coupon
                const newCoupon = new Coupon({
                    code,
                    platform: platform._id,
                    platformName: platform.name,
                    discountType: parsedDiscount.type,
                    discountValue: parsedDiscount.value,
                    isActive: true,
                    isClaimed: false,
                    isExpired: false,
                    expiresAt,
                    description: offer.Description || offer['Description'] || title,
                    source: 'linkmydeals'
                });

                await newCoupon.save();
                insertedCount++;

                // Update platform stats
                await Platform.findByIdAndUpdate(platform._id, {
                    $inc: { 'stats.activeCount': 1 }
                });

            } catch (err) {
                console.error(`Error processing offer ${offer.LMD_ID}:`, err);
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Sync completed successfully',
            stats: {
                totalOffers: offers.length,
                insertedCoupons: insertedCount,
                skippedCoupons: skippedCount,
                newPlatformsCreated: newPlatformsCount
            }
        });

    } catch (error: any) {
        console.error('LMD Sync Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
