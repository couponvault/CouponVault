require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function runSync() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        
        try { await db.collection('coupons').dropIndex('code_1'); } catch(e) {}

        console.log('Fetching LinkMyDeals API...');
        const apiKey = 'fc11b7de1adb1305bd0a3779615b7b91';
        const url = `https://feed.linkmydeals.com/getOffers/?API_KEY=${apiKey}&format=json`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.result !== true && data.result !== 1 && data.result !== '1' && data.Result !== true && data.Result !== 1 && data.Result !== '1') {
            console.error('LMD API returned false result', data);
            process.exit(1);
        }

        const offers = data.offers || data.Offers || [];
        console.log(`Found ${offers.length} offers from LinkMyDeals`);

        let insertedCount = 0;
        let skippedCount = 0;
        let newPlatformsCount = 0;

        for (const offer of offers) {
            const storeName = offer.Store || offer['Store'] || offer.store;
            if (!storeName) continue;

            const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
            const slug = slugify(storeName);
            
            // 1. Check Platform
            let platform = await db.collection('platforms').findOne({ slug });

            if (!platform) {
                // Create platform
                const catString = (offer.Categories || offer['Categories'] || '').toLowerCase();
                const categoryMap = { 'fashion': 'fashion', 'electronics': 'ecommerce', 'food': 'food', 'travel': 'travel' };
                let matchedCategory = 'other';
                for (const [key, val] of Object.entries(categoryMap)) {
                    if (catString.includes(key)) { matchedCategory = val; break; }
                }

                const platObj = {
                    name: storeName,
                    slug,
                    description: `Discover the best coupons and deals for ${storeName}.`,
                    logo: offer.Image_Url || offer['Image Url'] || offer.image_url || 'https://via.placeholder.com/150',
                    category: matchedCategory,
                    isActive: true,
                    backgroundColor: '#0ea5e9',
                    textColor: '#ffffff',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    stats: { totalGenerated: 0, totalClaimed: 0, activeCount: 0 },
                    couponConfig: { enabled: true, dailyGeneration: 50, expiryDays: 30, usageLimit: 1, codeLength: 12, prefix: '', discountType: 'percentage', discountValue: { min: 5, max: 50 } }
                };
                
                const res = await db.collection('platforms').insertOne(platObj);
                platform = { ...platObj, _id: res.insertedId };
                newPlatformsCount++;
                console.log(`Created new platform: ${storeName}`);
            }

            // 2. Prepare Coupon
            const lmdId = offer.lmd_id || offer.LMD_ID || offer['LMD ID'];
            const rawCode = offer.Code || offer['Code'] || offer.code;
            const isDeal = !rawCode || (offer.Type || offer['Type'] || offer.type)?.toLowerCase().includes('deal');
            const code = isDeal ? `DEAL-${lmdId}` : rawCode;

            if (!code) { skippedCount++; continue; }

            // Check if exists
            const existing = await db.collection('coupons').findOne({ code: code.toUpperCase(), platform: platform._id });
            if (existing) { skippedCount++; continue; }

            // Parse Discount
            const title = offer.Title || offer['Title'] || offer.Offer_Text || '';
            const offerVal = offer.Offer_Value || offer['Offer Value'] || '';
            const titleUpper = title.toUpperCase();
            
            let dType = 'percentage';
            let dVal = 10;
            if (titleUpper.includes('%') || (offerVal && offerVal.includes('%'))) {
                dType = 'percentage';
                dVal = parseInt(offerVal.replace(/[^0-9]/g, '')) || parseInt(title.match(/(\d+)%/)?.[1] || '10');
            } else if (titleUpper.includes('$') || titleUpper.includes('RS') || titleUpper.includes('₹') || (offerVal && offerVal.match(/[$₹]/))) {
                dType = 'fixed';
                dVal = parseInt(offerVal.replace(/[^0-9]/g, '')) || parseInt(title.match(/[$₹](\d+)/)?.[1] || '50');
            } else if (titleUpper.includes('SHIPPING')) {
                dType = 'freeShipping'; dVal = 0;
            } else if (titleUpper.includes('BOGO')) {
                dType = 'bogo'; dVal = 0;
            }

            let expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);
            const endDateStr = offer.End_Date || offer['End Date'];
            if (endDateStr && endDateStr !== '0000-00-00') {
                const parsed = new Date(endDateStr);
                if (!isNaN(parsed.getTime())) expiresAt = parsed;
            }

            // 3. Insert Coupon
            const couponObj = {
                code: code.toUpperCase(),
                platform: platform._id,
                platformName: platform.name,
                discountType: dType,
                discountValue: dVal || 10,
                isActive: true,
                isClaimed: false,
                isExpired: false,
                usageLimit: 1,
                usedCount: 0,
                expiresAt,
                description: offer.Description || offer['Description'] || title,
                source: 'linkmydeals',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await db.collection('coupons').insertOne(couponObj);
            insertedCount++;

            // Update stats
            await db.collection('platforms').updateOne({ _id: platform._id }, { $inc: { 'stats.activeCount': 1 } });
        }

        console.log(`\n--- SYNC COMPLETE ---`);
        console.log(`New Platforms: ${newPlatformsCount}`);
        console.log(`Inserted Coupons: ${insertedCount}`);
        console.log(`Skipped (already exists): ${skippedCount}`);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runSync();
