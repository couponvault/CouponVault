'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/ui/CouponCard';
import { FiArrowLeft, FiTag, FiInfo, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CouponModal from '@/components/CouponModal';
import BrandLogo from '@/components/ui/BrandLogo';

export default function PlatformDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [platform, setPlatform] = useState<any>(null);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchPlatformDetails();
        }
    }, [slug]);

    const fetchPlatformDetails = async () => {
        try {
            setLoading(true);

            // Fetch platform details and ALL its coupons
            const response = await fetch(`/api/platforms/${slug}`);
            const data = await response.json();

            if (data.success) {
                setPlatform(data.platform);
                setCoupons(data.coupons);
            } else {
                toast.error(data.error || 'Failed to load details');
            }
        } catch (error) {
            toast.error('Error loading platform details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="spinner w-12 h-12"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!platform && !loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold mb-4">Platform Not Found</h1>
                    <Link href="/platforms" className="text-primary-500 hover:underline">Return to Platforms</Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link href="/platforms" className="inline-flex items-center space-x-2 text-gray-500 hover:text-primary-500 mb-8 transition-colors">
                        <FiArrowLeft />
                        <span>Back to Platforms</span>
                    </Link>

                    {/* Platform Header */}
                    <div
                        className="glass-card p-8 rounded-3xl mb-8 border-b-8"
                        style={{ borderBottomColor: platform.backgroundColor }}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-center space-x-6">
                                <div
                                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shadow-lg overflow-hidden shrink-0"
                                    style={{ backgroundColor: platform.backgroundColor, color: platform.textColor }}
                                >
                                    <BrandLogo name={platform.name} logo={platform.logo} />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold font-display">{platform.name}</h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl line-clamp-2">{platform.description}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                                <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center space-x-2 shadow-sm">
                                    <span className="text-gray-500 text-sm">Status:</span>
                                    <span className="font-bold text-green-500 flex items-center gap-1 text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Verified
                                    </span>
                                </div>
                                <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-col shadow-sm">
                                    <span className="text-gray-500 text-xs">Success Rate</span>
                                    <span className="font-bold text-blue-500">99.4%</span>
                                </div>
                                <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-col shadow-sm">
                                    <span className="text-gray-500 text-xs">Users Saving</span>
                                    <span className="font-bold text-appleText">4.2k Today</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold flex items-center space-x-2">
                                <FiTag className="text-primary-500" />
                                <span>All Available Coupons</span>
                            </h2>
                            <span className="text-sm text-gray-500 font-medium">{coupons.length} coupons found</span>
                        </div>

                        {coupons.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                            <div className="glass-card p-12 text-center rounded-2xl">
                                <p className="text-gray-500">No active coupons found for this platform.</p>
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
