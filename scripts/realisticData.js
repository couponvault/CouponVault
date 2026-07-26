require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    await db.collection('coupons').deleteMany({});
    
    const p = await db.collection('platforms').find({}).toArray();
    const newC = [];
    const descs = [
        'Extra %V% off your entire order',
        'Save %V% on select items',
        '%V% discount sitewide',
        'Up to %V% off clearance sale',
        'Take %V% off regular priced styles',
        'Enjoy %V% off on top electronics',
        'Get %V% back on food delivery',
        '%V% off when you sign up for rewards',
        'Verified %V% discount for students'
    ];
    
    for (const plat of p) {
        const count = Math.floor(Math.random() * 8) + 5; // 5 to 12 coupons
        for (let i = 0; i < count; i++) {
            const isPercentage = Math.random() > 0.3;
            let v = isPercentage ? (Math.floor(Math.random() * 8) * 5 + 10) : (Math.floor(Math.random() * 10) * 5 + 5);
            // v is 10, 15, 20...50%  or $5, $10...$50
            const t = isPercentage ? 'percentage' : 'fixed';
            let d = descs[Math.floor(Math.random() * descs.length)].replace('%V%', t === 'percentage' ? v + '%' : '$' + v);
            
            // Random prefix for codes
            const prefixes = ['SAVE', 'DEAL', 'PROMO', plat.name.substring(0,3).toUpperCase(), 'GET'];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const code = `${prefix}${v}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

            newC.push({
                code: code,
                platform: plat._id,
                platformName: plat.name,
                discountType: t,
                discountValue: v,
                minPurchase: Math.random() > 0.5 ? (Math.floor(Math.random() * 3) + 1) * 25 : 0, // $0, $25, $50, $75
                isActive: true,
                isClaimed: false,
                isExpired: false,
                description: d,
                expiresAt: new Date(Date.now() + (Math.floor(Math.random() * 60) + 10) * 24 * 60 * 60 * 1000) // 10-70 days
            });
        }
        
        await db.collection('platforms').updateOne(
            { _id: plat._id },
            { $set: { 'stats.activeCount': count, 'stats.totalClaimed': Math.floor(Math.random() * 5000) + 1200 } }
        );
    }
    
    await db.collection('coupons').insertMany(newC);
    console.log('Generated ' + newC.length + ' realistic coupons and synced stats.');
    process.exit(0);
}

run();
