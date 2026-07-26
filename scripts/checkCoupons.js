require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    const count = await db.collection('coupons').countDocuments();
    console.log(`Total coupons: ${count}`);
    
    if (count > 0) {
        const first = await db.collection('coupons').findOne({});
        console.log('Sample Coupon:', first);
        
        const platform = await db.collection('platforms').findOne({ _id: first.platform });
        console.log('Matched Platform:', platform);
    }
    
    process.exit(0);
}

run();
