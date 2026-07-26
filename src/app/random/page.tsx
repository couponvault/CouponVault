'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/ui/CouponCard';
import { FiGift, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdBanner from '@/components/ui/AdBanner';

export default function RandomCouponPage() {
    const [coupon, setCoupon] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchRandomCoupon = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/coupons/random');
            const data = await response.json();

            if (response.status === 429) {
                setError(data.error);
                toast.error(data.error);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch coupon');
            }

            if (data.success) {
                setCoupon(data.coupon);
                setRemaining(data.remaining);
                await navigator.clipboard.writeText(data.coupon.code);
                toast.success('🎉 Code copied to clipboard!');
            }
        } catch (error: any) {
            setError(error.message);
            toast.error(error.message || 'Failed to fetch coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0b0f]">
            <Navbar />

            <main className="flex-1 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 mb-6 shadow-lg shadow-purple-500/20">
                            <FiGift className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display">
                            Get a <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Random Coupon</span>
                        </h1>
                        <p className="text-gray-400 text-base max-w-md mx-auto">
                            Click the button below to receive a random verified coupon code
                        </p>
                        {remaining !== null && (
                            <div className="mt-3 text-sm text-gray-500">
                                {remaining} coupons remaining today
                            </div>
                        )}
                    </div>

                    {/* Generate Button */}
                    {!coupon && (
                        <div className="text-center mb-8">
                            <button
                                onClick={fetchRandomCoupon}
                                disabled={loading}
                                className="px-8 py-3.5 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto shadow-lg shadow-purple-500/20"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiGift className="w-5 h-5" />
                                        <span>Generate Random Coupon</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/15 border border-red-500/20 p-5 rounded-xl mb-8">
                            <div className="flex items-start space-x-3">
                                <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-400 text-sm mb-1">Oops!</h3>
                                    <p className="text-red-300/70 text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Coupon Display */}
                    {coupon && (
                        <div className="space-y-6">
                            <CouponCard coupon={coupon} />
                            <div className="text-center">
                                <button
                                    onClick={() => { setCoupon(null); setError(null); }}
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-[#12131a] border border-white/5 hover:border-cyan-500/20 rounded-xl font-semibold text-white text-sm transition-colors"
                                >
                                    <FiRefreshCw className="w-4 h-4 text-cyan-400" />
                                    <span>Get Another Coupon</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* How it Works */}
                    <div className="mt-16 bg-[#12131a] border border-white/5 p-8 rounded-2xl">
                        <h2 className="text-xl font-bold mb-6 text-center text-white font-display">How It Works</h2>
                        <div className="space-y-5">
                            {[
                                { step: '1', title: 'Click Generate', desc: 'Click the button to get a random coupon' },
                                { step: '2', title: 'Copy Code', desc: 'Copy the coupon code to your clipboard' },
                                { step: '3', title: 'Apply & Save', desc: 'Use the code at checkout and enjoy savings' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-9 h-9 bg-[#0a0b0f] border border-white/10 text-cyan-400 rounded-full flex items-center justify-center font-bold text-sm">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-sm mb-0.5">{item.title}</h3>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" className="my-10" />

                    {/* Daily Limit Notice */}
                    <div className="p-4 bg-cyan-500/5 border border-cyan-500/15 rounded-xl">
                        <p className="text-sm text-cyan-400/80 text-center">
                            <strong>Note:</strong> You can claim up to 10 coupons per day
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
