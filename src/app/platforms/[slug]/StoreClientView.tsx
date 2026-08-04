'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/ui/CouponCard';
import { FiArrowLeft, FiTag, FiCheck } from 'react-icons/fi';
import Link from 'next/link';
import CouponModal from '@/components/CouponModal';
import BrandLogo from '@/components/ui/BrandLogo';

export default function StoreClientView({ platform, coupons }: { platform: any, coupons: any[] }) {
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!platform) {
        return (
            <div className="min-h-screen flex flex-col bg-appleBg">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-appleBorder shadow-sm max-w-2xl mx-auto w-full px-6">
                        <div className="w-20 h-20 bg-appleCard rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            🔍
                        </div>
                        <h3 className="text-2xl font-bold text-appleText mb-3">Store Not Found</h3>
                        <p className="text-appleMuted text-base mb-8">
                            We couldn't find the store you're looking for. It may have been removed or the link is incorrect.
                        </p>
                        <Link 
                            href="/platforms" 
                            className="inline-flex items-center px-8 py-3 bg-appleBlue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            <FiArrowLeft className="mr-2 w-5 h-5" />
                            Return to All Stores
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const hash = hashString(platform.name);
    const successRate = (95 + (hash % 50) / 10).toFixed(1) + '%'; 
    const usersSaving = (1 + (hash % 150) / 10).toFixed(1) + 'k Today';

    return (
        <div className="min-h-screen flex flex-col bg-appleBg">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link href="/platforms" className="inline-flex items-center space-x-2 text-appleMuted hover:text-appleBlue mb-8 transition-colors font-medium">
                        <FiArrowLeft className="w-5 h-5" />
                        <span>Back to all stores</span>
                    </Link>

                    {/* Premium Platform Header */}
                    <div className="relative bg-white rounded-[2rem] p-8 md:p-10 mb-12 shadow-sm border border-appleBorder/60 overflow-hidden isolate">
                        {/* Background subtle glow */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] -z-10 opacity-30" style={{ backgroundColor: platform.backgroundColor || '#007AFF' }} />
                        
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-[1.5rem] flex items-center justify-center text-4xl sm:text-5xl shadow-md border border-appleBorder/40 overflow-hidden shrink-0"
                                    style={{ backgroundColor: platform.backgroundColor || '#f5f5f7', color: platform.textColor || '#1d1d1f' }}
                                >
                                    <BrandLogo name={platform.name} logo={platform.logo} slug={platform.slug} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-appleText tracking-tight">{platform.name}</h1>
                                        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                                            <FiCheck className="text-success w-3 h-3" />
                                            <span className="text-success font-bold text-xs">Verified</span>
                                        </div>
                                    </div>
                                    <p className="text-appleMuted text-base md:text-lg max-w-2xl leading-relaxed">{platform.description}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 lg:justify-end shrink-0">
                                <div className="px-5 py-3 bg-appleCard rounded-xl border border-appleBorder/50 flex flex-col shadow-sm min-w-[120px]">
                                    <span className="text-appleMuted text-xs font-semibold uppercase tracking-wider mb-1">Status</span>
                                    <span className="font-bold text-success flex items-center gap-2">
                                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div> Active
                                    </span>
                                </div>
                                <div className="px-5 py-3 bg-appleCard rounded-xl border border-appleBorder/50 flex flex-col shadow-sm min-w-[120px]">
                                    <span className="text-appleMuted text-xs font-semibold uppercase tracking-wider mb-1">Success Rate</span>
                                    <span className="font-bold text-appleBlue text-lg">{successRate}</span>
                                </div>
                                <div className="px-5 py-3 bg-appleCard rounded-xl border border-appleBorder/50 flex flex-col shadow-sm min-w-[120px]">
                                    <span className="text-appleMuted text-xs font-semibold uppercase tracking-wider mb-1">Users Saving</span>
                                    <span className="font-bold text-appleText text-lg">{usersSaving}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-appleBorder pb-4">
                            <h2 className="text-2xl font-bold flex items-center space-x-3 text-appleText">
                                <FiTag className="text-appleBlue" />
                                <span>Available Coupons</span>
                            </h2>
                            <span className="px-4 py-1.5 bg-appleCard text-appleMuted text-sm font-bold rounded-full">
                                {coupons.length} {coupons.length === 1 ? 'deal' : 'deals'} found
                            </span>
                        </div>

                        {coupons.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                {coupons.map((coupon, index) => (
                                    <CouponCard 
                                        key={index} 
                                        coupon={coupon} 
                                        onOpenModal={(c) => {
                                            setSelectedCoupon(c);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-16 text-center rounded-3xl border border-appleBorder shadow-sm max-w-2xl mx-auto">
                                <div className="w-20 h-20 bg-appleCard rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎫</div>
                                <h3 className="text-2xl font-bold text-appleText mb-3">No active coupons right now</h3>
                                <p className="text-appleMuted text-base">We are currently looking for new deals for {platform.name}. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
                <CouponModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    coupon={selectedCoupon}
                    platform={selectedCoupon?.platform || platform}
                />
            </main>

            <Footer />
        </div>
    );
}
