require('dotenv').config({ path: '.env.local' });
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const cheerio = require('cheerio');
const mongoose = require('mongoose');

async function scrapeReddit() {
    console.log('🚀 Starting Reddit Coupon Scraper...');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const p = await db.collection('platforms').find({}).toArray();
        
        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        
        const targetUrl = 'https://old.reddit.com/r/coupons/';
        console.log(`\n🔍 Scraping Reddit r/coupons...`);
        
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const html = await page.content();
        const $ = cheerio.load(html);

        const newCoupons = [];
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // Valid for 30 days
        
        $('p.title a.title').each((i, el) => {
            const title = $(el).text();
            // Typical format: [Amazon] 20% off Shoes (Code: XYZ123)
            
            // Find platform match
            let matchedPlatform = null;
            for(const plat of p) {
                if(title.toLowerCase().includes(plat.name.toLowerCase().split(' ')[0])) {
                    matchedPlatform = plat;
                    break;
                }
            }
            
            if(matchedPlatform) {
                // Try to extract a code (often after words like Code, Coupon, Use)
                const codeMatch = title.match(/(?:code|use|coupon)[\s:]*([A-Z0-9]{4,15})\b/i);
                // Also look for discount percentage
                const discountMatch = title.match(/(\d+)%/);
                
                if(codeMatch && codeMatch[1]) {
                    const code = codeMatch[1].toUpperCase();
                    const discount = discountMatch ? parseInt(discountMatch[1]) : 15;
                    
                    newCoupons.push({
                        code: code,
                        platform: matchedPlatform._id,
                        platformName: matchedPlatform.name,
                        discountType: 'percentage',
                        discountValue: discount,
                        minPurchase: 0,
                        isActive: true,
                        isClaimed: false,
                        isExpired: false,
                        description: title.length > 50 ? title.substring(0, 50) + '...' : title,
                        expiresAt: expiryDate
                    });
                }
            }
        });
        
        if (newCoupons.length > 0) {
            // Filter duplicates by checking existing codes
            const uniqueCoupons = [];
            for (const c of newCoupons) {
                const exists = await db.collection('coupons').findOne({ code: c.code, platform: c.platform });
                if (!exists) {
                    uniqueCoupons.push(c);
                }
            }
            if (uniqueCoupons.length > 0) {
                await db.collection('coupons').insertMany(uniqueCoupons);
                console.log(`✅ Extracted and saved ${uniqueCoupons.length} fresh codes from Reddit!`);
                
                // Sync stats
                for (const plat of p) {
                    const count = await db.collection('coupons').countDocuments({ platform: plat._id });
                    await db.collection('platforms').updateOne(
                        { _id: plat._id },
                        { $set: { 'stats.activeCount': count } }
                    );
                }
            } else {
                console.log(`⚠️ Found codes on Reddit, but they are already in the database.`);
            }
        } else {
            console.log(`⚠️ No matched brand codes found on the front page of r/coupons right now.`);
        }

        await browser.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Scraper Error:', error);
        process.exit(1);
    }
}

scrapeReddit();
