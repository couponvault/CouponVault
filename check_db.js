require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Coupon = mongoose.model('Coupon', new mongoose.Schema({}, {strict: false}));
    
    console.log('--- Percentage > 100 ---');
    const largePerc = await Coupon.find({ discountType: 'percentage', discountValue: { $gt: 100 } }).limit(5);
    largePerc.forEach(c => console.log(`${c.discountValue}% OFF => ${c.description} (Title fallback?)`));

    console.log('--- Special Deals ---');
    const deals = await Coupon.find({ discountType: 'deal' }).limit(5);
    deals.forEach(c => console.log(`DEAL => ${c.description} || Value: ${c.discountValue}`));

    console.log('--- Random 5 ---');
    const rand = await Coupon.find({}).limit(5);
    rand.forEach(c => console.log(`${c.discountType}: ${c.discountValue} ${c.currency || ''} => ${c.description}`));

    process.exit(0);
}
check();
