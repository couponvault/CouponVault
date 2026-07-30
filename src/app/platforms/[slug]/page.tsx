import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import Platform from '@/models/Platform';
import Coupon from '@/models/Coupon';
import StoreClientView from './StoreClientView';

// Force dynamic because we want to fetch the latest coupons on request
export const dynamic = 'force-dynamic';

interface PageProps {
    params: { slug: string };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    await connectDB();
    
    const platform = await Platform.findOne({ slug: params.slug, isActive: true }).lean() as any;
    
    if (!platform) {
        return {
            title: 'Platform Not Found | CouponVault'
        };
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    const title = `${platform.name} Promo Codes & Coupons ${currentMonth} ${currentYear} | Save up to 50%`;
    const description = `Get the latest verified ${platform.name} promo codes, discount codes, and deals for ${currentMonth} ${currentYear}. Stop paying full price at ${platform.name} with CouponVault.`;

    return {
        title,
        description,
        keywords: `${platform.name} coupons, ${platform.name} promo codes, ${platform.name} discount codes, ${platform.name} deals ${currentYear}`,
        openGraph: {
            title,
            description,
            type: 'website',
            images: [
                {
                    url: platform.logo || '/og-image.png',
                    width: 800,
                    height: 600,
                    alt: `${platform.name} Coupons`,
                }
            ],
        }
    };
}

export default async function PlatformDetailsPage({ params }: PageProps) {
    await connectDB();

    const platform = await Platform.findOne({ slug: params.slug, isActive: true }).lean() as any;

    if (!platform) {
        return <StoreClientView platform={null} coupons={[]} />;
    }

    const coupons = await Coupon.find({
        platform: platform._id,
        isActive: true,
        isExpired: false
    })
    .populate('platform', 'name logo slug backgroundColor textColor')
    .sort({ createdAt: -1 })
    .lean() as any[];

    // Ensure we serialize ObjectIds to strings so they can be passed to the Client Component safely
    const serializedPlatform = JSON.parse(JSON.stringify(platform));
    const serializedCoupons = JSON.parse(JSON.stringify(coupons));

    // Generate JSON-LD Structured Data
    const storeSchema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": platform.name,
        "image": platform.logo,
        "description": platform.description || `Verified ${platform.name} coupons and promo codes.`
    };

    const offersSchema = coupons.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": coupons.map((c, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Offer",
                "name": c.description || `${c.discountValue}${c.discountType === 'percentage' ? '%' : '$'} OFF at ${platform.name}`,
                "availability": "https://schema.org/InStock",
                "validThrough": c.expiresAt ? new Date(c.expiresAt).toISOString() : undefined
            }
        }))
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
            />
            {offersSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
                />
            )}
            <StoreClientView platform={serializedPlatform} coupons={serializedCoupons} />
        </>
    );
}
