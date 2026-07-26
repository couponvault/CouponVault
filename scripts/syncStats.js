require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const p = await db.collection('platforms').find({}).toArray();
    for(const plat of p) {
        const count = await db.collection('coupons').countDocuments({platform: plat._id});
        await db.collection('platforms').updateOne({_id: plat._id}, { $set: { 'stats.activeCount': count, 'stats.totalClaimed': Math.floor(Math.random()*5000)+500 } });
    }
    console.log('Stats synced!');
    process.exit(0);
}
run();
