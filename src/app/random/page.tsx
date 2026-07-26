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
        <div className="min-h-screen flex flex-col bg-appleBg">
            <Navbar />

            <main className="flex-1 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-appleBlue mb-6 shadow-md shadow-appleBlue/20">
                            <FiGift className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-appleText mb-4 font-display">
                            Get a <span className="text-appleBlue">Random Coupon</span>
                        </h1>
                        <p className="text-appleMuted text-base max-w-md mx-auto">
                            Click the button below to receive a random verified coupon code
                        </p>
                        {remaining !== null && (
                            <div className="mt-3 text-sm text-appleMuted">
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
                                className="px-8 py-3.5 bg-appleBlue text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto shadow-md"
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
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-appleBorder hover:border-appleBlue rounded-xl font-semibold text-appleText text-sm transition-colors shadow-sm"
                                >
                                    <FiRefreshCw className="w-4 h-4 text-appleBlue" />
                                    <span>Get Another Coupon</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* How it Works */}
                    <div className="mt-16 bg-white border border-appleBorder p-8 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6 text-center text-appleText font-display">How It Works</h2>
                        <div className="space-y-5">
                            {[
                                { step: '1', title: 'Click Generate', desc: 'Click the button to get a random coupon' },
                                { step: '2', title: 'Copy Code', desc: 'Copy the coupon code to your clipboard' },
                                { step: '3', title: 'Apply & Save', desc: 'Use the code at checkout and enjoy savings' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-9 h-9 bg-appleBg border border-appleBorder text-appleBlue rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-appleText text-sm mb-0.5">{item.title}</h3>
                                        <p className="text-appleMuted text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" className="my-10" />

                    {/* Daily Limit Notice */}
                    <div className="p-4 bg-appleCard border border-appleBorder rounded-xl shadow-sm">
                        <p className="text-sm text-appleMuted text-center">
                            <strong>Note:</strong> You can claim up to 10 coupons per day
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
