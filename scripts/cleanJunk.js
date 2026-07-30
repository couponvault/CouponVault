require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function cleanJunkCoupons() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        // Find all coupons added recently (or from specific sources)
        const coupons = await db.collection('coupons').find({ source: { $in: ['retailmenot', 'promocodes', 'couponcabin'] } }).toArray();
        console.log(`Found ${coupons.length} coupons from recent scrapers`);

        const junkWords = ['OFF', 'FREE', 'SAVE', 'DEAL', 'SALE', 'CODE', 'WITH', 'FROM', 'SHOP', 'MORE', 'BEST', 'ONLY', 'FLAT', 'UPTO', 'EXTRA', 'OFFER', 'CREDIT', 'EXPIRES', 'EXPIRATION', 'PROMO', 'ONLINE', 'STORE', 'APPLY', 'COUPON', 'DISCOUNT', 'VOUCHER', 'CHECKOUT', 'CLICK', 'HERE', 'TODAY', 'NOW', 'GET', 'TAKE', 'ORDERS', 'PURCHASE', 'ITEMS', 'SELECT', 'STYLES', 'CLEARANCE', 'SHIPPING', 'DELIVERY', 'YOUR', 'ORDER', 'SITEWIDE', 'EXCLUSIONS', 'APPLY', 'LIMITED', 'TIME', 'OFFERS', 'CODES', 'EXPI'];
        
        let deleted = 0;
        for (let c of coupons) {
            const isJunk = junkWords.some(w => c.code.toUpperCase().includes(w));
            const isTooShort = c.code.length < 5;
            const isJustLetters = /^[A-Z]+$/.test(c.code) && c.code.length < 8; // Most real codes have numbers or are longer

            if (isJunk || isTooShort || isJustLetters) {
                // Let's print a few
                if (deleted < 10) console.log(`Deleting junk code: ${c.code}`);
                await db.collection('coupons').deleteOne({ _id: c._id });
                deleted++;
            }
        }

        console.log(`Deleted ${deleted} junk coupons.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
cleanJunkCoupons();
