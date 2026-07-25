'use client';

import { useState } from 'react';
import { FiCopy, FiCheck, FiClock, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CouponCardProps {
    coupon: {
        code: string;
        platform: {
            name: string;
            logo?: string;
            backgroundColor: string;
            textColor: string;
        };
        discountType: string;
        discountValue: number;
        minPurchase?: number;
        maxDiscount?: number;
        description?: string;
        terms?: string;
        expiresAt: string;
    };
}

export default function CouponCard({ coupon }: CouponCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            toast.success('Coupon code copied!');
            
            // Trigger Adsterra Popunder / Affiliate Link on copy action
            window.open('https://www.adsterra.com', '_blank');
            
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy code');
        }
    };

    const formatDiscount = () => {
        switch (coupon.discountType) {
            case 'percentage':
                return `${coupon.discountValue}% OFF`;
            case 'fixed':
                return `₹${coupon.discountValue} OFF`;
            case 'freeShipping':
                return 'FREE SHIPPING';
            case 'bogo':
                return 'BUY 1 GET 1';
            default:
                return `${coupon.discountValue}% OFF`;
        }
    };

    const daysUntilExpiry = Math.ceil(
        (new Date(coupon.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="glass-card overflow-hidden p-5 flex flex-col group relative rounded-2xl hover:bg-white/10 transition-colors">
            {/* Top row: Logo, Brand Name, Active Badge */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner"
                        style={{ backgroundColor: coupon.platform.backgroundColor, color: coupon.platform.textColor }}
                    >
                        {coupon.platform.logo || coupon.platform.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-200 tracking-wide uppercase text-sm">
                        {coupon.platform.name}
                    </span>
                </div>
                <div className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full">
                    <span className="text-xs font-bold text-primary-400 tracking-wide">Active</span>
                </div>
            </div>

            {/* Discount Title */}
            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                {formatDiscount()} Your Entire Purchase
            </h3>

            {/* Code and Verified text */}
            <div className="flex items-center justify-between mb-1 mt-2">
                <div className="flex items-center space-x-1.5 text-sm">
                    <FiCheck className="text-primary-500 w-4 h-4" />
                    <span className="text-primary-500 font-medium">Verified</span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="text-gray-300">Code: <span className="font-mono text-white">{coupon.code}</span></span>
                </div>
                <button onClick={handleCopy} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors">
                    {copied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4 text-gray-400" />}
                </button>
            </div>

            {/* Expiry and Rating */}
            <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-400 flex items-center space-x-2">
                    <span>Exp: {new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <button onClick={handleCopy} className="text-primary-400 hover:text-primary-300 underline underline-offset-2">Copy Code</button>
                </div>
            </div>
            
            <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                <span>User Rating</span>
                <div className="flex items-center space-x-1">
                    <span className="font-bold text-white">4.9</span>
                    <FiStar className="text-yellow-500 w-4 h-4 fill-current" />
                </div>
            </div>

            {/* Get Code Button */}
            <div className="mt-auto">
                <button
                    onClick={handleCopy}
                    className="w-full py-3 bg-gradient-to-r from-secondary-600 to-primary-500 text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                >
                    Get Code
                </button>
            </div>
        </div>
    );
}
