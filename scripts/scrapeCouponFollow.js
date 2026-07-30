require('dotenv').config({ path: '.env.local' });
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// Try multiple smaller/simpler coupon sources
const SOURCES = [
    // Source 1: RetailMeNot (simple HTML structure)
    {
        name: 'retailmenot',
        stores: [
            { url: 'https://www.retailmenot.com/view/nike.com', brand: 'Nike' },
            { url: 'https://www.retailmenot.com/view/adidas.com', brand: 'Adidas' },
            { url: 'https://www.retailmenot.com/view/target.com', brand: 'Target' },
            { url: 'https://www.retailmenot.com/view/bestbuy.com', brand: 'Best Buy' },
            { url: 'https://www.retailmenot.com/view/macys.com', brand: "Macy's" },
            { url: 'https://www.retailmenot.com/view/sephora.com', brand: 'Sephora' },
        ]
    },
    // Source 2: Knoji / Dealspotr simple pages  
    {
        name: 'couponcabin',
        stores: [
            { url: 'https://www.couponcabin.com/coupons/nike/', brand: 'Nike' },
            { url: 'https://www.couponcabin.com/coupons/adidas/', brand: 'Adidas' },
            { url: 'https://www.couponcabin.com/coupons/sephora/', brand: 'Sephora' },
        ]
    },
    // Source 3: Promocodes.com (simpler site)
    {
        name: 'promocodes',
        stores: [
            { url: 'https://www.promocodes.com/nike.com-coupons', brand: 'Nike' },
            { url: 'https://www.promocodes.com/target.com-coupons', brand: 'Target' },
            { url: 'https://www.promocodes.com/sephora.com-coupons', brand: 'Sephora' },
            { url: 'https://www.promocodes.com/bestbuy.com-coupons', brand: 'Best Buy' },
            { url: 'https://www.promocodes.com/macys.com-coupons', brand: "Macy's" },
            { url: 'https://www.promocodes.com/adidas.com-coupons', brand: 'Adidas' },
            { url: 'https://www.promocodes.com/amazon.com-coupons', brand: 'Amazon' },
            { url: 'https://www.promocodes.com/walmart.com-coupons', brand: 'Walmart' },
            { url: 'https://www.promocodes.com/ebay.com-coupons', brand: 'eBay' },
            { url: 'https://www.promocodes.com/kohls.com-coupons', brand: "Kohl's" },
            { url: 'https://www.promocodes.com/nordstrom.com-coupons', brand: 'Nordstrom' },
            { url: 'https://www.promocodes.com/gap.com-coupons', brand: 'GAP' },
            { url: 'https://www.promocodes.com/doordash.com-coupons', brand: 'DoorDash' },
            { url: 'https://www.promocodes.com/shein.com-coupons', brand: 'SHEIN' },
            { url: 'https://www.promocodes.com/asos.com-coupons', brand: 'ASOS' },
        ]
    }
];

