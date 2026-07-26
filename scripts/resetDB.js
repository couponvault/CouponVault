require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    await db.collection('coupons').deleteMany({});
    await db.collection('platforms').updateMany({}, { $set: { 'stats.activeCount': 0, 'stats.totalClaimed': 0 } });
    console.log('Emptied all fake coupons and reset stats');
    process.exit(0);
}
run();
