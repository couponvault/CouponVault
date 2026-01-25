'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/ui/CouponCard';
import { FiGift, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
                toast.success('🎉 Coupon claimed successfully!');
            }
        } catch (error: any) {
            setError(error.message);
            toast.error(error.message || 'Failed to fetch coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6 float">
                            <FiGift className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            Get a <span className="gradient-text">Random Coupon</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Click the button below to receive a random verified coupon code
                        </p>
                        {remaining !== null && (
                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
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
                                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner w-6 h-6"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiGift className="w-6 h-6" />
                                        <span>Generate Random Coupon</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="glass-card p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-8">
                            <div className="flex items-start space-x-3">
                                <FiAlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                                        Oops!
                                    </h3>
                                    <p className="text-red-800 dark:text-red-300">{error}</p>
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
                                    onClick={() => {
                                        setCoupon(null);
                                        setError(null);
                                    }}
                                    className="inline-flex items-center space-x-2 px-6 py-3 glass-card hover:shadow-card-hover rounded-lg font-semibold transition-all duration-300"
                                >
                                    <FiRefreshCw className="w-5 h-5" />
                                    <span>Get Another Coupon</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* How it Works */}
                    <div className="mt-16 glass-card p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
                        <div className="space-y-4">
                            {[
                                { step: '1', title: 'Click Generate', description: 'Click the button to get a random coupon' },
                                { step: '2', title: 'Copy Code', description: 'Copy the coupon code to your clipboard' },
                                { step: '3', title: 'Apply & Save', description: 'Use the code at checkout and enjoy savings' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full flex items-center justify-center font-bold">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Daily Limit Notice */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                            <strong>Note:</strong> You can claim up to 10 coupons per day
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
