require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');

async function clean() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Coupon = mongoose.model('Coupon', new mongoose.Schema({source: String}, {strict: false}));
    const Platform = mongoose.models.Platform || mongoose.model('Platform', new mongoose.Schema({}, {strict: false}));
    
    const res = await Coupon.deleteMany({});
    const res2 = await Platform.deleteMany({});
    
    console.log(`Deleted ${res.deletedCount} all coupons.`);
    console.log(`Deleted ${res2.deletedCount} all platforms.`);
    process.exit(0);
}
clean();
