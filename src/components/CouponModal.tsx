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

    if (!isOpen || !coupon || !platform) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
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
                            className="p-2 text-appleMuted hover:text-appleText bg-appleCard hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 text-center">
                        <div className="inline-block px-3 py-1 mb-4 bg-success/10 border border-success/20 text-success rounded-full text-xs font-bold tracking-wide" dangerouslySetInnerHTML={{ __html: coupon.title || (coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : coupon.discountType === 'fixed' ? `${coupon.currency || '₹'}${coupon.discountValue} OFF` : coupon.discountType === 'freeShipping' ? 'Free Shipping' : coupon.discountType === 'bogo' ? 'Buy 1 Get 1 Free' : 'Special Deal') }} />
                        
                        <h2 className="text-xl font-bold text-appleText mb-4">
                            Copy this code and use it at checkout
                        </h2>

                        <div className="flex justify-center gap-4 text-sm mb-6">
                            <div className="bg-appleCard px-4 py-2 rounded-xl border border-appleBorder/50">
                                <p className="text-[10px] uppercase tracking-wider text-appleMuted mb-0.5">Category</p>
                                <span className="font-semibold text-appleText">{coupon.category || 'General'}</span>
                            </div>
                            <div className="bg-appleCard px-4 py-2 rounded-xl border border-appleBorder/50">
                                <p className="text-[10px] uppercase tracking-wider text-appleMuted mb-0.5">Min. Order</p>
                                <span className="font-semibold text-appleText">{coupon.minPurchase > 0 ? `$${coupon.minPurchase}` : 'Check Terms'}</span>
                            </div>
                        </div>

                        {/* Code Box */}
                        <div 
                            onClick={handleCopy}
                            className="relative group cursor-pointer w-full bg-white border-2 border-dashed border-appleBorder hover:border-appleBlue rounded-xl p-4 flex items-center justify-between transition-all"
                        >
                            <div className="flex-1 overflow-hidden">
                                <p className="font-mono text-2xl font-bold text-appleText tracking-widest truncate">{coupon.code}</p>
                            </div>
                            <div className={`p-2 rounded-lg transition-colors ${copied ? 'bg-success/20 text-success' : 'bg-appleCard text-appleMuted group-hover:bg-appleBlue group-hover:text-white'}`}>
                                {copied ? <FiCheck size={24} /> : <FiCopy size={24} />}
                            </div>
                        </div>
                        <p className="text-appleMuted text-sm mt-3">Click the code to copy</p>

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
