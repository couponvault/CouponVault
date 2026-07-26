'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { FiZap, FiCheck, FiCopy, FiStar, FiArrowRight, FiShield, FiTrendingUp, FiGift, FiGrid } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';

export const dynamic = 'force-dynamic';

export default function HomePage() {


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
        { name: 'AMAZON', bg: '#fff', text: '#ff9900', discount: '25%', code: 'AMZN25' },
        { name: 'SEPHORA', bg: '#000', text: '#fff', discount: '25%', code: 'BEAUTY25' },
        { name: 'ADIDAS', bg: '#000', text: '#fff', discount: '25%', code: 'ADIFALL' },
        { name: 'DELL', bg: '#0076ce', text: '#fff', discount: '25%', code: 'DELLSAVE' },
        { name: 'SAMSUNG', bg: '#1428a0', text: '#fff', discount: '15%', code: 'GALAXY15' },
        { name: 'TARGET', bg: '#cc0000', text: '#fff', discount: '20%', code: 'TGT20' },
        { name: 'UBER', bg: '#000', text: '#fff', discount: '50%', code: 'UBER50' },
        { name: 'DOMINOS', bg: '#006491', text: '#fff', discount: '30%', code: 'PIZZA30' },
        { name: 'STEAM', bg: '#171a21', text: '#fff', discount: '10%', code: 'GAMER10' },
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
                {/* Unified Hero Section */}
                <section className="relative w-full overflow-hidden text-center py-16 px-4">
                    {/* Abstract Floating Elements (Hidden on mobile) */}
                    <div className="hidden lg:block absolute inset-0 pointer-events-none">
                        {/* Top Left Glassmorphic Circle */}
                        <motion.div 
                            initial={{ y: 0 }}
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 left-[10%] w-24 h-24 bg-gradient-to-br from-[#2563EB]/20 to-transparent border border-[#2563EB]/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                        >
                            <span className="text-3xl font-bold text-[#2563EB]/50">%</span>
                        </motion.div>

                        {/* Bottom Left Emerald Glow */}
                        <motion.div 
                            initial={{ y: 0, opacity: 0.5 }}
                            animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-10 left-[5%] w-40 h-40 bg-[#10B981]/10 rounded-full blur-[60px]"
                        />

                        {/* Top Right Blue Glow */}
                        <motion.div 
                            initial={{ y: 0, opacity: 0.3 }}
                            animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute top-0 right-[5%] w-56 h-56 bg-[#2563EB]/10 rounded-full blur-[80px]"
                        />

                        {/* Bottom Right Glassmorphic Pill */}
                        <motion.div 
                            initial={{ y: 0 }}
                            animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute bottom-20 right-[12%] px-6 py-3 bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        >
                            <span className="text-xl">✨</span>
                            <span className="ml-2 text-sm font-bold text-[#10B981]/70 tracking-widest">PROMO</span>
                        </motion.div>
                    </div>

                    <div className="max-w-5xl mx-auto relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display tracking-tight leading-tight">
                            Verified Coupons & Deals That Actually Work
                        </h1>
                    
                    <p className="text-[#94A3B8] text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                        Save money with verified coupon codes, promo offers, cashback deals, and exclusive discounts from hundreds of trusted brands. Updated daily to ensure every deal is fresh and reliable.
                    </p>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-[#151922] border border-[#2563EB]/20 rounded-full shadow-sm">
                            <FiCheck className="w-4 h-4 text-[#10B981]" />
                            <span className="text-[#94A3B8] text-sm font-medium">15,000+ Verified Coupons</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-[#151922] border border-[#2563EB]/20 rounded-full shadow-sm">
                            <span className="text-[#10B981] text-sm">🏪</span>
                            <span className="text-[#94A3B8] text-sm font-medium">500+ Trusted Stores</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-[#151922] border border-[#2563EB]/20 rounded-full shadow-sm">
                            <span className="text-[#10B981] text-sm">🔄</span>
                            <span className="text-[#94A3B8] text-sm font-medium">Updated Daily</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-[#151922] border border-[#2563EB]/20 rounded-full shadow-sm">
                            <span className="text-[#10B981] text-sm">🆓</span>
                            <span className="text-[#94A3B8] text-sm font-medium">100% Free to Use</span>
                        </div>
                    </div>

                    {/* Search Bar + Trending */}
                    <SearchBar />

                    {/* CTA Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <Link
                            href="/random"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#2563EB]/25 flex items-center justify-center space-x-2 text-lg"
                        >
                            <span>🔍</span>
                            <span>Find Coupons</span>
                        </Link>
                        <Link
                            href="/platforms"
                            className="w-full sm:w-auto px-8 py-4 bg-[#151922] border border-[#2A3445] hover:border-[#2563EB] text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 text-lg"
                        >
                            <span>🏪</span>
                            <span>Browse Stores</span>
                        </Link>
                    </div>
                    
                    <p className="text-[#94A3B8] text-sm">
                        Trusted by thousands of shoppers looking for verified deals every day.
                    </p>
                    </div>
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
                <section className="w-full px-4 md:px-8 py-12">
                    <h2 className="text-2xl font-bold text-white mb-8 font-display">Featured Deals & Codes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
            </main>

            <Footer />
        </div>
    );
}
