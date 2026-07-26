'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import CouponModal from '@/components/CouponModal';
import { FiZap, FiCheck, FiCopy, FiStar, FiArrowRight, FiShield, FiTrendingUp, FiGift, FiGrid } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';

export const dynamic = 'force-dynamic';

export default function HomePage() {
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [platformsRes, couponsRes] = await Promise.all([
                    fetch('/api/platforms?active=true'),
                    fetch('/api/coupons')
                ]);
                
                const platformsData = await platformsRes.json();
                const couponsData = await couponsRes.json();
                
                if (platformsData.success) {
                    setPlatforms(platformsData.platforms.slice(0, 6)); // Top 6 for featured
                }
                
                if (couponsData.success) {
                    // Filter out any orphaned coupons that might have null platforms
                    setCoupons(couponsData.coupons.filter((c: any) => c.platform));
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = (coupon: any) => {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
    };

    const handleCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success('Code copied!');
        } catch {
            toast.error('Failed to copy');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-smokyBlack">
            <Navbar />

            <main className="flex-1">
                {/* Unified Hero Section */}
                <section className="relative w-full overflow-hidden text-center py-16 px-4">
                    {/* Floating Brand Logos (Solar System effect) */}
                    <div className="hidden xl:block absolute inset-0 pointer-events-none">
                        {/* Left Side Brands */}
                        {[
                            { name: 'A', bg: '#fff', text: '#ff9900', t: '10%', l: '8%', dur: 4, del: 0 },
                            { name: 'M', bg: '#fff', text: '#F13AB1', t: '35%', l: '3%', dur: 5, del: 1 },
                            { name: 'F', bg: '#0456c8', text: '#ffe11b', t: '60%', l: '12%', dur: 4.5, del: 2 },
                            { name: 'S', bg: '#fc8019', text: '#fff', t: '80%', l: '5%', dur: 5.5, del: 0.5 },
                            { name: 'N', bg: '#000', text: '#fff', t: '25%', l: '18%', dur: 6, del: 1.5 },
                        ].map((brand, i) => (
                            <motion.div 
                                key={`left-${i}`}
                                initial={{ y: 0 }}
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: brand.dur, repeat: Infinity, ease: "easeInOut", delay: brand.del }}
                                className="absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_10px_40px_rgba(37,99,235,0.15)] border border-[#2A3445] backdrop-blur-md"
                                style={{ top: brand.t, left: brand.l, backgroundColor: brand.bg, color: brand.text }}
                            >
                                {brand.name}
                            </motion.div>
                        ))}

                        {/* Right Side Brands */}
                        {[
                            { name: 'Z', bg: '#e23744', text: '#fff', t: '12%', r: '10%', dur: 5, del: 0.2 },
                            { name: 'N', bg: '#E80071', text: '#fff', t: '38%', r: '4%', dur: 4.5, del: 1.2 },
                            { name: 'S', bg: '#1428a0', text: '#fff', t: '65%', r: '14%', dur: 5.5, del: 2.5 },
                            { name: 'A', bg: '#000', text: '#fff', t: '85%', r: '6%', dur: 4, del: 0.8 },
                            { name: 'T', bg: '#cc0000', text: '#fff', t: '22%', r: '18%', dur: 6, del: 1.8 },
                        ].map((brand, i) => (
                            <motion.div 
                                key={`right-${i}`}
                                initial={{ y: 0 }}
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: brand.dur, repeat: Infinity, ease: "easeInOut", delay: brand.del }}
                                className="absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_10px_40px_rgba(16,185,129,0.15)] border border-[#2A3445] backdrop-blur-md"
                                style={{ top: brand.t, right: brand.r, backgroundColor: brand.bg, color: brand.text }}
                            >
                                {brand.name}
                            </motion.div>
                        ))}
                        
                        {/* Soft background glows to blend them */}
                        <div className="absolute top-1/4 left-0 w-64 h-64 bg-oliveDrab/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-bone/10 rounded-full blur-[100px]" />
                    </div>

                    <div className="max-w-5xl mx-auto relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold text-floralWhite mb-6 font-display tracking-tight leading-tight">
                            Verified Coupons & Deals That Actually Work
                        </h1>
                    
                    <p className="text-bone/70 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                        Save money with verified coupon codes, promo offers, cashback deals, and exclusive discounts from hundreds of trusted brands. Updated daily to ensure every deal is fresh and reliable.
                    </p>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-oliveDrab/10 border border-oliveDrab/30 rounded-full shadow-sm">
                            <FiCheck className="w-4 h-4 text-bone" />
                            <span className="text-bone/70 text-sm font-medium">15,000+ Verified Coupons</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-oliveDrab/10 border border-oliveDrab/30 rounded-full shadow-sm">
                            <span className="text-bone text-sm">🏪</span>
                            <span className="text-bone/70 text-sm font-medium">500+ Trusted Stores</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-oliveDrab/10 border border-oliveDrab/30 rounded-full shadow-sm">
                            <span className="text-bone text-sm">🔄</span>
                            <span className="text-bone/70 text-sm font-medium">Updated Daily</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-oliveDrab/10 border border-oliveDrab/30 rounded-full shadow-sm">
                            <span className="text-bone text-sm">🆓</span>
                            <span className="text-bone/70 text-sm font-medium">100% Free to Use</span>
                        </div>
                    </div>

                    {/* Search Bar + Trending */}
                    <SearchBar />

                    {/* CTA Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <Link
                            href="/random"
                            className="w-full sm:w-auto px-8 py-4 bg-floralWhite text-smokyBlack font-bold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center space-x-2 text-lg"
                        >
                            <span>🔍</span>
                            <span>Find Coupons</span>
                        </Link>
                        <Link
                            href="/platforms"
                            className="w-full sm:w-auto px-8 py-4 bg-oliveDrab/10 border border-oliveDrab hover:border-bone text-floralWhite font-bold rounded-xl transition-all flex items-center justify-center space-x-2 text-lg"
                        >
                            <span>🏪</span>
                            <span>Browse Stores</span>
                        </Link>
                    </div>
                    
                    <p className="text-bone/70 text-sm">
                        Trusted by thousands of shoppers looking for verified deals every day.
                    </p>
                    </div>
                </section>

                {/* Top Featured Stores */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-floralWhite mb-8 font-display">Top Featured Stores</h2>
                    {loading ? (
                        <div className="text-center py-10 text-bone/50">Loading stores...</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                            {platforms.map((store, i) => (
                                <Link key={i} href={`/platforms/${store.slug}`} className="flex flex-col items-center bg-smokyBlack/90 border border-oliveDrab/30 rounded-2xl p-6 hover:border-bone/50 transition-all hover:-translate-y-1 shadow-lg cursor-pointer">
                                    <div
                                        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl border border-oliveDrab/20"
                                        style={{ backgroundColor: store.backgroundColor, color: store.textColor }}
                                    >
                                        {store.logo || store.name.charAt(0)}
                                    </div>
                                    <span className="px-3 py-1.5 bg-oliveDrab/20 border border-oliveDrab/40 rounded-full text-xs font-semibold text-bone whitespace-nowrap">
                                        Up to 50% Off
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <div className="max-w-6xl mx-auto px-4 py-6">
                    <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" />
                </div>

                {/* Featured Deals & Codes */}
                <section className="w-full px-4 md:px-8 py-12">
                    <h2 className="text-2xl font-bold text-floralWhite mb-8 font-display">Featured Deals & Codes</h2>
                    {loading ? (
                        <div className="text-center py-10 text-bone/50">Loading deals...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {coupons.map((deal, i) => (
                                <div key={i} className="bg-smokyBlack/90 border border-oliveDrab/30 rounded-2xl p-6 flex flex-col hover:border-bone/50 transition-all hover:-translate-y-1 shadow-lg">
                                    {/* Header: Logo + Name + Active Badge */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-md border border-oliveDrab/20"
                                                style={{ backgroundColor: deal.platform.backgroundColor, color: deal.platform.textColor }}
                                            >
                                                {deal.platform.logo || deal.platform.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-floralWhite text-base tracking-wider">
                                                {deal.platform.name}
                                            </span>
                                        </div>
                                        <span className="px-4 py-1.5 bg-oliveDrab/20 border border-oliveDrab/40 rounded-full text-xs font-bold text-bone">
                                            Active
                                        </span>
                                    </div>

                                    {/* Discount */}
                                    <h3 className="text-xl font-bold text-floralWhite mb-4 leading-snug">
                                        {deal.discountType === 'percentage' ? `${deal.discountValue}% OFF` : `$${deal.discountValue} OFF`} Your Purchase
                                    </h3>

                                    {/* Verified + Code */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <FiCheck className="text-bone w-4 h-4" />
                                            <span className="text-bone font-medium">Verified</span>
                                            <span className="text-bone/50 mx-1">•</span>
                                            <span className="text-bone/70">Code: <span className="text-floralWhite font-mono font-bold text-base bg-oliveDrab/20 px-2 py-0.5 rounded">{deal.code.slice(0, 4)}***</span></span>
                                        </div>
                                        <button onClick={() => handleCopy(deal.code)} className="p-1.5 hover:bg-oliveDrab/20 rounded-md transition-colors">
                                            <FiCopy className="w-4 h-4 text-bone/70 hover:text-floralWhite" />
                                        </button>
                                    </div>

                                    {/* Expiry + Copy */}
                                    <div className="flex items-center text-sm text-bone/60 mb-5">
                                        <span>Exp: {new Date(deal.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        <span className="mx-2">•</span>
                                        <button onClick={() => handleCopy(deal.code)} className="text-bone hover:text-floralWhite underline underline-offset-2 font-medium">Copy Code</button>
                                    </div>

                                    {/* Terms Info */}
                                    <div className="flex flex-col space-y-2 mb-6 p-3 bg-oliveDrab/10 rounded-lg text-xs text-bone/70 border border-oliveDrab/20">
                                        <div className="flex items-center justify-between">
                                            <span>Category</span>
                                            <span className="text-floralWhite capitalize font-medium">{deal.platform.category || 'Sitewide'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Min. Order</span>
                                            <span className="text-floralWhite font-medium">{deal.minPurchase > 0 ? `$${deal.minPurchase}` : 'No Minimum'}</span>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center justify-between mb-6 text-sm text-bone/70">
                                        <span>User Rating</span>
                                        <div className="flex items-center space-x-1.5">
                                            <span className="font-bold text-floralWhite text-base">4.9</span>
                                            <FiStar className="text-warning w-4 h-4 fill-current" />
                                        </div>
                                    </div>

                                    {/* Get Code Button */}
                                    <button
                                        onClick={() => handleOpenModal(deal)}
                                        className="block text-center w-full py-3.5 bg-floralWhite text-smokyBlack font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
                                    >
                                        Get Code
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="max-w-6xl mx-auto px-4 mb-16">
                    <AdBanner />
                </div>

                {/* Why Choose CouponVault */}
                <section className="bg-smokyBlack border-t border-b border-oliveDrab/30 py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-floralWhite mb-4 font-display">Why Choose CouponVault?</h2>
                            <p className="text-bone/70 max-w-2xl mx-auto">We make saving money effortless with verified deals and instant access to the best discounts online.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: FiZap, title: 'Instant Coupons', desc: 'Get valid coupon codes instantly with just one click' },
                                { icon: FiShield, title: '100% Verified', desc: 'All coupons are automatically verified and tested' },
                                { icon: FiTrendingUp, title: 'Daily Updates', desc: 'Fresh coupons added daily for maximum savings' },
                                { icon: FiGift, title: 'Top Brands', desc: 'Exclusive deals from Amazon, Walmart, Target & more' },
                            ].map((feature, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-6 bg-oliveDrab/5 rounded-2xl border border-oliveDrab/30 hover:border-bone/50 transition-all">
                                    <div className="w-14 h-14 rounded-xl bg-oliveDrab/20 border border-oliveDrab/50 flex items-center justify-center mb-5">
                                        <feature.icon className="w-6 h-6 text-bone" />
                                    </div>
                                    <h3 className="text-lg font-bold text-floralWhite mb-2">{feature.title}</h3>
                                    <p className="text-sm text-bone/60 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <CouponModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    coupon={selectedCoupon}
                    platform={selectedCoupon?.platform}
                />
            </main>

            <Footer />
        </div>
    );
}
