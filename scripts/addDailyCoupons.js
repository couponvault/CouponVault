require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function addCoupons() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        
        const platforms = await db.collection('platforms').find({}).toArray();
        const getPlatId = (slug) => {
            const p = platforms.find(p => p.slug === slug);
            return p ? p._id : null;
        };
        
        const newDeals = [
            {
                code: 'NEWUSER25',
                platform: getPlatId('doordash'),
                platformName: 'DoorDash',
                discountType: 'percentage',
                discountValue: 25,
                minPurchase: 15,
                description: '25% off your first 3 food deliveries',
            },
            {
                code: 'GLOWUP24',
                platform: getPlatId('sephora'),
                platformName: 'Sephora',
                discountType: 'percentage',
                discountValue: 15,
                minPurchase: 50,
                description: '15% off skincare orders over $50',
            },
            {
                code: 'FREESHIP100',
                platform: getPlatId('macys'),
                platformName: 'Macy\'s',
                discountType: 'fixed',
                discountValue: 0,
                minPurchase: 100,
                description: 'Free Shipping + Extra 10% off on Home Goods',
            }
        ];

        const validDeals = newDeals.filter(d => d.platform !== null).map(deal => ({
            ...deal,
            isActive: true,
            isClaimed: false,
            isExpired: false,
            usageLimit: 999999,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }));

        if (validDeals.length > 0) {
            await db.collection('coupons').insertMany(validDeals);
            console.log(`✅ Successfully added ${validDeals.length} fresh daily coupons!`);
            
            // Sync active count stats
            for (const plat of platforms) {
                const count = await db.collection('coupons').countDocuments({ platform: plat._id });
                await db.collection('platforms').updateOne(
                    { _id: plat._id },
                    { $set: { 'stats.activeCount': count } }
                );
            }
        }
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

addCoupons();
