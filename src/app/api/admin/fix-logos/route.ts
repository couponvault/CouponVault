import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Platform from '@/models/Platform';

export const dynamic = 'force-dynamic';

// Curated high-quality logo URLs for known brands
const BRAND_LOGOS: Record<string, string> = {
    // E-Commerce
    'amazon': 'https://logo.clearbit.com/amazon.com',
    'flipkart': 'https://logo.clearbit.com/flipkart.com',
    'ebay': 'https://logo.clearbit.com/ebay.com',
    'walmart': 'https://logo.clearbit.com/walmart.com',
    'target': 'https://logo.clearbit.com/target.com',
    'bestbuy': 'https://logo.clearbit.com/bestbuy.com',
    'best-buy': 'https://logo.clearbit.com/bestbuy.com',
    'aliexpress': 'https://logo.clearbit.com/aliexpress.com',
    'shopify': 'https://logo.clearbit.com/shopify.com',
    'etsy': 'https://logo.clearbit.com/etsy.com',
    'wayfair': 'https://logo.clearbit.com/wayfair.com',
    'overstock': 'https://logo.clearbit.com/overstock.com',
    'costco': 'https://logo.clearbit.com/costco.com',
    'samsclub': 'https://logo.clearbit.com/samsclub.com',
    'sams-club': 'https://logo.clearbit.com/samsclub.com',
    'newegg': 'https://logo.clearbit.com/newegg.com',
    'wish': 'https://logo.clearbit.com/wish.com',
    'groupon': 'https://logo.clearbit.com/groupon.com',
    'kohls': 'https://logo.clearbit.com/kohls.com',
    'macys': 'https://logo.clearbit.com/macys.com',
    'nordstrom': 'https://logo.clearbit.com/nordstrom.com',
    'jcpenney': 'https://logo.clearbit.com/jcpenney.com',
    'homedepot': 'https://logo.clearbit.com/homedepot.com',
    'home-depot': 'https://logo.clearbit.com/homedepot.com',
    'lowes': 'https://logo.clearbit.com/lowes.com',
    'ikea': 'https://logo.clearbit.com/ikea.com',
    'zappos': 'https://logo.clearbit.com/zappos.com',
    'chewy': 'https://logo.clearbit.com/chewy.com',
    'temu': 'https://logo.clearbit.com/temu.com',
    'shein': 'https://logo.clearbit.com/shein.com',
    'meesho': 'https://logo.clearbit.com/meesho.com',
    'myntra': 'https://logo.clearbit.com/myntra.com',
    'ajio': 'https://logo.clearbit.com/ajio.com',
    'nykaa': 'https://logo.clearbit.com/nykaa.com',
    'snapdeal': 'https://logo.clearbit.com/snapdeal.com',
    'bigbasket': 'https://logo.clearbit.com/bigbasket.com',

    // Fashion
    'nike': 'https://logo.clearbit.com/nike.com',
    'adidas': 'https://logo.clearbit.com/adidas.com',
    'puma': 'https://logo.clearbit.com/puma.com',
    'reebok': 'https://logo.clearbit.com/reebok.com',
    'zara': 'https://logo.clearbit.com/zara.com',
    'hm': 'https://logo.clearbit.com/hm.com',
    'h-m': 'https://logo.clearbit.com/hm.com',
    'h&m': 'https://logo.clearbit.com/hm.com',
    'uniqlo': 'https://logo.clearbit.com/uniqlo.com',
    'gap': 'https://logo.clearbit.com/gap.com',
    'forever21': 'https://logo.clearbit.com/forever21.com',
    'forever-21': 'https://logo.clearbit.com/forever21.com',
    'levis': 'https://logo.clearbit.com/levi.com',
    'gucci': 'https://logo.clearbit.com/gucci.com',
    'lululemon': 'https://logo.clearbit.com/lululemon.com',
    'underarmour': 'https://logo.clearbit.com/underarmour.com',
    'under-armour': 'https://logo.clearbit.com/underarmour.com',
    'asos': 'https://logo.clearbit.com/asos.com',
    'sephora': 'https://logo.clearbit.com/sephora.com',
    'bath-body-works': 'https://logo.clearbit.com/bathandbodyworks.com',
    'bath-&-body-works': 'https://logo.clearbit.com/bathandbodyworks.com',
    'victorias-secret': 'https://logo.clearbit.com/victoriassecret.com',
    'old-navy': 'https://logo.clearbit.com/oldnavy.com',
    'express': 'https://logo.clearbit.com/express.com',
    'american-eagle': 'https://logo.clearbit.com/ae.com',
    'hollister': 'https://logo.clearbit.com/hollisterco.com',
    'abercrombie': 'https://logo.clearbit.com/abercrombie.com',
    'ralph-lauren': 'https://logo.clearbit.com/ralphlauren.com',
    'coach': 'https://logo.clearbit.com/coach.com',
    'michael-kors': 'https://logo.clearbit.com/michaelkors.com',
    'tommy-hilfiger': 'https://logo.clearbit.com/tommy.com',
    'calvin-klein': 'https://logo.clearbit.com/calvinklein.com',

    // Streaming
    'netflix': 'https://logo.clearbit.com/netflix.com',
    'disney-plus': 'https://logo.clearbit.com/disneyplus.com',
    'disneyplus': 'https://logo.clearbit.com/disneyplus.com',
    'hulu': 'https://logo.clearbit.com/hulu.com',
    'spotify': 'https://logo.clearbit.com/spotify.com',
    'apple-tv': 'https://logo.clearbit.com/apple.com',
    'hbo-max': 'https://logo.clearbit.com/hbomax.com',
    'youtube': 'https://logo.clearbit.com/youtube.com',
    'amazon-prime': 'https://logo.clearbit.com/primevideo.com',
    'paramount': 'https://logo.clearbit.com/paramountplus.com',
    'peacock': 'https://logo.clearbit.com/peacocktv.com',
    'crunchyroll': 'https://logo.clearbit.com/crunchyroll.com',
    'hotstar': 'https://logo.clearbit.com/hotstar.com',
    'zee5': 'https://logo.clearbit.com/zee5.com',
    'sonyliv': 'https://logo.clearbit.com/sonyliv.com',
    'jiocinema': 'https://logo.clearbit.com/jiocinema.com',

    // Food & Delivery
    'doordash': 'https://logo.clearbit.com/doordash.com',
    'ubereats': 'https://logo.clearbit.com/ubereats.com',
    'uber-eats': 'https://logo.clearbit.com/ubereats.com',
    'grubhub': 'https://logo.clearbit.com/grubhub.com',
    'postmates': 'https://logo.clearbit.com/postmates.com',
    'instacart': 'https://logo.clearbit.com/instacart.com',
    'dominos': 'https://logo.clearbit.com/dominos.com',
    'pizza-hut': 'https://logo.clearbit.com/pizzahut.com',
    'mcdonalds': 'https://logo.clearbit.com/mcdonalds.com',
    'subway': 'https://logo.clearbit.com/subway.com',
    'starbucks': 'https://logo.clearbit.com/starbucks.com',
    'chipotle': 'https://logo.clearbit.com/chipotle.com',
    'wendys': 'https://logo.clearbit.com/wendys.com',
    'burgerking': 'https://logo.clearbit.com/burgerking.com',
    'burger-king': 'https://logo.clearbit.com/burgerking.com',
    'kfc': 'https://logo.clearbit.com/kfc.com',
    'papajohns': 'https://logo.clearbit.com/papajohns.com',
    'papa-johns': 'https://logo.clearbit.com/papajohns.com',
    'swiggy': 'https://logo.clearbit.com/swiggy.com',
    'zomato': 'https://logo.clearbit.com/zomato.com',
    'blinkit': 'https://logo.clearbit.com/blinkit.com',

    // Travel
    'booking': 'https://logo.clearbit.com/booking.com',
    'booking-com': 'https://logo.clearbit.com/booking.com',
    'expedia': 'https://logo.clearbit.com/expedia.com',
    'airbnb': 'https://logo.clearbit.com/airbnb.com',
    'hotels': 'https://logo.clearbit.com/hotels.com',
    'hotels-com': 'https://logo.clearbit.com/hotels.com',
    'trivago': 'https://logo.clearbit.com/trivago.com',
    'kayak': 'https://logo.clearbit.com/kayak.com',
    'priceline': 'https://logo.clearbit.com/priceline.com',
    'tripadvisor': 'https://logo.clearbit.com/tripadvisor.com',
    'southwest': 'https://logo.clearbit.com/southwest.com',
    'delta': 'https://logo.clearbit.com/delta.com',
    'united': 'https://logo.clearbit.com/united.com',
    'american-airlines': 'https://logo.clearbit.com/aa.com',
    'spirit': 'https://logo.clearbit.com/spirit.com',
    'frontier': 'https://logo.clearbit.com/flyfrontier.com',
    'hertz': 'https://logo.clearbit.com/hertz.com',
    'enterprise': 'https://logo.clearbit.com/enterprise.com',
    'yatra': 'https://logo.clearbit.com/yatra.com',
    'makemytrip': 'https://logo.clearbit.com/makemytrip.com',
    'goibibo': 'https://logo.clearbit.com/goibibo.com',
    'cleartrip': 'https://logo.clearbit.com/cleartrip.com',
    'ixigo': 'https://logo.clearbit.com/ixigo.com',
    'oyo': 'https://logo.clearbit.com/oyorooms.com',
    'redbus': 'https://logo.clearbit.com/redbus.in',

    // Other
    'apple': 'https://logo.clearbit.com/apple.com',
    'samsung': 'https://logo.clearbit.com/samsung.com',
    'microsoft': 'https://logo.clearbit.com/microsoft.com',
    'google': 'https://logo.clearbit.com/google.com',
    'dell': 'https://logo.clearbit.com/dell.com',
    'hp': 'https://logo.clearbit.com/hp.com',
    'lenovo': 'https://logo.clearbit.com/lenovo.com',
    'sony': 'https://logo.clearbit.com/sony.com',
    'lg': 'https://logo.clearbit.com/lg.com',
    'philips': 'https://logo.clearbit.com/philips.com',
    'dyson': 'https://logo.clearbit.com/dyson.com',
    'gopro': 'https://logo.clearbit.com/gopro.com',
    'fitbit': 'https://logo.clearbit.com/fitbit.com',
    'garmin': 'https://logo.clearbit.com/garmin.com',
    'bose': 'https://logo.clearbit.com/bose.com',
    'jbl': 'https://logo.clearbit.com/jbl.com',
    'uber': 'https://logo.clearbit.com/uber.com',
    'lyft': 'https://logo.clearbit.com/lyft.com',
    'grammarly': 'https://logo.clearbit.com/grammarly.com',
    'canva': 'https://logo.clearbit.com/canva.com',
    'notion': 'https://logo.clearbit.com/notion.so',
    'slack': 'https://logo.clearbit.com/slack.com',
    'zoom': 'https://logo.clearbit.com/zoom.us',
    'dropbox': 'https://logo.clearbit.com/dropbox.com',
    'nordvpn': 'https://logo.clearbit.com/nordvpn.com',
    'expressvpn': 'https://logo.clearbit.com/expressvpn.com',
    'surfshark': 'https://logo.clearbit.com/surfshark.com',
    'godaddy': 'https://logo.clearbit.com/godaddy.com',
    'bluehost': 'https://logo.clearbit.com/bluehost.com',
    'hostinger': 'https://logo.clearbit.com/hostinger.com',
    'namecheap': 'https://logo.clearbit.com/namecheap.com',
    'skillshare': 'https://logo.clearbit.com/skillshare.com',
    'udemy': 'https://logo.clearbit.com/udemy.com',
    'coursera': 'https://logo.clearbit.com/coursera.org',
    'duolingo': 'https://logo.clearbit.com/duolingo.com',
    'kmart': 'https://logo.clearbit.com/kmart.com',
    'box8': 'https://logo.clearbit.com/box8.in',
    'blissim': 'https://logo.clearbit.com/blissim.fr',
    'bedworks': 'https://logo.clearbit.com/bedworks.com.au',
    'bannerbuddy': 'https://logo.clearbit.com/bannerbuddy.com',
    'bannerbuzz': 'https://logo.clearbit.com/bannerbuzz.com',
    'alltricks': 'https://logo.clearbit.com/alltricks.com',
    'allbirds': 'https://logo.clearbit.com/allbirds.com',
};

