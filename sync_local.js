require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');

// Mongoose schema definitions
const PlatformSchema = new mongoose.Schema({
    name: String, slug: String, description: String, logo: String, category: String, isActive: { type: Boolean, default: true }, backgroundColor: String, textColor: String,
    couponConfig: Object, stats: Object
}, { timestamps: true, strict: false });
const Platform = mongoose.models.Platform || mongoose.model('Platform', PlatformSchema);

const CouponSchema = new mongoose.Schema({
    code: String, platform: mongoose.Schema.Types.ObjectId, platformName: String, discountType: String, discountValue: Number, currency: String,
    isActive: Boolean, isClaimed: Boolean, isExpired: Boolean, expiresAt: Date, description: String, source: String, minPurchase: Number
}, { timestamps: true, strict: false });
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

function slugify(text) {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function decodeEntities(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&#8377;/g, '₹')
        .replace(/&#163;/g, '£')
        .replace(/&#8364;/g, '€')
        .replace(/&#128;/g, '€')
        .replace(/&#36;/g, '$')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ');
}

function parseDiscount(title, offerValue) {
    title = decodeEntities(title);
    offerValue = decodeEntities(offerValue);
    const titleUpper = title.toUpperCase();
    let currency = '';
    const currencyMatch = title.match(/([$£€₹])/) || offerValue.match(/([$£€₹])/);
    if (currencyMatch) currency = currencyMatch[1];

    if (titleUpper.includes('%') || (offerValue && offerValue.includes('%'))) {
        return { type: 'percentage', value: parseInt(offerValue.replace(/[^0-9]/g, '')) || parseInt(title.match(/(\d+)%/)?.[1] || '10'), currency: '' };
    }
    if (titleUpper.includes('$') || titleUpper.includes('RS') || titleUpper.includes('₹') || titleUpper.includes('£') || titleUpper.includes('€') || (offerValue && offerValue.match(/[$£€₹]/))) {
        if (!currency && titleUpper.includes('RS')) currency = '₹';
        return { type: 'fixed', value: parseInt(offerValue.replace(/[^0-9]/g, '')) || parseInt(title.match(/[$£€₹](\d+)/)?.[1] || title.match(/(\d+)/)?.[1] || '50'), currency: currency || '$' };
    }
    if (titleUpper.includes('SHIPPING')) return { type: 'freeShipping', value: 0, currency: '' };
    if (titleUpper.includes('BOGO') || titleUpper.includes('BUY 1 GET 1')) return { type: 'bogo', value: 0, currency: '' };
    const fallbackValue = parseInt(offerValue.replace(/[^0-9]/g, ''));
    if (!isNaN(fallbackValue) && fallbackValue > 0) return { type: 'percentage', value: fallbackValue, currency: '' };
    return { type: 'deal', value: 0, currency: '' };
}

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const apiKey = process.env.LINKMYDEALS_API_KEY;
    console.log('Fetching LinkMyDeals API...');
    const response = await fetch(`https://feed.linkmydeals.com/getOffers/?API_KEY=${apiKey}&format=json`);
    const data = await response.json();
    const offers = data.offers || data.Offers || [];
    console.log(`Found ${offers.length} offers`);
    
    let inserted = 0;
    for (const offer of offers) {
        const storeName = offer.Store || offer.store;
        if (!storeName) continue;
        const slug = slugify(storeName);
        let platform = await Platform.findOne({ slug });
        if (!platform) {
            platform = await Platform.create({
                name: storeName, slug, description: `Discover the best coupons and deals for ${storeName}.`,
                logo: offer.Image_Url || offer.image_url || `https://www.google.com/s2/favicons?domain=${storeName}&sz=128`,
                category: 'other', isActive: true, backgroundColor: '#0ea5e9', textColor: '#ffffff'
            });
        }
        
        const code = offer.Code || offer.code || `DEAL-${offer.LMD_ID || offer.lmd_id}`;
        if (!code) continue;
        const exists = await Coupon.findOne({ code: code.toUpperCase(), platform: platform._id });
        if (exists) continue;

        const title = offer.Title || offer.title || offer.Offer_Text || offer.offer_text || '';
        const offerVal = offer.Offer_Value || offer.offer_value || offer['Offer Value'] || '';
        const parsedDiscount = parseDiscount(title, offerVal);

        let expiresAt = new Date(); expiresAt.setDate(expiresAt.getDate() + 15);
        const endDateStr = offer.End_Date || offer.end_date;
        if (endDateStr && endDateStr !== '0000-00-00') expiresAt = new Date(endDateStr);

        await Coupon.create({
            code: code.toUpperCase(), platform: platform._id, platformName: platform.name,
            discountType: parsedDiscount.type, discountValue: parsedDiscount.value, currency: parsedDiscount.currency,
            isActive: true, isClaimed: false, isExpired: false, expiresAt,
            title: title,
            description: offer.Description || offer.description || title, source: 'linkmydeals'
        });
        inserted++;
    }
    console.log(`Done! Inserted ${inserted} coupons.`);
    process.exit(0);
}
run();
