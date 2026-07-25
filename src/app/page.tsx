'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiZap, FiCheck, FiCopy, FiStar, FiArrowRight, FiShield, FiTrendingUp, FiGift, FiGrid } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';

export const dynamic = 'force-dynamic';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');

    const stores = [
        { name: 'Nike', slug: 'nike', logo: '✓', bg: '#000', text: '#fff' },
        { name: 'Adidas', slug: 'adidas', logo: 'A', bg: '#000', text: '#fff' },
        { name: 'Amazon', slug: 'amazon', logo: 'a', bg: '#fff', text: '#ff9900' },
        { name: 'Samsung', slug: 'samsung', logo: 'S', bg: '#1428a0', text: '#fff' },
        { name: 'Sephora', slug: 'sephora', logo: 'S', bg: '#000', text: '#fff' },
        { name: 'Target', slug: 'target', logo: '◎', bg: '#cc0000', text: '#fff' },
    ];

    const deals = [
        { name: 'NIKE', bg: '#000', text: '#fff', discount: '25%', code: 'SAVE2SNOW' },
        { name: 'AMAZON', bg: '#fff', text: '#ff9900', discount: '25%', code: 'SAVE2SNOW' },
        { name: 'SEPHORA', bg: '#000', text: '#fff', discount: '25%', code: 'SAVE2SNOW' },
        { name: 'ADIDAS', bg: '#000', text: '#fff', discount: '25%', code: 'SAVE2SNOW' },
        { name: 'DELL', bg: '#0076ce', text: '#fff', discount: '25%', code: 'SAVE2SNOW' },
        { name: 'SAMSUNG', bg: '#1428a0', text: '#fff', discount: '15%', code: 'SAVE2SNOW' },
    ];

    const handleCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success('Code copied!');
        } catch {
            toast.error('Failed to copy');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0b0f]">
            <Navbar />

            <main className="flex-1">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
                    <div className="relative group">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full opacity-60 group-hover:opacity-80 transition duration-300"></div>
                        <div className="relative flex items-center bg-[#12131a] rounded-full">
                            <input
                                type="text"
                                placeholder="Search for brands, deals, codes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-white text-sm px-6 py-3.5 outline-none placeholder-gray-500"
                            />
                            <button className="pr-5 text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hero */}
                <section className="text-center py-12 px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display tracking-tight">
                        Save Smarter. Live Better.
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                        Access thousands of verified coupons and promo codes
                        <br className="hidden sm:block" />
                        for your favorite brands instantly.
                    </p>
                    <Link
                        href="/random"
                        className="inline-flex items-center space-x-2 px-7 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-full hover:from-teal-500 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-teal-500/20"
                    >
                        <FiZap className="w-4 h-4 text-yellow-300" />
                        <span>Start Saving</span>
                    </Link>
                </section>

                {/* Top Featured Stores */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-white mb-8 font-display">Top Featured Stores</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {stores.map((store, i) => (
                            <Link key={i} href={`/platforms/${store.slug}`} className="flex flex-col items-center bg-[#12131a] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-lg cursor-pointer">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl"
                                    style={{ backgroundColor: store.bg, color: store.text }}
                                >
                                    {store.logo}
                                </div>
                                <span className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-semibold text-cyan-400 whitespace-nowrap">
                                    Up to 50% Off
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-4 py-6">
                    <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" />
                </div>

                {/* Featured Deals & Codes */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-white mb-8 font-display">Featured Deals & Codes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {deals.map((deal, i) => (
                            <div key={i} className="bg-[#12131a] border border-white/5 rounded-2xl p-6 flex flex-col hover:border-cyan-500/20 transition-all hover:-translate-y-1 shadow-lg">
                                {/* Header: Logo + Name + Active Badge */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-md"
                                            style={{ backgroundColor: deal.bg, color: deal.text }}
                                        >
                                            {deal.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-white text-base tracking-wider">
                                            {deal.name}
                                        </span>
                                    </div>
                                    <span className="px-4 py-1.5 bg-cyan-500/15 border border-cyan-500/25 rounded-full text-xs font-bold text-cyan-400">
                                        Active
                                    </span>
                                </div>

                                {/* Discount */}
                                <h3 className="text-xl font-bold text-white mb-4 leading-snug">
                                    {deal.discount} OFF Your Entire Purchase
                                </h3>

                                {/* Verified + Code */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <FiCheck className="text-cyan-400 w-4 h-4" />
                                        <span className="text-cyan-400 font-medium">Verified</span>
                                        <span className="text-gray-500 mx-1">•</span>
                                        <span className="text-gray-400">Code: <span className="text-white font-mono font-bold text-base bg-white/5 px-2 py-0.5 rounded">{deal.code}</span></span>
                                    </div>
                                    <button onClick={() => handleCopy(deal.code)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
                                        <FiCopy className="w-4 h-4 text-gray-400 hover:text-white" />
                                    </button>
                                </div>

                                {/* Expiry + Copy */}
                                <div className="flex items-center text-sm text-gray-500 mb-5">
                                    <span>Exp: Oct 31</span>
                                    <span className="mx-2">•</span>
                                    <button onClick={() => handleCopy(deal.code)} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-medium">Copy Code</button>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                                    <span>User Rating</span>
                                    <div className="flex items-center space-x-1.5">
                                        <span className="font-bold text-white text-base">4.9</span>
                                        <FiStar className="text-yellow-500 w-4 h-4 fill-current" />
                                    </div>
                                </div>

                                {/* Get Code Button */}
                                <Link
                                    href="/random"
                                    className="block text-center w-full py-3.5 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-purple-500/25"
                                >
                                    Get Code
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-4 mb-16">
                    <AdBanner />
                </div>

                {/* Why Choose CouponVault */}
                <section className="bg-[#12131a] border-t border-b border-white/5 py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4 font-display">Why Choose CouponVault?</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">We make saving money effortless with verified deals and instant access to the best discounts online.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: FiZap, title: 'Instant Coupons', desc: 'Get valid coupon codes instantly with just one click' },
                                { icon: FiShield, title: '100% Verified', desc: 'All coupons are automatically verified and tested' },
                                { icon: FiTrendingUp, title: 'Daily Updates', desc: 'Fresh coupons added daily for maximum savings' },
                                { icon: FiGift, title: 'Top Brands', desc: 'Exclusive deals from Amazon, Flipkart, Netflix & more' },
                            ].map((feature, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-6 bg-[#0a0b0f] rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
                                        <feature.icon className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Actions */}
                <section className="py-20 px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">
                        Ready to Start <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Saving?</span>
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">
                        Join thousands of savvy shoppers who save money every day. Explore top stores or get a random verified code instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/random"
                            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2"
                        >
                            <FiGift className="w-5 h-5" />
                            <span>Get Random Coupon</span>
                        </Link>
                        <Link
                            href="/platforms"
                            className="w-full sm:w-auto px-8 py-3.5 bg-[#12131a] border border-white/5 hover:border-cyan-500/30 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
                        >
                            <FiGrid className="w-5 h-5 text-cyan-400" />
                            <span>Browse Platforms</span>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
