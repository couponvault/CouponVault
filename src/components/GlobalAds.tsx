'use client';

import Script from 'next/script';

/**
 * GlobalAds component to handle Adsterra Popunder and Social Bar.
 * These scripts are loaded site-wide for maximum revenue.
 */
export default function GlobalAds() {
    return (
        <>
            {/* Adsterra Popunder */}
            <Script
                id="adsterra-popunder"
                src="https://pl28590543.effectivegatecpm.com/4d/ce/4b/4dce4bd544260aab7320b25dddde9182.js"
                strategy="afterInteractive"
            />

            {/* Adsterra Social Bar */}
            <Script
                id="adsterra-social-bar"
                src="https://pl28590535.effectivegatecpm.com/fa/65/f0/fa65f07cac3bbace801034e6daa63033.js"
                strategy="lazyOnload"
            />
        </>
    );
}
