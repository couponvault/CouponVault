export default function JSONLD() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CouponVault",
        "url": "https://coupon-vault.vercel.app",
        "logo": "https://coupon-vault.vercel.app/logo.png",
        "description": "Premium verified coupon codes for top Indian e-commerce platforms like Amazon, Flipkart, Myntra, and more.",
        "sameAs": [
            "https://twitter.com/couponvault",
            "https://facebook.com/couponvault"
        ],
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://coupon-vault.vercel.app/platforms?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
