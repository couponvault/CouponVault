'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiZap, FiCheck, FiCopy, FiStar, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';

export const dynamic = 'force-dynamic';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');

    const stores = [
        { name: 'Nike', logo: '✓', bg: '#000', text: '#fff' },
        { name: 'Adidas', logo: 'A', bg: '#000', text: '#fff' },
        { name: 'Amazon', logo: 'a', bg: '#fff', text: '#ff9900' },
        { name: 'Samsung', logo: 'S', bg: '#1428a0', text: '#fff' },
        { name: 'Sephora', logo: 'S', bg: '#000', text: '#fff' },
        { name: 'Target', logo: '◎', bg: '#cc0000', text: '#fff' },
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
                <section className="max-w-4xl mx-auto px-4 py-10">
                    <h2 className="text-xl font-bold text-white mb-6 font-display">Top Featured Stores</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {stores.map((store, i) => (
                            <div key={i} className="flex flex-col items-center bg-[#12131a] border border-white/5 rounded-2xl p-4 hover:border-cyan-500/30 transition-colors cursor-pointer">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-md"
                                    style={{ backgroundColor: store.bg, color: store.text }}
                                >
                                    {store.logo}
                                </div>
                                <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[11px] font-semibold text-cyan-400 whitespace-nowrap">
                                    Up to 50% Off
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-4">
                    <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" />
                </div>

                {/* Featured Deals & Codes */}
                <section className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-xl font-bold text-white mb-6 font-display">Featured Deals & Codes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {deals.map((deal, i) => (
                            <div key={i} className="bg-[#12131a] border border-white/5 rounded-2xl p-5 flex flex-col hover:border-cyan-500/20 transition-colors">
                                {/* Header: Logo + Name + Active Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
                                            style={{ backgroundColor: deal.bg, color: deal.text }}
                                        >
                                            {deal.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-white text-sm tracking-wider">
                                            {deal.name}
                                        </span>
                                    </div>
                                    <span className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/25 rounded-full text-[11px] font-bold text-cyan-400">
                                        Active
                                    </span>
                                </div>

                                {/* Discount */}
                                <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                                    {deal.discount} OFF Your Entire Purchase
                                </h3>

                                {/* Verified + Code */}
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-1.5 text-sm">
                                        <FiCheck className="text-cyan-400 w-3.5 h-3.5" />
                                        <span className="text-cyan-400 font-medium text-xs">Verified</span>
                                        <span className="text-gray-500 mx-0.5">•</span>
                                        <span className="text-gray-400 text-xs">Code: <span className="text-white font-mono font-medium">{deal.code}</span></span>
                                    </div>
                                    <button onClick={() => handleCopy(deal.code)} className="p-1 hover:bg-white/5 rounded transition-colors">
                                        <FiCopy className="w-3.5 h-3.5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Expiry + Copy */}
                                <div className="flex items-center text-xs text-gray-500 mb-4">
                                    <span>Exp: Oct 31</span>
                                    <span className="mx-1.5">•</span>
                                    <button onClick={() => handleCopy(deal.code)} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-medium">Copy Code</button>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center justify-between mb-5 text-sm text-gray-500">
                                    <span>User Rating</span>
                                    <div className="flex items-center space-x-1">
                                        <span className="font-bold text-white">4.9</span>
                                        <FiStar className="text-yellow-500 w-3.5 h-3.5 fill-current" />
                                    </div>
                                </div>

                                {/* Get Code Button */}
                                <Link
                                    href="/random"
                                    className="block text-center w-full py-2.5 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    Get Code
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-4 mb-12">
                    <AdBanner />
                </div>
            </main>

            <Footer />
        </div>
    );
}
