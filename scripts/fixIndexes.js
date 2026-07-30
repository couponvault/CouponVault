require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function fixDatabaseIndexes() {
    console.log('🔧 Fixing database indexes...');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        // Check indexes on coupons collection
        const couponIndexes = await db.collection('coupons').indexes();
        console.log('Current Coupons Indexes:');
        console.log(JSON.stringify(couponIndexes, null, 2));

        // Let's drop the problematic index if it exists (usually a unique index on code that doesn't include platform, or something similar)
        // We will try to find any unique index that might be causing E11000
        for (let idx of couponIndexes) {
            if (idx.unique && idx.name !== '_id_') {
                console.log(`Dropping unique index: ${idx.name}`);
                await db.collection('coupons').dropIndex(idx.name);
            }
        }

        // Check indexes on platforms collection
        const platformIndexes = await db.collection('platforms').indexes();
        console.log('Current Platforms Indexes:');
        console.log(JSON.stringify(platformIndexes, null, 2));

        for (let idx of platformIndexes) {
            if (idx.unique && idx.name !== '_id_') {
                console.log(`Dropping unique index on platforms: ${idx.name}`);
                await db.collection('platforms').dropIndex(idx.name);
            }
        }

        console.log('✅ Indexes fixed!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixDatabaseIndexes();
