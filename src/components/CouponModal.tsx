'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
                    className="relative w-full max-w-md bg-[#151922] border border-[#2A3445] rounded-2xl shadow-2xl overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-[#2A3445] bg-[#0F131C]">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg"
                                style={{ backgroundColor: platform.backgroundColor, color: platform.textColor }}
                            >
                                {platform.logo || platform.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{platform.name}</h3>
                                <p className="text-xs text-[#94A3B8]">Verified Deal</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 text-[#94A3B8] hover:text-white bg-[#2A3445]/50 hover:bg-[#2A3445] rounded-full transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 text-center">
                        <div className="inline-block px-3 py-1 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold tracking-wide">
                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
                        </div>
                        
                        <h2 className="text-xl font-bold text-white mb-4">
                            Copy this code and use it at checkout
                        </h2>

                        <div className="flex justify-center gap-4 text-sm mb-6">
                            <div className="bg-[#2A3445]/30 px-4 py-2 rounded-xl border border-[#2A3445]/50">
                                <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Category</span>
                                <span className="font-semibold text-emerald-400 capitalize">{platform.category || 'Sitewide'}</span>
                            </div>
                            <div className="bg-[#2A3445]/30 px-4 py-2 rounded-xl border border-[#2A3445]/50">
                                <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Min. Order</span>
                                <span className="font-semibold text-cyan-400">{coupon.minPurchase > 0 ? `$${coupon.minPurchase}` : 'None'}</span>
                            </div>
                        </div>

                        {/* Code Box */}
                        <div 
                            onClick={handleCopy}
                            className="relative group cursor-pointer w-full bg-[#0B0F17] border-2 border-dashed border-[#2563EB]/50 hover:border-[#2563EB] rounded-xl p-4 flex items-center justify-between transition-all"
                        >
                            <span className="font-mono text-2xl font-bold tracking-widest text-white">
                                {coupon.code}
                            </span>
                            <div className={`p-2 rounded-lg transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#2563EB]/20 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white'}`}>
                                {copied ? <FiCheck size={24} /> : <FiCopy size={24} />}
                            </div>
                        </div>
                        <p className="text-[#94A3B8] text-sm mt-3">Click the code to copy</p>

                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-[#0F131C] border-t border-[#2A3445]">
                        <button 
                            onClick={handleRedirect}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20"
                        >
                            Go to {platform.name} <FiExternalLink />
                        </button>
                        <p className="text-xs text-center text-[#94A3B8] mt-3">
                            A new tab will open with the store's website
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
