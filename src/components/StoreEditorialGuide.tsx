'use client';

import React from 'react';
import { FiCheckCircle, FiInfo, FiTruck, FiRefreshCcw, FiShield } from 'react-icons/fi';
import Link from 'next/link';

interface StoreEditorialGuideProps {
    platform: any;
}

export default function StoreEditorialGuide({ platform }: StoreEditorialGuideProps) {
    if (!platform) return null;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    // Generate dynamic category-specific tips
    const getCategoryTips = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'ecommerce':
            case 'electronics':
                return [
                    "Wait for major sales holidays like Black Friday, Cyber Monday, and Prime Day for the deepest discounts on high-ticket items.",
                    "Always check if price matching is available before completing your purchase.",
                    "Look for open-box or refurbished sections for significant savings on practically new items."
                ];
            case 'fashion':
            case 'clothing':
                return [
                    "End-of-season clearance events (January and August) typically offer up to 70% off retail prices.",
                    "Sign up for the loyalty program to get free shipping and early access to drops.",
                    "Check the sizing chart carefully to avoid return shipping fees."
                ];
            case 'food':
            case 'delivery':
                return [
                    "Stack restaurant-specific promotions with our platform-wide discount codes for maximum savings.",
                    "Consider picking up your order to completely eliminate delivery and service fees.",
                    "Check if your credit card offers complimentary premium subscriptions (like DashPass or Uber One)."
                ];
            case 'travel':
                return [
                    "Book flights and hotels mid-week (Tuesday or Wednesday) when dynamic pricing algorithms generally offer lower rates.",
                    "Use our promo codes on top of package deals (flight + hotel) for compounding discounts.",
                    "Always clear your browser cookies or use Incognito mode when searching for travel deals multiple times."
                ];
            default:
                return [
                    "Always apply the promo code in your cart before proceeding to the final checkout step.",
                    "Subscribe to our newsletter to get alerted immediately when a high-value code drops.",
                    "Combine these discount codes with cash-back browser extensions for double savings."
                ];
        }
    };

    const tips = getCategoryTips(platform.category);

    return (
        <div className="mt-16 space-y-10 border-t border-appleBorder pt-12">
            {/* Overview Section */}
            <section className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-extrabold prose-headings:text-appleText prose-p:text-appleMuted">
                <h2>The Ultimate Guide to Shopping at {platform.name} in {currentYear}</h2>
                <p>
                    Finding valid <strong>{platform.name} coupons</strong> shouldn't be a frustrating experience. 
                    At CouponVault, our editorial team manually verifies every single discount code, promo code, and deal listed on this page. 
                    We know how disappointing it is to reach checkout only to find a code has expired. That's why we update this 
                    {platform.name} savings guide daily to ensure you're getting the absolute best price possible in {currentMonth} {currentYear}.
                </p>
                <p>
                    {platform.description || `${platform.name} is one of the premier destinations in the ${platform.category || 'retail'} space. Whether you're a first-time buyer or a loyal returning customer, applying the right promotional code can significantly reduce your final cart total.`}
                </p>
            </section>

            {/* Shopping Hacks */}
            <section className="bg-appleCard rounded-[2rem] p-8 md:p-10 border border-appleBorder/50">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-blue-50 text-appleBlue rounded-xl">
                        <FiInfo className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-appleText font-display m-0">Expert Shopping Hacks</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex flex-col space-y-3">
                            <div className="w-8 h-8 rounded-full bg-appleBlue/10 flex items-center justify-center text-appleBlue font-bold text-sm shrink-0">
                                {index + 1}
                            </div>
                            <p className="text-sm text-appleMuted leading-relaxed">{tip}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How to use */}
            <section className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-extrabold prose-headings:text-appleText prose-p:text-appleMuted">
                <h3>How to Redeem Your {platform.name} Promo Code</h3>
                <ol>
                    <li>Click the <strong>&quot;Get Code&quot;</strong> button on any verified offer above. A new tab will automatically open taking you directly to {platform.name}.</li>
                    <li>Add your desired items to your shopping cart and proceed to the checkout page.</li>
                    <li>Look for a text field labeled <em>&quot;Promo Code&quot;</em>, <em>&quot;Discount Code&quot;</em>, or <em>&quot;Gift Card&quot;</em>.</li>
                    <li>Paste the code exactly as it appears (our codes are case-sensitive) and click &quot;Apply&quot;.</li>
                    <li>Verify that your total order value has decreased before finalizing your payment.</li>
                </ol>
            </section>

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white rounded-2xl p-6 border border-appleBorder/50 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <FiTruck className="w-5 h-5 text-appleText" />
                        <h4 className="text-lg font-bold text-appleText">Shipping Policy</h4>
                    </div>
                    <p className="text-sm text-appleMuted leading-relaxed">
                        While shipping policies vary, many retailers offer free standard shipping once your order exceeds a certain threshold. Check our active coupon list above to see if we have a dedicated &quot;Free Shipping&quot; code for {platform.name}.
                    </p>
                </section>
                
                <section className="bg-white rounded-2xl p-6 border border-appleBorder/50 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <FiRefreshCcw className="w-5 h-5 text-appleText" />
                        <h4 className="text-lg font-bold text-appleText">Return Policy</h4>
                    </div>
                    <p className="text-sm text-appleMuted leading-relaxed">
                        Generally, you have a standard 30-day window to return items. Ensure you keep your receipt and original packaging. Note that using a high-value discount code rarely affects your ability to return an item.
                    </p>
                </section>
            </div>

            {/* Trust Signal Footer */}
            <section className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-green-50 rounded-2xl border border-green-100 mt-8">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="p-3 bg-green-100 text-green-700 rounded-full shrink-0">
                        <FiShield className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-900 text-sm">CouponVault Editorial Guarantee</h4>
                        <p className="text-xs text-green-800/80 mt-1">Our dedicated team manually tested these {platform.name} codes today.</p>
                    </div>
                </div>
                <Link href="/about" className="text-sm font-semibold text-green-700 hover:text-green-800 underline decoration-2 underline-offset-4">
                    Read our verification process
                </Link>
            </section>
        </div>
    );
}
