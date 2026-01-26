'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiGift, FiZap, FiShield, FiTrendingUp, FiArrowRight, FiStar, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 animate-fade-in">
                                <span className="gradient-text">Save Big</span> with
                                <br />
                                Exclusive Coupons
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
                                Discover thousands of verified coupon codes for your favorite platforms.
                                Save money on every purchase with CouponVault.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
                                <Link
                                    href="/random"
                                    className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-glow-lg transition-all duration-300 flex items-center space-x-2"
                                >
                                    <FiGift className="w-5 h-5" />
                                    <span>Get Random Coupon</span>
                                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/platforms"
                                    className="px-8 py-4 glass-card font-semibold rounded-xl hover:shadow-card-hover transition-all duration-300"
                                >
                                    Browse Platforms
                                </Link>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                            {[
                                { label: 'Active Coupons', value: stats.totalCoupons, suffix: '+' },
                                { label: 'Partner Platforms', value: stats.activePlatforms, suffix: '+' },
                                { label: 'Happy Users', value: stats.happyUsers, suffix: '+' },
                            ].map((stat, index) => (
                                <div key={index} className="glass-card p-6 rounded-xl text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                        {stat.value.toLocaleString()}{stat.suffix}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-dark-900">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                                Why Choose <span className="gradient-text">CouponVault</span>?
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                The smartest way to save money on your favorite platforms
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="group glass-card p-6 rounded-xl hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                                    >
                                        <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

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
