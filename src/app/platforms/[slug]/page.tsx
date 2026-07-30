'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/ui/CouponCard';
import { FiArrowLeft, FiTag, FiInfo, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';

export default function PlatformDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [platform, setPlatform] = useState<any>(null);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center space-x-6">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg overflow-hidden shrink-0"
                                    style={{ backgroundColor: platform.backgroundColor, color: platform.textColor }}
                                >
                                    {platform.logo && platform.logo.startsWith('http') ? (
                                        <img src={platform.logo} alt={platform.name} className="w-full h-full object-cover" />
                                    ) : (
                                        platform.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold font-display">{platform.name}</h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{platform.description}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-glow transition-all"
                            >
                                Get New Coupon
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-2xl font-bold flex items-center space-x-2">
                                <FiTag className="text-primary-500" />
                                <span>All Available Coupons</span>
                            </h2>

                            {coupons.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {coupons.map((coupon, index) => (
                                        <CouponCard key={index} coupon={coupon} />
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-12 text-center rounded-2xl">
                                    <p className="text-gray-500">No active coupons found for this platform.</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="font-bold mb-4 flex items-center space-x-2">
                                    <FiInfo className="text-secondary-500" />
                                    <span>Platform Info</span>
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status</span>
                                        <span className="font-semibold text-green-500 flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            Verified ✅
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Success Rate</span>
                                        <span className="font-semibold text-blue-500">99.4%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Users Saving</span>
                                        <span className="font-semibold">4.2k Today</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Last Checked</span>
                                        <span className="text-gray-400 italic">2 mins ago</span>
                                    </div>
                                </div>
                            </div>

                            <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" className="mb-6" />

                            <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5">
                                <h3 className="font-bold mb-2">Instructions</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    1. Copy the code above.<br />
                                    2. Visit {platform.name} website.<br />
                                    3. Paste at checkout to save money!
                                </p>
                                <button className="w-full mt-4 flex items-center justify-center space-x-2 text-xs font-bold text-primary-500 border border-primary-500/20 py-2 rounded-lg hover:bg-primary-500/10 transition-colors uppercase tracking-widest">
                                    <span>Visit Store</span>
                                    <FiExternalLink />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
