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
        if (loading) return;
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/coupons/random');
            
            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error('No coupon available right now. Please try again later.');
            }

            if (response.status === 429) {
                const msg = data?.error || 'Daily limit reached. Come back tomorrow for more verified coupons.';
                setError(msg);
                return;
            }

            if (!response.ok) {
                throw new Error(data?.error || 'No coupon available right now. Please try again later.');
            }

            if (data?.success) {
                setCoupon(data.coupon);
                setRemaining(data.remaining);
                await navigator.clipboard.writeText(data.coupon.code);
                toast.success('🎉 Code copied to clipboard!');
            }
        } catch (err: any) {
            setError(err.message || 'No coupon available right now. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-appleBg">
            <Navbar />

            <main className="flex-1 py-16 px-4 md:px-8 relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-appleBlue/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-3xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-appleBlue to-blue-600 mb-8 shadow-premium transform hover:scale-105 transition-transform duration-300">
                            <FiGift className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-appleText mb-6 font-display tracking-tight">
                            Your <span className="gradient-text">Lucky Break</span>
                        </h1>
                        <p className="text-appleMuted text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                            Feeling lucky? Tap the button below to unlock a random, verified high-value coupon code.
                        </p>
                        {remaining !== null && (
                            <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-appleCard rounded-full border border-appleBorder/50">
                                <span className="relative flex h-3 w-3">
                                  <span className={remaining > 0 ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" : "absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"}></span>
                                  <span className={"relative inline-flex rounded-full h-3 w-3 " + (remaining > 0 ? "bg-success" : "bg-red-500")}></span>
                                </span>
                                <span className="text-sm font-semibold text-appleMuted">
                                    {remaining} {remaining === 1 ? 'attempt' : 'attempts'} remaining today
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Generate Button Area */}
                    {!coupon && (
                        <div className="text-center mb-12">
                            <button
                                onClick={fetchRandomCoupon}
                                disabled={loading}
                                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-appleBlue to-blue-600 text-white font-extrabold text-lg sm:text-xl rounded-[2rem] hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1 active:scale-95 overflow-hidden isolate"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out -z-10" />
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                        <span>Revealing Deal...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiRefreshCw className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-700 ease-out" />
                                        <span>Unlock Random Coupon</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl mb-10 shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <FiAlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-800 text-lg mb-1">
                                        {error.toLowerCase().includes('limit') ? 'Limit Reached' : 'Oops!'}
                                    </h3>
                                    <p className="text-red-600/80 text-sm leading-relaxed">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Coupon Display */}
                    {coupon && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="transform scale-105">
                                <CouponCard coupon={coupon} />
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={() => { setCoupon(null); setError(null); }}
                                    className="inline-flex items-center space-x-2 px-8 py-4 bg-white border-2 border-appleBorder/60 hover:border-appleBlue rounded-2xl font-bold text-appleText transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
                                >
                                    <FiRefreshCw className="w-5 h-5 text-appleBlue group-hover:rotate-180 transition-transform duration-500" />
                                    <span>Try Again</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* How it Works */}
                    <div className="mt-20 bg-white/70 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-premium">
                        <h2 className="text-2xl font-extrabold mb-10 text-center text-appleText font-display tracking-tight">How the Magic Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: '1', title: 'Tap to Spin', desc: 'Hit the unlock button to start the search.' },
                                { step: '2', title: 'Algorithm Magic', desc: 'We instantly find a high-value working code.' },
                                { step: '3', title: 'Copy & Save', desc: 'Code is copied instantly. Paste at checkout!' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className="w-14 h-14 bg-appleCard border border-appleBorder text-appleBlue rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm mb-5 group-hover:-translate-y-2 group-hover:shadow-md transition-all duration-300">
                                        {item.step}
                                    </div>
                                    <h3 className="font-bold text-appleText text-lg mb-2">{item.title}</h3>
                                    <p className="text-appleMuted text-sm leading-relaxed">{item.desc}</p>
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
