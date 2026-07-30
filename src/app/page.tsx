'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import CouponModal from '@/components/CouponModal';
import BrandLogo from '@/components/ui/BrandLogo';
import { FiZap, FiCheck, FiCopy, FiStar, FiArrowRight, FiShield, FiTrendingUp, FiGift, FiGrid, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';
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
                    fetch('/api/platforms?active=true'),
                    fetch('/api/coupons?limit=30')
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
        <div className="min-h-screen flex flex-col bg-appleBg relative">
            {/* Colorful top gradient mesh */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50 via-purple-50/30 to-transparent -z-10 pointer-events-none" />
            <Navbar />

            <main className="flex-1">
                {/* Unified Hero Section */}
                <section className="relative w-full overflow-hidden text-center py-16 px-4">
                    {/* Floating Brand Logos (Solar System effect) */}
                    <div className="hidden xl:block absolute inset-0 pointer-events-none">
                        {/* Left Side Brands */}
                        {[
                            { name: 'Amazon', logo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128', bg: '#fff', text: '#ff9900', t: '10%', l: '8%', dur: 4, del: 0 },
                            { name: 'Walmart', logo: 'https://www.google.com/s2/favicons?domain=walmart.com&sz=128', bg: '#fff', text: '#0071ce', t: '35%', l: '3%', dur: 5, del: 1 },
                            { name: 'Best Buy', logo: 'https://www.google.com/s2/favicons?domain=bestbuy.com&sz=128', bg: '#0046be', text: '#fff', t: '60%', l: '12%', dur: 4.5, del: 2 },
                            { name: 'Sephora', logo: 'https://www.google.com/s2/favicons?domain=sephora.com&sz=128', bg: '#000', text: '#fff', t: '80%', l: '5%', dur: 5.5, del: 0.5 },
                            { name: 'Nike', logo: 'https://www.google.com/s2/favicons?domain=nike.com&sz=128', bg: '#000', text: '#fff', t: '25%', l: '18%', dur: 6, del: 1.5 },
                        ].map((brand, i) => (
                            <motion.div 
                                key={`left-${i}`}
                                initial={{ y: 0 }}
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: brand.dur, repeat: Infinity, ease: "easeInOut", delay: brand.del }}
                                className="absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_10px_40px_rgba(37,99,235,0.15)] border border-[#2A3445] backdrop-blur-md overflow-hidden"
                                style={{ top: brand.t, left: brand.l, backgroundColor: brand.bg, color: brand.text }}
                            >
                                <BrandLogo name={brand.name} logo={brand.logo} />
                            </motion.div>
                        ))}

                        {/* Right Side Brands */}
                        {[
                            { name: 'eBay', logo: 'https://www.google.com/s2/favicons?domain=ebay.com&sz=128', bg: '#fff', text: '#e53238', t: '12%', r: '10%', dur: 5, del: 0.2 },
                            { name: "Macy's", logo: 'https://www.google.com/s2/favicons?domain=macys.com&sz=128', bg: '#e21a2c', text: '#fff', t: '38%', r: '4%', dur: 4.5, del: 1.2 },
                            { name: 'DoorDash', logo: 'https://www.google.com/s2/favicons?domain=doordash.com&sz=128', bg: '#eb1700', text: '#fff', t: '65%', r: '14%', dur: 5.5, del: 2.5 },
                            { name: 'Apple', logo: 'https://www.google.com/s2/favicons?domain=apple.com&sz=128', bg: '#000', text: '#fff', t: '85%', r: '6%', dur: 4, del: 0.8 },
                            { name: 'Target', logo: 'https://www.google.com/s2/favicons?domain=target.com&sz=128', bg: '#cc0000', text: '#fff', t: '22%', r: '18%', dur: 6, del: 1.8 },
                        ].map((brand, i) => (
                            <motion.div 
                                key={`right-${i}`}
                                initial={{ y: 0 }}
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: brand.dur, repeat: Infinity, ease: "easeInOut", delay: brand.del }}
                                className="absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_10px_40px_rgba(16,185,129,0.15)] border border-[#2A3445] backdrop-blur-md overflow-hidden"
                                style={{ top: brand.t, right: brand.r, backgroundColor: brand.bg, color: brand.text }}
                            >
                                <BrandLogo name={brand.name} logo={brand.logo} />
                            </motion.div>
                        ))}
                        
                        {/* Stronger background glows to blend them */}
                        <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-400/10 rounded-full blur-[100px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="max-w-5xl mx-auto relative z-10">
                        <h1 className="text-3xl md:text-5xl font-semibold text-appleText mb-4 font-display tracking-tight leading-tight">
                            Verified Coupons & Deals That Actually Work
                        </h1>
                    
                    <p className="text-appleMuted text-base md:text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
                        Save money with verified coupon codes, promo offers, cashback deals, and exclusive discounts from hundreds of trusted brands. Updated daily to ensure every deal is fresh and reliable.
                    </p>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-6">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-appleBorder rounded-full shadow-sm">
                            <FiCheck className="w-4 h-4 text-appleBlue" />
                            <span className="text-appleMuted text-sm font-medium">15,000+ Verified Coupons</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-appleBorder rounded-full shadow-sm">
                            <span className="text-appleBlue text-sm">🏪</span>
                            <span className="text-appleMuted text-sm font-medium">500+ Trusted Stores</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-appleBorder rounded-full shadow-sm">
                            <span className="text-appleBlue text-sm">🔄</span>
                            <span className="text-appleMuted text-sm font-medium">Updated Daily</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-appleBorder rounded-full shadow-sm">
                            <span className="text-appleBlue text-sm">🆓</span>
                            <span className="text-appleMuted text-sm font-medium">100% Free to Use</span>
                        </div>
                    </div>

                    {/* Search Bar + Trending */}
                    <SearchBar />

                    {/* CTA Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <Link
                            href="/random"
                            className="w-full sm:w-auto px-8 py-4 bg-appleBlue text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-lg"
                        >
                            <span>🔍</span>
                            <span>Find Coupons</span>
                        </Link>
                        <Link
                            href="/platforms"
                            className="w-full sm:w-auto px-8 py-4 bg-white border border-appleBorder hover:border-appleBlue text-appleText font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 text-lg"
                        >
                            <span>🏪</span>
                            <span>Browse Brands</span>
                        </Link>
                    </div>
                    
                    <p className="text-appleMuted text-sm">
                        Trusted by thousands of shoppers looking for verified deals every day.
                    </p>
                    </div>
                </section>

                {/* Top Featured Stores */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-appleText mb-8 font-display">Top Featured Stores</h2>
                    {loading ? (
                        <div className="text-center py-10 text-appleMuted">Loading stores...</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                            {platforms.map((store, i) => (
                                <Link key={i} href={`/platforms/${store.slug}`} className="flex flex-col items-center bg-white border border-appleBorder rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 shadow-sm cursor-pointer">
                                    <div
                                        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-sm border border-appleBorder/50 overflow-hidden shrink-0"
                                        style={{ backgroundColor: store.backgroundColor, color: store.textColor }}
                                    >
                                        <BrandLogo name={store.name} logo={store.logo} slug={store.slug} />
                                    </div>
                                    <span className="px-3 py-1.5 bg-success/10 border border-success/20 rounded-full text-xs font-semibold text-success whitespace-nowrap">
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
                    <h2 className="text-2xl font-bold text-appleText mb-8 font-display">Featured Deals & Codes</h2>
                    {loading ? (
                        <div className="text-center py-10 text-appleMuted">Loading deals...</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                            {coupons.map((deal, i) => (
                                <div 
                                    key={i} 
                                    className="coupon-card bg-white border-b border-l border-r border-appleBorder rounded-2xl p-3 sm:p-6 flex flex-col hover:shadow-lg transition-all hover:-translate-y-1 shadow-sm group border-t-4"
                                    style={{ borderTopColor: deal.platform.backgroundColor || '#007AFF' }}
                                >
                                    {/* Header: Logo + Name + Active Badge */}
                                    <div className="flex items-center justify-between mb-2 sm:mb-5">
                                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                                            <div
                                                className="w-7 h-7 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-base shadow-sm border border-appleBorder/50 overflow-hidden shrink-0"
                                                style={{ backgroundColor: deal.platform.backgroundColor, color: deal.platform.textColor }}
                                            >
                                                <BrandLogo name={deal.platform.name} logo={deal.platform.logo} slug={deal.platform.slug} />
                                            </div>
                                            <span className="font-bold text-appleText text-xs sm:text-base tracking-wider truncate">
                                                {deal.platform.name}
                                            </span>
                                        </div>
                                        <span className="px-1.5 py-0.5 sm:px-4 sm:py-1.5 bg-success/10 border border-success/20 rounded-full text-[9px] sm:text-xs font-bold text-success shrink-0">
                                            Active
                                        </span>
                                    </div>

                                    {/* Discount */}
                                    <h3 className="text-sm sm:text-xl font-bold text-appleText mb-2 sm:mb-4 leading-snug group-hover:text-appleBlue transition-colors line-clamp-2">
                                        {deal.description || `${deal.discountType === 'percentage' ? `${deal.discountValue}% OFF` : `$${deal.discountValue} OFF`} Your Purchase`}
                                    </h3>

                                    {/* Verified */}
                                    <div className="flex items-center space-x-1.5 text-xs mb-1">
                                        <FiCheck className="text-appleBlue w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-appleBlue font-medium text-[10px] sm:text-sm">Verified</span>
                                    </div>

                                    {/* Expiry */}
                                    <div className="flex items-center text-[10px] sm:text-sm text-appleMuted mb-2 sm:mb-5">
                                        <span>Exp: {new Date(deal.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>

                                    {/* Terms Info - hidden on mobile */}
                                    <div className="hidden sm:flex flex-col space-y-2 mb-6 p-3 bg-appleCard rounded-lg text-xs text-appleMuted border border-appleBorder/50">
                                        <div className="flex items-center justify-between">
                                            <span>Category</span>
                                            <span className="text-appleText capitalize font-medium">{deal.platform.category || 'Sitewide'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Min. Order</span>
                                            <span className="text-appleText font-medium">{deal.minPurchase > 0 ? `$${deal.minPurchase}` : 'No Minimum'}</span>
                                        </div>
                                    </div>

                                    {/* Rating - hidden on mobile */}
                                    <div className="hidden sm:flex items-center justify-between mb-6 text-sm text-appleMuted">
                                        <span>User Rating</span>
                                        <div className="flex items-center space-x-1.5">
                                            <span className="font-bold text-appleText text-base">
                                                {(4.5 + (deal.code.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 6) / 10).toFixed(1)}
                                            </span>
                                            <FiStar className="text-warning w-4 h-4 fill-current" />
                                        </div>
                                    </div>

                                    {/* Get Code Button */}
                                    <button
                                        onClick={() => handleOpenModal(deal)}
                                        className={`btn-glow block text-center w-full py-2 sm:py-3.5 font-semibold text-xs sm:text-base rounded-lg sm:rounded-xl text-white mt-auto ${deal.code.startsWith('DEAL-') ? 'bg-orange-500 hover:bg-orange-600' : 'bg-appleBlue hover:bg-blue-600'}`}
                                    >
                                        Get Code
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {hasMore && !loading && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="px-8 py-4 bg-white border-2 border-appleBorder hover:border-appleBlue text-appleText font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingMore ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-appleBlue border-t-transparent rounded-full animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Load More Coupons</span>
                                        <FiArrowRight className="w-5 h-5" />
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
                <section className="max-w-6xl mx-auto px-4 py-16 border-t border-appleBorder">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-appleText mb-2 font-display">Latest Shopping Guides</h2>
                    <p className="text-appleMuted">Tips, hacks, and strategies from our editorial team.</p>
                        </div>
                        <Link href="/blog" className="hidden sm:flex items-center text-appleBlue hover:text-blue-700 font-medium">
                            View All <FiArrowRight className="ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {blogPosts.slice(0, 5).map((post) => (
                            <Link 
                                key={post.id} 
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-appleBorder hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative h-40 sm:h-48 overflow-hidden shrink-0">
                                    <img 
                                        src={post.image} 
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-center">
                                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-appleBlue font-medium mb-2">
                                        <FiBookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="font-bold text-appleText text-sm sm:text-base mb-2 group-hover:text-appleBlue transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-appleMuted text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                                        <span className="font-medium text-appleText line-clamp-1">{post.author}</span>
                                        <span className="shrink-0 ml-2">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-6 sm:hidden">
                        <Link href="/blog" className="flex items-center justify-center w-full py-3 bg-gray-50 border border-appleBorder rounded-xl text-appleText font-medium">
                            View All Guides
                        </Link>
                    </div>
                </section>

                {/* Why Choose CouponVault */}
                <section className="bg-blue-50/50 border-t border-b border-blue-100 py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-appleText mb-4 font-display">Why Choose CouponVault?</h2>
                            <p className="text-appleMuted max-w-2xl mx-auto">We make saving money effortless with verified deals and instant access to the best discounts online.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: FiZap, title: 'Instant Coupons', desc: 'Get valid coupon codes instantly with just one click', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
                                { icon: FiShield, title: '100% Verified', desc: 'All coupons are automatically verified and tested', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
                                { icon: FiTrendingUp, title: 'Daily Updates', desc: 'Fresh coupons added daily for maximum savings', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
                                { icon: FiGift, title: 'Top Brands', desc: 'Exclusive deals from Amazon, Walmart, Target & more', color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
                            ].map((feature, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-appleBorder hover:shadow-md transition-all">
                                    <div className={`w-14 h-14 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-5 shadow-sm`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-appleText mb-2">{feature.title}</h3>
                                    <p className="text-sm text-appleMuted leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SEO Text Section for Google Rank */}
                <section className="bg-white py-12 px-4 border-t border-appleBorder">
                    <div className="max-w-6xl mx-auto">
                        <div className="prose prose-sm md:prose-base text-gray-500 max-w-none">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Find The Best Verified Amazon Coupons & Promo Codes for 2026</h2>
                            <p className="mb-4">
                                Welcome to CouponVault, your ultimate destination for unlocking massive savings across the internet's biggest retailers. If you are looking for an <strong>Amazon coupon</strong>, Walmart promo code, or Target discount, you have come to the right place. Our proprietary engine automatically tests, verifies, and updates thousands of discount codes daily, ensuring you never face the frustration of an expired code again.
                            </p>
                            <p className="mb-4">
                                Why pay full price when you can access exclusive savings? From tech gadgets and fashion apparel to everyday household essentials, our extensive database of <strong>Amazon promo codes</strong> and deals is meticulously curated to guarantee working discounts. We partner directly with top brands and leverage cutting-edge technology to bring you real-time savings that actually work at checkout. 
                            </p>
                            <p>
                                Join thousands of smart shoppers who trust CouponVault for their daily online shopping. Whether you need free shipping, percentage-off deals, or buy-one-get-one offers, our platform is designed to make saving money effortless. Stop searching endless coupon sites—get your verified <strong>Amazon coupons</strong> and start saving today with CouponVault!
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
