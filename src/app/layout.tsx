import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import JSONLD from '@/components/JSONLD';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import GlobalAds from '@/components/GlobalAds';

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
    title: 'CouponVault | 100% Verified Promo Codes for Amazon, Walmart, Target',
    description: 'Find the best verified coupon codes and deals for top e-commerce platforms. Save money with our daily updated, automated promo codes.',
    keywords: 'coupon codes usa, amazon promo codes, walmart discount coupons, target fashion deals, verified coupons, online shopping discounts, promo codes 2026',
    authors: [{ name: 'CouponVault' }],
    verification: {
        google: 'AWhoJenbK6Y3oEL5fK5BXj4SnmwfoTLXB1NnUO6-414',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://couponvault.vercel.app'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'CouponVault | Stop Paying Full Price - Verified Coupons Inside',
        description: 'Join 50,000+ shoppers saving money every day with our verified coupon codes.',
        type: 'website',
        locale: 'en_US',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://couponvault.vercel.app',
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
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
                <JSONLD />
                <GlobalAds />
                {children}
                <Analytics />
                <SpeedInsights />
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
