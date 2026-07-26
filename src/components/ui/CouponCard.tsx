'use client';

import { useState } from 'react';
import { FiCopy, FiCheck, FiStar } from 'react-icons/fi';
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
                return `$${coupon.discountValue} OFF`;
            case 'freeShipping':
                return 'FREE SHIPPING';
            case 'bogo':
                return 'BUY 1 GET 1';
            default:
                return `${coupon.discountValue}% OFF`;
        }
    };

    return (
        <div className="bg-smokyBlack/90 border border-oliveDrab/30 rounded-2xl p-5 flex flex-col hover:border-bone/50 transition-colors">
            {/* Header: Logo + Name + Active Badge */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
                        style={{ backgroundColor: coupon.platform.backgroundColor, color: coupon.platform.textColor }}
                    >
                        {coupon.platform.logo || coupon.platform.name.charAt(0)}
                    </div>
                    <span className="font-bold text-white text-sm tracking-wider uppercase">
                        {coupon.platform.name}
                    </span>
                </div>
                <span className="px-3 py-1 bg-oliveDrab/20 border border-oliveDrab/40 rounded-full text-[11px] font-bold text-bone">
                    Active
                </span>
            </div>

            {/* Discount */}
            <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                {formatDiscount()} Your Entire Purchase
            </h3>

            {/* Verified + Code */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1.5 text-sm">
                    <FiCheck className="text-bone w-3.5 h-3.5" />
                    <span className="text-bone font-medium text-xs">Verified</span>
                    <span className="text-gray-500 mx-0.5">•</span>
                    <span className="text-gray-400 text-xs">Code: <span className="text-white font-mono font-medium">{coupon.code}</span></span>
                </div>
                <button onClick={handleCopy} className="p-1 hover:bg-white/5 rounded transition-colors">
                    {copied ? <FiCheck className="w-3.5 h-3.5 text-green-400" /> : <FiCopy className="w-3.5 h-3.5 text-gray-500" />}
                </button>
            </div>

            {/* Expiry */}
            <div className="flex items-center text-xs text-gray-500 mb-4">
                <span>Exp: {new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="mx-1.5">•</span>
                <button onClick={handleCopy} className="text-bone hover:text-floralWhite underline underline-offset-2 font-medium">Copy Code</button>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between mb-5 text-sm text-gray-500">
                <span>User Rating</span>
                <div className="flex items-center space-x-1">
                    <span className="font-bold text-white">4.9</span>
                    <FiStar className="text-yellow-500 w-3.5 h-3.5 fill-current" />
                </div>
            </div>

            {/* Get Code Button */}
            <button
                onClick={handleCopy}
                className="w-full py-2.5 bg-floralWhite text-smokyBlack font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
            >
                Get Code
            </button>
        </div>
    );
}