// Extract likely domain from slug
// Slugs are like "yatracom", "kmartcom", "box8in", "bannerbuzzcouk", "bedworkscomau"
function extractDomain(slug: string): string {
    // Common TLD patterns to detect in slug
    const tldPatterns = [
        { suffix: 'comau', domain: '.com.au' },
        { suffix: 'couk', domain: '.co.uk' },
        { suffix: 'coid', domain: '.co.id' },
        { suffix: 'coin', domain: '.co.in' },
        { suffix: 'com', domain: '.com' },
        { suffix: 'in', domain: '.in' },
        { suffix: 'fr', domain: '.fr' },
        { suffix: 'de', domain: '.de' },
        { suffix: 'co', domain: '.co' },
    ];

    const lowerSlug = slug.toLowerCase();

    for (const { suffix, domain } of tldPatterns) {
        if (lowerSlug.endsWith(suffix)) {
            const name = lowerSlug.slice(0, lowerSlug.length - suffix.length);
            if (name.length > 0) {
                return `${name}${domain}`;
            }
        }
    }

    // Fallback: assume .com
    return `${lowerSlug}.com`;
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const platforms = await Platform.find({});
        const updates: { name: string; slug: string; oldLogo: string; newLogo: string; domain: string }[] = [];

        for (const platform of platforms) {
            const currentLogo = platform.logo || '';
            const domain = extractDomain(platform.slug);
            const newLogo = `https://logo.clearbit.com/${domain}`;

            if (newLogo !== currentLogo) {
                await Platform.findByIdAndUpdate(platform._id, { logo: newLogo });
                updates.push({
                    name: platform.name,
                    slug: platform.slug,
                    oldLogo: currentLogo,
                    newLogo: newLogo,
                    domain: domain,
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Updated logos for ${updates.length} platforms`,
            totalPlatforms: platforms.length,
            updates,
        });
    } catch (error: any) {
        console.error('Fix logos error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
