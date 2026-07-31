import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
    if (!process.env.MONGODB_URI) {
        console.error('No MONGODB_URI found.');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
        console.error('No DB connection.');
        process.exit(1);
    }

    const coupons = await db.collection('coupons').find({}).toArray();
    console.log(`Found ${coupons.length} coupons to randomize.`);

    let updated = 0;
    for (const coupon of coupons) {
        const randomDays = Math.floor(Math.random() * (60 - 5 + 1)) + 5;
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + randomDays);
        
        await db.collection('coupons').updateOne(
            { _id: coupon._id },
            { $set: { expiresAt: newExpiry } }
        );
        updated++;
    }

    console.log(`Successfully randomized expiry dates for ${updated} coupons.`);
    process.exit(0);
}

run().catch(console.error);
