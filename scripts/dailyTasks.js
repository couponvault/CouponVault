// Daily coupon generation cron job
// Run this script daily using cron or a task scheduler

const mongoose = require('mongoose');
const { generateDailyBatch, checkAndRefillLowStock, markExpiredCoupons } = require('../src/utils/couponGenerator');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/couponvault';

async function runDailyTasks() {
    try {
        console.log('🕐 Starting daily coupon tasks...');
        console.log('⏰ Time:', new Date().toISOString());

        // Connect to database
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Task 1: Mark expired coupons
        console.log('\n📌 Task 1: Marking expired coupons...');
        const expiredCount = await markExpiredCoupons();
        console.log(`✅ Marked ${expiredCount} coupons as expired`);

        // Task 2: Generate daily batch
        console.log('\n📌 Task 2: Generating daily coupon batch...');
        const batchResult = await generateDailyBatch();
        console.log(`✅ Generated ${batchResult.generated} coupons across ${batchResult.platforms.length} platforms`);

        if (batchResult.errors.length > 0) {
            console.warn('⚠️  Some errors occurred:');
            batchResult.errors.forEach(err => console.warn(`  - ${err.platform}: ${err.error}`));
        }

        // Task 3: Check and refill low stock
        console.log('\n📌 Task 3: Checking for low stock platforms...');
        const refillResult = await checkAndRefillLowStock();

        if (refillResult.length > 0) {
            console.log(`✅ Refilled ${refillResult.length} platforms:`);
            refillResult.forEach(refill => {
                console.log(`  - ${refill.platform}: ${refill.previous} → ${refill.new} (generated ${refill.generated})`);
            });
        } else {
            console.log('✅ All platforms have sufficient stock');
        }

        // Summary
        console.log('\n📊 Summary:');
        console.log(`   Expired: ${expiredCount}`);
        console.log(`   Generated: ${batchResult.generated}`);
        console.log(`   Platforms refilled: ${refillResult.length}`);
        console.log('\n✨ Daily tasks completed successfully!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error running daily tasks:', error);
        process.exit(1);
    }
}

// Run the tasks
runDailyTasks();
