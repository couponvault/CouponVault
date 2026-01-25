// Database seeder script for CouponVault
// Run with: node scripts/seedDatabase.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/couponvault';

// Platform data
const platformsData = [
    {
        name: 'Amazon',
        slug: 'amazon',
        description: 'Get exclusive discounts on millions of products from Amazon India',
        logo: '🛒',
        category: 'ecommerce',
        backgroundColor: '#FF9900',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 100,
            expiryDays: 30,
            usageLimit: 1,
            codeLength: 12,
            prefix: 'AMZ',
            discountType: 'percentage',
            discountValue: { min: 10, max: 50 },
            minPurchase: 500
        }
    },
    {
        name: 'Flipkart',
        slug: 'flipkart',
        description: 'Save big on electronics, fashion, and more with Flipkart coupons',
        logo: '🛍️',
        category: 'ecommerce',
        backgroundColor: '#2874F0',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 100,
            expiryDays: 30,
            usageLimit: 1,
            codeLength: 12,
            prefix: 'FLK',
            discountType: 'percentage',
            discountValue: { min: 10, max: 60 },
            minPurchase: 499
        }
    },
    {
        name: 'Netflix',
        slug: 'netflix',
        description: 'Stream unlimited movies and TV shows with Netflix discount codes',
        logo: '📺',
        category: 'streaming',
        backgroundColor: '#E50914',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 50,
            expiryDays: 60,
            usageLimit: 1,
            codeLength: 10,
            prefix: 'NFX',
            discountType: 'percentage',
            discountValue: { min: 10, max: 30 },
        }
    },
    {
        name: 'Amazon Prime',
        slug: 'amazon-prime',
        description: 'Get Prime membership discounts and exclusive deals',
        logo: '🎬',
        category: 'streaming',
        backgroundColor: '#00A8E1',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 50,
            expiryDays: 45,
            usageLimit: 1,
            codeLength: 12,
            prefix: 'PRIME',
            discountType: 'percentage',
            discountValue: { min: 15, max: 40 },
        }
    },
    {
        name: 'Myntra',
        slug: 'myntra',
        description: 'Fashion and lifestyle products at amazing discounts',
        logo: '👗',
        category: 'fashion',
        backgroundColor: '#FF3F6C',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 80,
            expiryDays: 30,
            usageLimit: 1,
            codeLength: 10,
            prefix: 'MYN',
            discountType: 'percentage',
            discountValue: { min: 20, max: 70 },
            minPurchase: 799
        }
    },
    {
        name: 'Ajio',
        slug: 'ajio',
        description: 'Trendy fashion and accessories with exclusive coupons',
        logo: '👔',
        category: 'fashion',
        backgroundColor: '#C1282D',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 70,
            expiryDays: 30,
            usageLimit: 1,
            codeLength: 10,
            prefix: 'AJO',
            discountType: 'percentage',
            discountValue: { min: 15, max: 60 },
            minPurchase: 999
        }
    },
    {
        name: 'Swiggy',
        slug: 'swiggy',
        description: 'Order food online and save with Swiggy coupons',
        logo: '🍔',
        category: 'food',
        backgroundColor: '#FC8019',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 150,
            expiryDays: 7,
            usageLimit: 1,
            codeLength: 8,
            prefix: 'SWG',
            discountType: 'percentage',
            discountValue: { min: 20, max: 50 },
            minPurchase: 199
        }
    },
    {
        name: 'Zomato',
        slug: 'zomato',
        description: 'Food delivery deals and restaurant discounts',
        logo: '🍕',
        category: 'food',
        backgroundColor: '#E23744',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 150,
            expiryDays: 7,
            usageLimit: 1,
            codeLength: 8,
            prefix: 'ZOM',
            discountType: 'percentage',
            discountValue: { min: 20, max: 60 },
            minPurchase: 199
        }
    },
    {
        name: 'MakeMyTrip',
        slug: 'makemytrip',
        description: 'Travel bookings with exclusive discounts on flights and hotels',
        logo: '✈️',
        category: 'travel',
        backgroundColor: '#ED1944',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 60,
            expiryDays: 45,
            usageLimit: 1,
            codeLength: 10,
            prefix: 'MMT',
            discountType: 'fixed',
            discountValue: { min: 500, max: 3000 },
            minPurchase: 2000
        }
    },
    {
        name: 'Uber',
        slug: 'uber',
        description: 'Ride and food delivery discounts with Uber',
        logo: '🚗',
        category: 'travel',
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        couponConfig: {
            enabled: true,
            dailyGeneration: 120,
            expiryDays: 14,
            usageLimit: 1,
            codeLength: 8,
            prefix: 'UBR',
            discountType: 'percentage',
            discountValue: { min: 15, max: 40 },
        }
    },
];

// Schema definitions
const PlatformSchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    logo: String,
    category: String,
    isActive: { type: Boolean, default: true },
    backgroundColor: String,
    textColor: String,
    couponConfig: {
        enabled: Boolean,
        dailyGeneration: Number,
        expiryDays: Number,
        usageLimit: Number,
        codeLength: Number,
        prefix: String,
        discountType: String,
        discountValue: {
            min: Number,
            max: Number
        },
        minPurchase: Number
    },
    stats: {
        totalGenerated: { type: Number, default: 0 },
        totalClaimed: { type: Number, default: 0 },
        activeCount: { type: Number, default: 0 }
    }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

async function seedDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get or create models
        const Platform = mongoose.models.Platform || mongoose.model('Platform', PlatformSchema);
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Platform.deleteMany({});
        await User.deleteMany({});

        // Insert platforms
        console.log('📦 Inserting platforms...');
        await Platform.insertMany(platformsData);
        console.log(`✅ Inserted ${platformsData.length} platforms`);

        // Create admin user
        const bcrypt = require('bcryptjs');
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 10);

        await User.create({
            email: process.env.ADMIN_EMAIL || 'admin@couponvault.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'admin',
            isActive: true
        });
        console.log('✅ Created admin user');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nAdmin Credentials:');
        console.log('Email:', process.env.ADMIN_EMAIL || 'admin@couponvault.com');
        console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin@12345');
        console.log('\n⚠️  Remember to change the admin password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
