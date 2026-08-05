import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import JSONLD from '@/components/JSONLD';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import GlobalAds from '@/components/GlobalAds';
import CookieBanner from '@/components/CookieBanner';
import Script from 'next/script';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap'
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap'
});

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export const metadata: Metadata = {
    title: 'CouponVault (Coupon Vault) | The Best Coupon Website for Promo Codes',
    description: 'Welcome to Coupon Vault (CouponVault), the ultimate coupon website. Find the best verified coupon codes, discount codes, and promo deals for Amazon, Target, and Sephora.',
    keywords: 'coupon vault, couponvault, coupon codes usa, amazon promo codes, walmart discount coupons, target fashion deals, verified coupons, online shopping discounts, promo codes 2026',
    authors: [{ name: 'CouponVault' }],
    verification: {
        google: 'AWhoJenbK6Y3oEL5fK5BXj4SnmwfoTLXB1NnUO6-414',
    },
    icons: {
        icon: [
            { url: '/favicon.png', type: 'image/png', sizes: '48x48' },
            { url: '/favicon.png', type: 'image/png', sizes: '96x96' },
            { url: '/favicon.png', type: 'image/png', sizes: '144x144' },
            { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
            { url: '/favicon.png', type: 'image/png', sizes: '512x512' }
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180' }
        ],
        other: [
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/apple-touch-icon.png',
            },
        ],
    },
    metadataBase: new URL('https://couponvault.in'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Coupon Vault (CouponVault) | The Best Coupon Website for Promo Codes',
        description: 'Join 50,000+ shoppers saving money every day on our coupon website. Get the latest verified discount codes.',
        type: 'website',
        locale: 'en_US',
        url: 'https://couponvault.in',
        siteName: 'CouponVault',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'CouponVault - Verified Coupons'
            }
        ]
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
            </head>
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
                <JSONLD />
                <GlobalAds />
                {children}
                <Analytics />
                <SpeedInsights />
                <Toaster position="top-right" />
                <CookieBanner />
                <Script src="https://s.skimresources.com/js/306824X1795089.skimlinks.js" strategy="afterInteractive" />
            </body>
        </html>
    );
}
