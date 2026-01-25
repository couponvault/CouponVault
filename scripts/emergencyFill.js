const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
require('dotenv').config({ path: '.env.local' });

const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 12);

async function fillVault() {
    try {
        console.log('🔄 Connecting to MongoDB to fill coupons...');
        await mongoose.connect(process.env.MONGODB_URI);

        // Define proper schema for this script
        const platformSchema = new mongoose.Schema({
            name: String,
            slug: String,
            isActive: Boolean,
            stats: {
                activeCount: Number,
                totalGenerated: Number
            }
        });

        const couponSchema = new mongoose.Schema({
            code: String,
            platform: mongoose.Schema.Types.ObjectId,
            platformName: String,
            discountType: String,
            discountValue: Number,
            minPurchase: Number,
            isActive: { type: Boolean, default: true },
            isClaimed: { type: Boolean, default: false },
            isExpired: { type: Boolean, default: false },
            expiresAt: Date,
            description: String,
            usedCount: { type: Number, default: 0 },
            usageLimit: { type: Number, default: 1 }
        });

        const Platform = mongoose.models.Platform || mongoose.model('Platform', platformSchema);
        const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

        const platforms = await Platform.find({ isActive: true });
        console.log(`📍 Found ${platforms.length} platforms. Generating coupons...`);

        let totalCreated = 0;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        for (const p of platforms) {
            if (!p.name) continue;

            const coupons = [];
            const count = 50;

            for (let i = 0; i < count; i++) {
                const code = nanoid();
                const value = Math.floor(Math.random() * 40) + 10;

                coupons.push({
                    code: p.name.substring(0, 3).toUpperCase() + code,
                    platform: p._id,
                    platformName: p.name,
                    discountType: 'percentage',
                    discountValue: value,
                    minPurchase: 499,
                    expiresAt: expiryDate,
                    description: `Get ${value}% off on all orders at ${p.name}`,
                    isActive: true,
                    isClaimed: false,
                    isExpired: false,
                    usedCount: 0,
                    usageLimit: 1
                });
            }

            await Coupon.insertMany(coupons);

            // Update platform stats
            await Platform.findByIdAndUpdate(p._id, {
                $set: {
                    'stats.activeCount': count,
                    'stats.totalGenerated': count
                }
            });

            totalCreated += count;
            console.log(`✅ Generated ${count} coupons for ${p.name}`);
        }

        console.log(`\n🎉 SUCCESS! Added ${totalCreated} total coupons to your vault.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error filling vault:', err);
        process.exit(1);
    }
}

fillVault();
