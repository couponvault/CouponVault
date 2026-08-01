require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');

async function clean() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Coupon = mongoose.model('Coupon', new mongoose.Schema({source: String}, {strict: false}));
    const res = await Coupon.deleteMany({});
    console.log(`Deleted ${res.deletedCount} all coupons.`);
    process.exit(0);
}
clean();
