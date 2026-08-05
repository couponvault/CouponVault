export default function JSONLD() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "CouponVault",
                "alternateName": "Coupon Vault",
                "url": "https://couponvault.in",
                "logo": "https://couponvault.in/logo.png",
                "description": "CouponVault is a leading premium coupon website providing verified discount codes, promo codes, and deals for top e-commerce platforms like Amazon, Walmart, and Target.",
                "sameAs": [
                    "https://twitter.com/couponvault",
                    "https://facebook.com/couponvault"
                ]
            },
            {
                "@type": "WebSite",
                "url": "https://couponvault.in",
                "name": "CouponVault",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://couponvault.in/platforms?search={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