async function multiSourceScraper() {
    console.log('🚀 Starting Multi-Source Coupon Scraper...\n');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const platforms = await db.collection('platforms').find({}).toArray();

        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

        let totalSaved = 0;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 45);

        for (const source of SOURCES) {
            console.log(`\n📦 Source: ${source.name.toUpperCase()}`);
            console.log('='.repeat(40));

            for (const store of source.stores) {
                console.log(`  🔍 ${store.brand} → ${store.url}`);

                try {
                    await page.goto(store.url, { waitUntil: 'networkidle2', timeout: 20000 });
                    await new Promise(r => setTimeout(r, 3000));

                    // Take a screenshot for debugging first store
                    const screenshotPath = `scripts/debug-${source.name}-${store.brand.toLowerCase().replace(/[^a-z]/g, '')}.png`;
                    
                    // Universal code extraction
                    const result = await page.evaluate(() => {
                        const codes = [];
                        const descriptions = [];
                        const bodyText = document.body.innerText || '';

                        // Strategy 1: Find elements that look like coupon codes
                        document.querySelectorAll('*').forEach(el => {
                            const text = el.textContent?.trim();
                            const classList = (el.className || '').toString().toLowerCase();
                            
                            // Check if this element has coupon-related class
                            if (classList.includes('code') || classList.includes('coupon') || classList.includes('promo')) {
                                if (text && /^[A-Z0-9]{3,20}$/i.test(text) && !text.includes(' ') && text.length <= 20) {
                                    codes.push(text.toUpperCase());
                                }
                            }
                        });

                        // Strategy 2: data attributes
                        document.querySelectorAll('[data-code], [data-coupon-code], [data-clipboard-text], [data-promo]').forEach(el => {
                            const code = el.getAttribute('data-code') || el.getAttribute('data-coupon-code') || 
                                        el.getAttribute('data-clipboard-text') || el.getAttribute('data-promo');
                            if (code && /^[A-Z0-9]{3,20}$/i.test(code.trim())) {
                                codes.push(code.trim().toUpperCase());
                            }
                        });

                        // Strategy 3: Input fields with readonly
                        document.querySelectorAll('input[readonly], input[type="text"][value]').forEach(el => {
                            const val = el.value?.trim();
                            if (val && /^[A-Z0-9]{3,20}$/i.test(val)) {
                                codes.push(val.toUpperCase());
                            }
                        });

                        // Strategy 4: Regex on full body text
                        const codePatterns = bodyText.match(/(?:code|use|promo|coupon|apply)[:\s]+([A-Z0-9]{4,15})\b/gi);
                        if (codePatterns) {
                            for (const match of codePatterns) {
                                const extracted = match.replace(/^(?:code|use|promo|coupon|apply)[:\s]+/i, '').trim().toUpperCase();
                                if (/^[A-Z0-9]{4,15}$/.test(extracted)) {
                                    codes.push(extracted);
                                }
                            }
                        }

                        // Strategy 5: Look for standalone uppercase codes near discount keywords
                        const lines = bodyText.split('\n');
                        for (const line of lines) {
                            if (line.includes('%') || line.toLowerCase().includes('off') || line.toLowerCase().includes('free')) {
                                descriptions.push(line.trim().substring(0, 100));
                                const inlineCode = line.match(/\b([A-Z0-9]{5,15})\b/g);
                                if (inlineCode) {
                                    for (const c of inlineCode) {
                                        // Filter out common false positives
                                        if (!/^(OFF|FREE|SAVE|DEAL|SALE|CODE|WITH|FROM|SHOP|MORE|BEST|ONLY|FLAT|UPTO|EXTRA|OFFER)$/i.test(c)) {
                                            codes.push(c);
                                        }
                                    }
                                }
                            }
                        }

                        return { 
                            codes: [...new Set(codes)], 
                            descriptions: descriptions.slice(0, 20),
                            pageLength: bodyText.length,
                            title: document.title
                        };
                    });

                    if (result.pageLength < 50) {
                        console.log(`     ❌ Page blocked/empty (${result.pageLength} chars)`);
                        continue;
                    }

                    // Find platform in DB
                    const platform = platforms.find(p => p.name.toLowerCase() === store.brand.toLowerCase());
                    if (!platform) {
                        console.log(`     ⚠️  Platform "${store.brand}" not in DB`);
                        if (result.codes.length > 0) {
                            console.log(`     📝 Found codes but no platform: ${result.codes.join(', ')}`);
                        }
                        continue;
                    }

                    if (result.codes.length > 0) {
                        let saved = 0;
                        for (let i = 0; i < result.codes.length; i++) {
                            const code = result.codes[i];
                            const exists = await db.collection('coupons').findOne({ code, platform: platform._id });
                            if (exists) continue;

                            const desc = result.descriptions[i] || '';
                            const pctMatch = desc.match(/(\d+)%/);
                            const dolMatch = desc.match(/\$(\d+)/);

                            await db.collection('coupons').insertOne({
                                code,
                                platform: platform._id,
                                discountType: dolMatch ? 'fixed' : 'percentage',
                                discountValue: pctMatch ? parseInt(pctMatch[1]) : (dolMatch ? parseInt(dolMatch[1]) : 15),
                                minPurchase: 0,
                                isActive: true,
                                isClaimed: false,
                                isExpired: false,
                                usageLimit: 999999,
                                description: desc || `${store.brand} promo code`,
                                source: source.name,
                                expiresAt: expiryDate,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            });
                            saved++;
                        }
                        totalSaved += saved;
                        console.log(`     ✅ Found ${result.codes.length} codes, saved ${saved} new`);
                    } else {
                        console.log(`     ⚠️  No codes (page ${result.pageLength} chars, title: "${result.title?.substring(0, 40)}")`);
                    }

                    await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));

                } catch (err) {
                    console.log(`     ❌ Error: ${err.message?.substring(0, 50)}`);
                }
            }
        }

        // Update stats
        console.log('\n📊 Updating platform stats...');
        const allPlatforms = await db.collection('platforms').find({}).toArray();
        for (const plat of allPlatforms) {
            const count = await db.collection('coupons').countDocuments({ platform: plat._id, isActive: true });
            await db.collection('platforms').updateOne({ _id: plat._id }, { $set: { 'stats.activeCount': count } });
        }

        await browser.close();
        console.log('\n' + '='.repeat(50));
        console.log(`🎉 MULTI-SOURCE SCRAPING COMPLETE!`);
        console.log(`   📦 Total new coupons saved: ${totalSaved}`);
        console.log('='.repeat(50));
        process.exit(0);

    } catch (error) {
        console.error('❌ Fatal:', error);
        process.exit(1);
    }
}

multiSourceScraper();
