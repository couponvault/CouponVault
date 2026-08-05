'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import nextDynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

// Lazy load heavy components
const Footer = nextDynamic(() => import('@/components/Footer'), { ssr: false });
const CouponModal = nextDynamic(() => import('@/components/CouponModal'), { ssr: false });
import SearchBar from '@/components/SearchBar';
import BrandLogo from '@/components/ui/BrandLogo';
import { FiZap, FiCheck, FiCopy, FiStar, FiArrowRight, FiShield, FiTrendingUp, FiGift, FiGrid, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';
import CouponCard from '@/components/ui/CouponCard';
import { blogPosts } from '@/data/blogPosts';

export const dynamic = 'force-dynamic';

export default function HomePage() {
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [platformsRes, couponsRes] = await Promise.all([
                    fetch(`/api/platforms?active=true&t=${Date.now()}`, { cache: 'no-store' }),
                    fetch(`/api/coupons?limit=30&t=${Date.now()}`, { cache: 'no-store' })
                ]);
                
                const platformsData = await platformsRes.json();
                const couponsData = await couponsRes.json();
                
                if (platformsData.success) {
                    setPlatforms(platformsData.platforms.slice(0, 6)); // Top 6 for featured
                }
                
                if (couponsData.success) {
                    setCoupons(couponsData.coupons.filter((c: any) => c.platform));
                    setHasMore(couponsData.hasMore);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLoadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const excludeIds = coupons.map(c => c._id);
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 30, exclude: excludeIds })
            });
            const data = await res.json();
            if (data.success) {
                setCoupons(prev => [...prev, ...data.coupons.filter((c: any) => c.platform)]);
                setHasMore(data.hasMore);
            }
        } catch (error) {
            toast.error('Failed to load more coupons');
        } finally {
            setLoadingMore(false);
        }
    };

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
        <div className="min-h-screen flex flex-col bg-appleBg relative selection:bg-appleBlue/20 selection:text-appleBlue">
            {/* Colorful top gradient mesh */}
            <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-50/80 via-purple-50/40 to-transparent -z-10 pointer-events-none" />
            <Navbar />

            <main className="flex-1 pt-12">
                {/* Unified Premium Hero Section */}
                <section className="relative w-full overflow-hidden text-center py-16 lg:py-24 px-4">
                    {/* Floating Brand Logos (Premium Glassmorphism) */}
                    <div className="hidden lg:block absolute inset-0 pointer-events-none opacity-80">
                        {/* Stronger background glows to blend them */}
                        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px]" />
                        
                        {/* Left Side Brands */}
                        {[
                            { name: 'Amazon', logo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128', bg: '#fff', text: '#ff9900', t: '15%', l: 'calc(50% - 580px)', dur: 6, del: 0 },
                            { name: 'Walmart', logo: 'https://www.google.com/s2/favicons?domain=walmart.com&sz=128', bg: '#fff', text: '#0071ce', t: '45%', l: 'calc(50% - 620px)', dur: 7, del: 1.5 },
                            { name: 'Best Buy', logo: 'https://www.google.com/s2/favicons?domain=bestbuy.com&sz=128', bg: '#0046be', text: '#fff', t: '75%', l: 'calc(50% - 550px)', dur: 5.5, del: 3 },
                        ].map((brand, i) => (
                            <motion.div 
                                key={`left-${i}`}
                                initial={{ y: 0, opacity: 0 }}
                                animate={{ y: [0, -20, 0], opacity: 1 }}
                                transition={{ duration: brand.dur, repeat: Infinity, ease: "easeInOut", delay: brand.del, opacity: { duration: 1 } }}
                                className="absolute w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-premium border border-white/40 backdrop-blur-xl overflow-hidden"
                                style={{ top: brand.t, left: brand.l, backgroundColor: 'rgba(255,255,255,0.9)', color: brand.text }}
                            >
                                <BrandLogo name={brand.name} logo={brand.logo} />
                            </motion.div>
                        ))}

                        {/* Right Side Brands */}
                        {[
                            { name: 'eBay', logo: 'https://www.google.com/s2/favicons?domain=ebay.com&sz=128', bg: '#fff', text: '#e53238', t: '20%', r: 'calc(50% - 570px)', dur: 6.5, del: 0.5 },
                            { name: 'Apple', logo: 'https://www.google.com/s2/favicons?domain=apple.com&sz=128', bg: '#000', text: '#fff', t: '50%', r: 'calc(50% - 630px)', dur: 7.5, del: 2 },
                            { name: 'Target', logo: 'https://www.google.com/s2/favicons?domain=target.com&sz=128', bg: '#cc0000', text: '#fff', t: '80%', r: 'calc(50% - 540px)', dur: 5, del: 1 },
                        ].map((brand, i) => (
                            <motion.div 
                                key={`right-${i}`}
                                initial={{ y: 0, opacity: 0 }}
                                animate={{ y: [0, 20, 0], opacity: 1 }}
                                transition={{ duration: brand.dur, repeat: Infinity, ease: "easeInOut", delay: brand.del, opacity: { duration: 1 } }}
                                className="absolute w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-premium border border-white/40 backdrop-blur-xl overflow-hidden"
                                style={{ top: brand.t, right: brand.r, backgroundColor: 'rgba(255,255,255,0.9)', color: brand.text }}
                            >
                                <BrandLogo name={brand.name} logo={brand.logo} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="max-w-5xl mx-auto relative z-10">
                        {/* Trust Badges above headline */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-in">
                            <span className="px-4 py-1.5 bg-appleBlue/10 border border-appleBlue/20 rounded-full text-appleBlue text-xs sm:text-sm font-semibold tracking-wide">
                                🌟 Over 15,000 Verified Deals
                            </span>
                            <span className="px-4 py-1.5 bg-success/10 border border-success/20 rounded-full text-success text-xs sm:text-sm font-semibold tracking-wide">
                                🔄 Updated Daily
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-appleText mb-6 font-display tracking-tight leading-[1.1] text-balance">
                            Never Pay Full Price <br className="hidden md:block" />
                            <span className="gradient-text">Ever Again.</span>
                        </h1>
                    
                        <p className="text-appleMuted text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
                            Join 50,000+ smart shoppers at Coupon Vault, the premier coupon website. Instantly access verified promo codes, cashback deals, and exclusive discount codes for your favorite brands.
                        </p>

                        {/* CTA Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full max-w-md mx-auto sm:max-w-none">
                            <Link
                                href="/random"
                                className="w-full sm:w-auto px-8 py-4 bg-appleBlue text-white font-bold rounded-2xl transition-all shadow-[0_8px_20px_rgba(0,122,255,0.3)] hover:shadow-[0_12px_25px_rgba(0,122,255,0.4)] hover:-translate-y-1 flex items-center justify-center space-x-2 text-lg"
                            >
                                <span>🎁</span>
                                <span>Get Daily Deals</span>
                            </Link>
                            <Link
                                href="/platforms"
                                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-appleBorder hover:border-appleBlue/30 text-appleText font-bold rounded-2xl transition-all hover:shadow-lg flex items-center justify-center space-x-2 text-lg"
                            >
                                <span>Browse Stores</span>
                                <FiArrowRight className="w-5 h-5 text-appleMuted" />
                            </Link>
                        </div>

                        {/* Search Bar seamlessly integrated */}
                        <div className="max-w-2xl mx-auto mb-10">
                            <SearchBar />
                        </div>
                        
                        <p className="text-appleMuted/60 text-sm font-medium">
                            Trusted by shoppers worldwide as their go-to coupon website for 100% free, verified discount codes.
                        </p>
                    </div>
                </section>

                {/* Top Featured Stores */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-appleText mb-3 font-display tracking-tight">Popular Stores</h2>
                            <p className="text-appleMuted text-lg">Browse deals from shoppers' favorite brands.</p>
                        </div>
                        <Link href="/platforms" className="hidden sm:flex items-center text-appleBlue hover:text-blue-700 font-semibold group transition-all">
                            View All Stores <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center bg-white border border-appleBorder/60 rounded-2xl p-6 isolate h-full animate-pulse">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.25rem] bg-appleCard mb-5" />
                                    <div className="h-4 bg-appleCard w-3/4 rounded mb-2" />
                                    <div className="h-6 bg-appleCard w-1/2 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                            {platforms.map((store, i) => (
                                <Link key={i} href={`/platforms/${store.slug}`} className="group flex flex-col items-center bg-white border border-appleBorder/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-2 hover:border-appleBlue/20 cursor-pointer">
                                    <div
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.25rem] flex items-center justify-center text-3xl font-bold mb-5 shadow-sm border border-appleBorder/40 overflow-hidden shrink-0 group-hover:shadow-md transition-shadow"
                                        style={{ backgroundColor: store.backgroundColor || '#f5f5f7', color: store.textColor || '#1d1d1f' }}
                                    >
                                        <BrandLogo name={store.name} logo={store.logo} slug={store.slug} />
                                    </div>
                                    <span className="font-bold text-appleText text-center w-full truncate mb-3 group-hover:text-appleBlue transition-colors">
                                        {store.name}
                                    </span>
                                    <span className="px-3 py-1 bg-success/10 border border-success/20 rounded-full text-xs font-bold text-success whitespace-nowrap">
                                        Up to {store.couponConfig?.discountValue?.max || 50}{store.couponConfig?.discountType === 'percentage' ? '%' : '$'} Off
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="mt-8 sm:hidden flex justify-center">
                        <Link href="/platforms" className="flex items-center justify-center w-full max-w-sm py-4 bg-appleCard border border-appleBorder hover:border-appleBlue rounded-xl text-appleText font-semibold transition-all">
                            View All Stores
                        </Link>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-4 py-6">
                    <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" />
                </div>

                {/* Featured Deals & Codes */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-appleText mb-3 font-display tracking-tight">Today's Top Deals</h2>
                            <p className="text-appleMuted text-lg">Handpicked verified codes for maximum savings.</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white border border-appleBorder/60 rounded-2xl p-4 sm:p-5 flex flex-col h-full animate-pulse">
                                    <div className="flex items-start mb-4 mt-1">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] bg-appleCard shrink-0 mr-3" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-appleCard w-1/2 rounded mb-2" />
                                            <div className="h-3 bg-appleCard w-1/3 rounded" />
                                        </div>
                                    </div>
                                    <div className="h-5 bg-appleCard w-3/4 rounded mb-2" />
                                    <div className="h-4 bg-appleCard w-full rounded mb-1" />
                                    <div className="h-4 bg-appleCard w-2/3 rounded mb-4" />
                                    <div className="mt-auto w-full h-12 bg-appleCard rounded-xl" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {coupons.map((deal, i) => (
                                <CouponCard key={i} coupon={deal} onOpenModal={handleOpenModal} />
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {hasMore && !loading && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="group px-8 py-4 bg-appleCard border border-appleBorder hover:border-appleBlue/50 text-appleText font-bold rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loadingMore ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-appleBlue border-t-transparent rounded-full animate-spin" />
                                        <span>Loading More...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Explore More Deals</span>
                                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </section>

                <div className="max-w-6xl mx-auto px-4 mb-16">
                    <AdBanner />
                </div>

                {/* Latest Shopping Guides */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-appleBorder/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-appleText mb-3 font-display tracking-tight">Shopping Guides</h2>
                            <p className="text-appleMuted text-lg">Tips, hacks, and strategies from our editorial team.</p>
                        </div>
                        <Link href="/blog" className="hidden md:flex items-center text-appleBlue hover:text-blue-700 font-semibold group transition-all">
                            View All Guides <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {blogPosts.slice(0, 5).map((post) => (
                            <Link 
                                key={post.id} 
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-appleBorder hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1.5"
                            >
                                <div className="relative h-48 overflow-hidden shrink-0">
                                    <Image 
                                        src={post.image} 
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-center space-x-2 text-xs text-appleBlue font-bold tracking-wider uppercase mb-3">
                                        <FiBookOpen className="w-4 h-4" />
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="font-extrabold text-appleText text-lg mb-3 group-hover:text-appleBlue transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>
                                    <p className="text-appleMuted text-sm leading-relaxed mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between text-xs font-medium text-appleMuted border-t border-appleBorder/50 pt-3">
                                        <span className="text-appleText">{post.author}</span>
                                        <span suppressHydrationWarning>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 md:hidden flex justify-center">
                        <Link href="/blog" className="flex items-center justify-center w-full max-w-sm py-4 bg-appleCard border border-appleBorder hover:border-appleBlue rounded-xl text-appleText font-semibold transition-all">
                            View All Guides
                        </Link>
                    </div>
                </section>

                {/* Why Choose CouponVault */}
                <section className="bg-gradient-to-b from-blue-50/50 to-white py-16 px-4 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-appleText mb-6 font-display tracking-tight">Why Smart Shoppers Choose Us</h2>
                            <p className="text-appleMuted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">We make saving money effortless with verified deals, exclusive partnerships, and instant access to the best discounts online.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: FiZap, title: 'Instant Savings', desc: 'Find and apply working coupon codes instantly with just one click at checkout.', color: 'text-amber-500', bg: 'bg-amber-100/50', border: 'border-amber-200' },
                                { icon: FiShield, title: '100% Verified', desc: 'Our proprietary engine tests and verifies every single coupon before it goes live.', color: 'text-emerald-500', bg: 'bg-emerald-100/50', border: 'border-emerald-200' },
                                { icon: FiTrendingUp, title: 'Daily Updates', desc: 'Fresh coupons and new store partnerships added daily for maximum savings.', color: 'text-blue-500', bg: 'bg-blue-100/50', border: 'border-blue-200' },
                                { icon: FiGift, title: 'Top Brands', desc: 'Exclusive deals from your favorite retailers like Amazon, Walmart, and Target.', color: 'text-purple-500', bg: 'bg-purple-100/50', border: 'border-purple-200' },
                            ].map((feature, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-8 bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-premium-hover hover:-translate-y-2 transition-all duration-300">
                                    <div className={`w-16 h-16 rounded-2xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-6 shadow-sm`}>
                                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-appleText mb-3">{feature.title}</h3>
                                    <p className="text-appleMuted leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SEO Text Section for Google Rank */}
                <section className="py-16 px-4 bg-white/50 backdrop-blur-xl border-t border-appleBorder/50">
                    <div className="max-w-4xl mx-auto">
                        <div className="prose prose-sm md:prose-base prose-p:text-appleMuted prose-headings:text-appleText prose-a:text-appleBlue max-w-none text-center">
                            <h2 className="text-2xl font-bold mb-6 font-display">Find The Best Verified Coupons & Promo Codes for Amazon, Walmart, Target & More</h2>
                            <p className="mb-5 leading-relaxed">
                                Welcome to CouponVault, your ultimate destination for unlocking massive savings across the internet's biggest retailers. Whether you are looking for an <strong className="text-appleText font-bold">Amazon promo code</strong>, a Walmart discount, or a Target coupon, you have come to the right place. Our proprietary engine automatically tests, verifies, and updates thousands of discount codes daily, ensuring you never face the frustration of an expired code again.
                            </p>
                            <p className="mb-5 leading-relaxed">
                                Why pay full price when you can access exclusive savings? From tech gadgets at Best Buy to fashion apparel at Macy's and everyday household essentials, our extensive database of <strong className="text-appleText font-bold">verified promo codes</strong> is meticulously curated to guarantee working discounts. We partner directly with top brands and leverage cutting-edge technology to bring you real-time savings that actually work at checkout. 
                            </p>
                            <p className="leading-relaxed">
                                Join thousands of smart shoppers who trust CouponVault for their daily online shopping. Whether you need free shipping, percentage-off deals, or buy-one-get-one offers from eBay, Sephora, or DoorDash, our platform is designed to make saving money effortless. Stop searching endless coupon sites—get your <strong className="text-appleText font-bold">working discount codes</strong> and start saving today with CouponVault!
                            </p>
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
