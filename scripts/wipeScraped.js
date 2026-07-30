require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function wipeScrapedCoupons() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        // Delete ALL coupons added by the multi-source scraper
        const deleteResult = await db.collection('coupons').deleteMany({
            source: { $in: ['retailmenot', 'promocodes', 'couponcabin', 'couponfollow'] }
        });
        
        console.log(`Deleted ${deleteResult.deletedCount} coupons that were scraped incorrectly.`);

        // Also update platform stats
        const allPlatforms = await db.collection('platforms').find({}).toArray();
        for (const plat of allPlatforms) {
            const count = await db.collection('coupons').countDocuments({ platform: plat._id, isActive: true });
            await db.collection('platforms').updateOne({ _id: plat._id }, { $set: { 'stats.activeCount': count } });
        }
        console.log('Platform stats updated.');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
wipeScrapedCoupons();
