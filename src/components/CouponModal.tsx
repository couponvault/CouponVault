'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BrandLogo from '@/components/ui/BrandLogo';

interface CouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    coupon: any;
    platform: any;
}

export default function CouponModal({ isOpen, onClose, coupon, platform }: CouponModalProps) {
    const [copied, setCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !coupon || !platform) return null;

    const handleCopy = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            toast.success('Code copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRedirect = () => {
        // Simulate affiliate redirect
        toast.loading('Redirecting to store...', { duration: 1500 });
        setTimeout(() => {
            window.open(`https://www.${platform.slug}.com`, '_blank');
        }, 1500);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-appleBorder rounded-2xl shadow-xl overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-appleBorder/50 bg-white">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg"
                                style={{ backgroundColor: platform.backgroundColor, color: platform.textColor }}
                            >
                                <BrandLogo name={platform.name} logo={platform.logo} slug={platform.slug} />
                            </div>
                            <div>
                                <h3 className="font-bold text-appleText">{platform.name}</h3>
                                <p className="text-xs text-appleMuted">Verified Deal</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            aria-label="Close modal"
                            className="p-2 text-appleMuted hover:text-appleText bg-appleCard hover:bg-gray-200 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-appleBlue outline-none"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="p-6 text-center">
                        <div className="inline-block px-3 py-1 mb-4 bg-success/10 border border-success/20 text-success rounded-full text-xs font-bold tracking-wide" dangerouslySetInnerHTML={{ __html: coupon.title || (coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : coupon.discountType === 'fixed' ? `${coupon.currency || '$'}${coupon.discountValue} OFF` : coupon.discountType === 'freeShipping' ? 'Free Shipping' : coupon.discountType === 'bogo' ? 'Buy 1 Get 1 Free' : 'Special Deal') }} />
                        
                        {coupon.code.startsWith('DEAL-') ? (
                            <>
                                <h2 className="text-xl font-bold text-appleText mb-4">
                                    Deal Activated Successfully!
                                </h2>
                                <p className="text-appleMuted text-sm mb-6 max-w-sm mx-auto">
                                    Your deal has been activated. You can now shop directly on the store. No coupon code is required at checkout.
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-appleText mb-4">
                                    Copy this code and use it at checkout
                                </h2>
                                
                                <div className="relative mb-2">
                                    <div className="bg-appleBg border-2 border-dashed border-appleBorder rounded-xl p-4 flex items-center justify-between group">
                                        <span className="font-mono text-lg sm:text-2xl font-bold tracking-wider text-appleText select-all">
                                            {coupon.code}
                                        </span>
                                        <button 
                                            disabled={isProcessing}
                                            onClick={handleCopy}
                                            aria-label="Copy code"
                                            className="w-12 h-12 flex items-center justify-center bg-appleBlue text-white rounded-xl shadow-sm hover:shadow-md hover:bg-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-appleBlue outline-none"
                                        >
                                            {isProcessing ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : copied ? <FiCheck className="w-6 h-6" /> : <FiCopy className="w-6 h-6" />}
                                        </button>
                                    </div>
                                    {copied && (
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-success text-xs font-semibold animate-fade-in whitespace-nowrap">
                                            Code copied to clipboard!
                                        </div>
                                    )}
                                </div>
                                <p className="text-appleMuted text-sm mt-3 mb-6">Click the copy button to copy</p>
                            </>
                        )}

                        <div className="flex justify-center gap-4 text-sm mb-6">
                            <div className="bg-appleCard px-4 py-2 rounded-xl border border-appleBorder/50">
                                <span className="text-appleMuted block text-xs">Used</span>
                                <span className="font-bold text-appleText">{100 + (coupon.code.length * 7)} times</span>
                            </div>
                            <div className="bg-appleCard px-4 py-2 rounded-xl border border-appleBorder/50">
                                <span className="text-appleMuted block text-xs">Success Rate</span>
                                <span className="font-bold text-success">98%</span>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white border-t border-appleBorder/50">
                        <button 
                            onClick={handleRedirect}
                            className="btn-glow w-full py-3.5 bg-appleBlue text-white font-semibold text-base rounded-xl transition-all flex items-center justify-center space-x-2"
                        >
                            Go to {platform.name} <FiExternalLink />
                        </button>
                        <p className="text-center text-xs text-appleMuted mt-3">
                            A new tab will open with the store's website
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
