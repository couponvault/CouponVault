'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiGift, FiZap, FiShield, FiTrendingUp, FiArrowRight, FiStar, FiClock, FiCheck, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';

export const dynamic = 'force-dynamic';

export default function HomePage() {
    const [stats, setStats] = useState({
        totalCoupons: 0,
        activePlatforms: 0,
        happyUsers: 0,
    });

    useEffect(() => {
        // Animate numbers
        const animateValue = (key: string, start: number, end: number, duration: number) => {
            let startTimestamp: number | null = null;
            const step = (timestamp: number) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                setStats(prev => ({
                    ...prev,
                    [key]: Math.floor(progress * (end - start) + start)
                }));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        animateValue('totalCoupons', 0, 5000, 2000);
        animateValue('activePlatforms', 0, 50, 1500);
        animateValue('happyUsers', 0, 10000, 2500);
    }, []);

    const features = [
        {
            icon: FiZap,
            title: 'Instant Coupons',
            description: 'Get valid coupon codes instantly with just one click',
            color: 'from-yellow-400 to-orange-500'
        },
        {
            icon: FiShield,
            title: '100% Verified',
            description: 'All coupons are automatically verified and tested',
            color: 'from-green-400 to-emerald-500'
        },
        {
            icon: FiTrendingUp,
            title: 'Daily Updates',
            description: 'Fresh coupons added daily for maximum savings',
            color: 'from-blue-400 to-cyan-500'
        },
        {
            icon: FiGift,
            title: 'Top Brands',
            description: 'Exclusive deals from Amazon, Flipkart, Netflix & more',
            color: 'from-purple-400 to-pink-500'
        },
    ];

    const platforms = [
        { name: 'Amazon', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20' },
        { name: 'Flipkart', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' },
        { name: 'Netflix', color: 'bg-red-100 text-red-600 dark:bg-red-900/20' },
        { name: 'Myntra', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20' },
        { name: 'Ajio', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' },
        { name: 'Swiggy', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
                    {/* Background Effects */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="max-w-5xl mx-auto flex flex-col items-center">
                        {/* Search Bar */}
                        <div className="w-full max-w-2xl mb-16 relative group animate-fade-in">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                            <div className="relative flex items-center bg-[#1a1c23] rounded-full p-1">
                                <input 
                                    type="text" 
                                    placeholder="Search for brands, deals, codes..." 
                                    className="w-full bg-transparent text-white px-6 py-3 outline-none placeholder-gray-500"
                                />
                                <button className="p-3 bg-transparent text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 text-white animate-fade-in tracking-tight">
                                Save Smarter. Live Better.
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto animate-slide-up">
                                Access thousands of verified coupons and promo codes for your favorite brands instantly.
                            </p>

                            <Link
                                href="/platforms"
                                className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-secondary-600 to-secondary-500 text-white font-semibold rounded-full hover:shadow-glow-lg transition-all duration-300 animate-scale-in"
                            >
                                <FiZap className="w-5 h-5 text-yellow-300" />
                                <span>Start Saving</span>
                            </Link>
                        </div>

                        {/* Top Featured Stores */}
                        <div className="w-full mt-24 text-left animate-slide-up">
                            <h2 className="text-2xl font-bold text-white mb-6">Top Featured Stores</h2>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { name: 'Nike', logo: 'N', bg: '#000000', text: '#ffffff' },
                                    { name: 'Adidas', logo: 'A', bg: '#000000', text: '#ffffff' },
                                    { name: 'Amazon', logo: 'a', bg: '#ffffff', text: '#ff9900' },
                                    { name: 'Samsung', logo: 'S', bg: '#1428a0', text: '#ffffff' },
                                    { name: 'Sephora', logo: 'S', bg: '#000000', text: '#ffffff' },
                                    { name: 'Target', logo: 'O', bg: '#cc0000', text: '#ffffff' },
                                ].map((store, index) => (
                                    <div key={index} className="flex-1 min-w-[120px] max-w-[160px] glass-card rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg" style={{ backgroundColor: store.bg, color: store.text }}>
                                            {store.logo}
                                        </div>
                                        <div className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full">
                                            <span className="text-xs font-bold text-primary-400 whitespace-nowrap">Up to 50% Off</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-10">
                    <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" />
                </div>

                {/* Featured Deals & Codes */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8">Featured Deals & Codes</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: 'Nike', bg: '#000000', text: '#ffffff' },
                                { name: 'Amazon', bg: '#ffffff', text: '#ff9900' },
                                { name: 'Sephora', bg: '#000000', text: '#ffffff' },
                                { name: 'Adidas', bg: '#000000', text: '#ffffff' },
                                { name: 'Dell', bg: '#0076ce', text: '#ffffff' },
                                { name: 'Samsung', bg: '#1428a0', text: '#ffffff' },
                            ].map((store, index) => (
                                <div key={index} className="glass-card bg-[#1a1c23] overflow-hidden p-5 flex flex-col group relative rounded-2xl hover:bg-[#20222b] transition-colors border-white/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner" style={{ backgroundColor: store.bg, color: store.text }}>
                                                {store.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-200 tracking-wide uppercase text-sm">
                                                {store.name}
                                            </span>
                                        </div>
                                        <div className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full">
                                            <span className="text-xs font-bold text-primary-400 tracking-wide">Active</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                        {index % 2 === 0 ? '25%' : '15%'} OFF Your Entire Purchase
                                    </h3>

                                    <div className="flex items-center justify-between mb-1 mt-2">
                                        <div className="flex items-center space-x-1.5 text-sm">
                                            <FiCheck className="text-primary-500 w-4 h-4" />
                                            <span className="text-primary-500 font-medium">Verified</span>
                                            <span className="text-gray-400 mx-1">•</span>
                                            <span className="text-gray-300">Code: <span className="font-mono text-white">SAVE{index % 2 === 0 ? '25' : '15'}NOW</span></span>
                                        </div>
                                        <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors">
                                            <FiCopy className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-sm text-gray-400 flex items-center space-x-2">
                                            <span>Exp: Oct 31</span>
                                            <span>•</span>
                                            <button className="text-primary-400 hover:text-primary-300 underline underline-offset-2">Copy Code</button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                                        <span>User Rating</span>
                                        <div className="flex items-center space-x-1">
                                            <span className="font-bold text-white">4.9</span>
                                            <FiStar className="text-yellow-500 w-4 h-4 fill-current" />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href="/random"
                                            className="block text-center w-full py-3 bg-gradient-to-r from-secondary-600 to-primary-500 text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                                        >
                                            Get Code
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 -mb-10">
                    <AdBanner />
                </div>

                {/* Platforms Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                                Popular <span className="gradient-text">Platforms</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Get exclusive coupons for these amazing platforms
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {platforms.map((platform, index) => (
                                <div
                                    key={index}
                                    className={`${platform.color} px-6 py-3 rounded-full font-semibold text-lg cursor-pointer hover:scale-105 transition-transform`}
                                >
                                    {platform.name}
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link
                                href="/platforms"
                                className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-semibold text-lg group"
                            >
                                <span>View All Platforms</span>
                                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
                            Ready to Start Saving?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of savvy shoppers who save money every day with CouponVault
                        </p>
                        <Link
                            href="/random"
                            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 group"
                        >
                            <FiGift className="w-5 h-5" />
                            <span>Get Your First Coupon Now</span>
                            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
