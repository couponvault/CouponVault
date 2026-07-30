require('dotenv').config({ path: '.env.local' });
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function debugCouponFollow() {
    console.log('🔍 Debugging CouponFollow...\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

    // Intercept ALL network responses
    const apiResponses = [];
    page.on('response', async (response) => {
        const url = response.url();
        const ct = response.headers()['content-type'] || '';
        if (ct.includes('json') || url.includes('api') || url.includes('offer') || url.includes('coupon') || url.includes('graphql')) {
            try {
                const body = await response.text();
                if (body.length > 10 && body.length < 500000) {
                    apiResponses.push({ url: url.substring(0, 200), size: body.length, preview: body.substring(0, 400) });
                }
            } catch(e) {}
        }
    });

    await page.goto('https://www.couponfollow.com/site/nike.com', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));

    console.log(`📡 Captured ${apiResponses.length} API responses:\n`);
    for (const r of apiResponses) {
        console.log(`URL: ${r.url}`);
        console.log(`Size: ${r.size}b | Preview: ${r.preview.substring(0, 200)}`);
        console.log('-'.repeat(80));
    }

    // Dump visible text
    const text = await page.evaluate(() => document.body.innerText);
    console.log('\n📄 VISIBLE PAGE TEXT (first 2000 chars):\n');
    console.log(text.substring(0, 2000));

    // Element analysis
    const counts = await page.evaluate(() => ({
        buttons: document.querySelectorAll('button').length,
        btnReveal: document.querySelectorAll('.btn-reveal').length,
        coverBtns: document.querySelectorAll('.btn-reveal .cover').length,
        codeEls: document.querySelectorAll('[class*="code"]').length,
        offerEls: document.querySelectorAll('[class*="offer"]').length,
        dataCode: document.querySelectorAll('[data-code]').length,
        dataClipboard: document.querySelectorAll('[data-clipboard-text]').length,
    }));
    console.log('\n📊 ELEMENT COUNTS:', JSON.stringify(counts, null, 2));

    await browser.close();
    process.exit(0);
}

debugCouponFollow();
