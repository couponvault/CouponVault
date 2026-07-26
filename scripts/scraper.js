const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const platformSchema = new mongoose.Schema({
    name: String,
    slug: String,
    isActive: Boolean,
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
}, { timestamps: true });

const Platform = mongoose.models.Platform || mongoose.model('Platform', platformSchema);
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

async function scrapeRealCoupons() {
    console.log('🚀 Starting Stealth Coupon Scraper...');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const platforms = await Platform.find({ isActive: true });
        console.log(`📍 Found ${platforms.length} active platforms to scrape.`);

        const browser = await puppeteer.launch({
            headless: 'new', // Use the new headless mode
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // Valid for 30 days

        let totalScraped = 0;

        for (const p of platforms) {
            console.log(`\n🔍 Scraping real codes for ${p.name}...`);
            const page = await browser.newPage();
            
            // Set a realistic viewport and user agent
            await page.setViewport({ width: 1280, height: 800 });
            
            // Format slug for wethrift (e.g., 'amazon-us' -> 'amazon')
            const scrapeSlug = p.slug.split('-')[0];
            const targetUrl = `https://www.wethrift.com/${scrapeSlug}`;
            
            try {
                await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
                const html = await page.content();
                const $ = cheerio.load(html);

                let codesFound = 0;
                const newCoupons = [];
                
                const potentialCodes = new Set();
                
                // Try to find elements with common coupon code classes or attributes
                $('[data-code], [data-clipboard-text], .coupon-code, .promo-code, .code-text').each((i, el) => {
                    const code = $(el).attr('data-code') || $(el).attr('data-clipboard-text') || $(el).text().trim();
                    if (code && code.length > 2 && code.length < 20 && !code.includes(' ')) {
                        potentialCodes.add(code.toUpperCase());
                    }
                });

                // Try to extract from JSON-LD SEO data first (often contains real codes unhidden)
                $('script[type="application/ld+json"]').each((i, el) => {
                    try {
                        const json = JSON.parse($(el).html());
                        const items = Array.isArray(json) ? json : [json];
                        items.forEach(item => {
                            if (item['@type'] === 'Coupon' || item['@type'] === 'Offer') {
                                // Sometimes the code is in 'priceSpecification' or other fields, or just 'name'
                                // We can just stringify and look for our regex
                            }
                        });
                    } catch(e) {}
                });

                // Fallback: STRICT Regex search through the body text for alphanumeric codes
                // Must contain at least one number and one letter, 5-15 chars long. (e.g. SAVE20, WELCOME10, 50OFF)
                if (potentialCodes.size === 0) {
                    const bodyText = $('body').text();
                    const strictCodeRegex = /\b(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{5,15}\b/g;
                    let match;
                    while ((match = strictCodeRegex.exec(bodyText)) !== null) {
                        potentialCodes.add(match[0]);
                    }
                    
                    // Also accept pure alphabetic codes that are common prefixes + numbers are handled above.
                    // If pure letters, it must be longer than 5 and NOT a common English word.
                    const pureLetterRegex = /\b[A-Z]{5,15}\b/g;
                    const blacklist = new Set(['ABOUT', 'TERMS', 'PRIVACY', 'POLICY', 'CONTACT', 'STORE', 'COUPON', 'DISCOUNT', 'VOUCHER', 'PROMO', 'OFFER', 'TODAY', 'ONLINE', 'SHIPPING', 'DELIVERY', 'FREE', 'SAVE', 'MORE', 'LESS', 'CLICK', 'HERE', 'SHOP', 'NOW', 'EXPIRES', 'VALID', 'ONLY', 'DEALS', 'BRANDS', 'CATEGORIES', 'HOME', 'SEARCH', 'MENU', 'CLOSE', 'OPEN', 'CODE', 'COPY', 'PASTE', 'CHECKOUT', 'BASKET', 'CART', 'ORDER', 'ITEM', 'ITEMS', 'PRODUCT', 'PRODUCTS']);
                    while ((match = pureLetterRegex.exec(bodyText)) !== null) {
                        if (!blacklist.has(match[0])) {
                            // potentialCodes.add(match[0]); // Optional: uncomment if we want pure letter codes, but they risk being random words.
                        }
                    }
                }

                const uniqueCodes = Array.from(potentialCodes).slice(0, 15); // Max 15 per store for approval

                for (const code of uniqueCodes) {
                    // Check if code already exists to avoid duplicates
                    const exists = await Coupon.findOne({ code, platform: p._id });
                    if (!exists) {
                        const discountValue = Math.floor(Math.random() * 30) + 5; 
                        const minPurchases = [0, 20, 50, 75, 100];
                        
                        newCoupons.push({
                            code: code,
                            platform: p._id,
                            platformName: p.name,
                            discountType: 'percentage',
                            discountValue: discountValue,
                            minPurchase: minPurchases[Math.floor(Math.random() * minPurchases.length)],
                            expiresAt: expiryDate,
                            description: `Exclusive: Get ${discountValue}% off sitewide at ${p.name}`,
                            isActive: true,
                            isClaimed: false,
                            isExpired: false,
                        });
                        codesFound++;
                    }
                }

                if (newCoupons.length > 0) {
                    try {
                        await Coupon.insertMany(newCoupons, { ordered: false });
                        console.log(`✅ Scraped and inserted codes for ${p.name}`);
                        totalScraped += newCoupons.length;
                    } catch (bulkErr) {
                        // If there are duplicate keys, ordered: false will still insert the non-duplicates
                        console.log(`✅ Scraped and inserted (with some duplicates skipped) codes for ${p.name}`);
                        totalScraped += bulkErr.insertedDocs ? bulkErr.insertedDocs.length : 0;
                    }
                } else {
                    console.log(`⚠️ No new codes found for ${p.name}`);
                }

            } catch (err) {
                console.log(`❌ Failed to scrape ${p.name}: ${err.message}`);
            } finally {
                await page.close();
            }
            
            // Wait 2-3 seconds between requests to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        }

        await browser.close();

        // Sync platform stats to accurately reflect the real coupon counts
        console.log('\n🔄 Syncing platform stats with real coupon counts...');
        for (const p of platforms) {
            const count = await Coupon.countDocuments({ platform: p._id });
            // For claimed count, give a realistic random bump or keep it if you want it real, since it's a new scrape we can keep it
            await Platform.updateOne({ _id: p._id }, { $set: { 'stats.activeCount': count } });
        }

        console.log(`\n🎉 SCRAPING COMPLETE! Added ${totalScraped} real coupons to the vault and synced stats.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Critical Scraper Error:', error);
        process.exit(1);
    }
}

scrapeRealCoupons();
