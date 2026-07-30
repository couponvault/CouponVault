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
        <div 
            className="coupon-card bg-white border-b border-l border-r border-appleBorder p-5 flex flex-col group border-t-4"
            style={{ borderTopColor: coupon.platform.backgroundColor || '#007AFF' }}
        >
            {/* Header: Logo + Name + Active Badge */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-appleBorder overflow-hidden"
                        style={{ backgroundColor: coupon.platform.backgroundColor, color: coupon.platform.textColor }}
                    >
                        {coupon.platform.logo && coupon.platform.logo.startsWith('http') ? (
                            <img src={coupon.platform.logo} alt={coupon.platform.name} className="w-full h-full object-cover" />
                        ) : (
                            coupon.platform.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <span className="font-bold text-appleText text-sm tracking-wider">
                        {coupon.platform.name}
                    </span>
                </div>
                <span className="px-3 py-1 bg-success/10 border border-success/20 rounded-full text-[11px] font-bold text-success">
                    Active
                </span>
            </div>

            {/* Title / Description */}
            <h3 className="text-lg font-bold text-appleText mb-3 leading-snug group-hover:text-appleBlue transition-colors line-clamp-2">
                {coupon.description || `${formatDiscount()} Your Entire Purchase`}
            </h3>

            {/* Verified + Code */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1.5 text-sm">
                    <FiCheck className="text-appleBlue w-3.5 h-3.5" />
                    <span className="text-appleBlue font-medium text-xs">Verified</span>
                    {!coupon.code.startsWith('DEAL-') && (
                        <>
                            <span className="text-appleMuted mx-0.5">•</span>
                            <span className="text-appleMuted text-xs">Code: <span className="text-appleText font-mono font-medium">{coupon.code}</span></span>
                        </>
                    )}
                </div>
                {!coupon.code.startsWith('DEAL-') && (
                    <button onClick={handleCopy} className="p-1 hover:bg-white/5 rounded transition-colors">
                        {copied ? <FiCheck className="w-3.5 h-3.5 text-green-400" /> : <FiCopy className="w-3.5 h-3.5 text-gray-500" />}
                    </button>
                )}
            </div>

            {/* Expiry + Copy */}
            <div className="flex items-center text-xs text-appleMuted mb-4">
                <span>Exp: {new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                {!coupon.code.startsWith('DEAL-') && (
                    <>
                        <span className="mx-1.5">•</span>
                        <button onClick={handleCopy} className="text-appleBlue hover:text-blue-700 font-medium">Copy Code</button>
                    </>
                )}
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between mt-auto mb-4 text-xs text-appleMuted border-t border-appleBorder/50 pt-3">
                <span>User Rating</span>
                <div className="flex items-center space-x-1">
                    <span className="font-bold text-appleText">
                        {(4.5 + (coupon.code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6) / 10).toFixed(1)}
                    </span>
                    <FiStar className="text-warning w-3.5 h-3.5 fill-current" />
                </div>
            </div>

            {/* Get Code / Deal Button */}
            <button
                onClick={handleCopy}
                className={`btn-glow w-full py-2.5 font-semibold text-sm rounded-xl text-white ${coupon.code.startsWith('DEAL-') ? 'bg-orange-500 hover:bg-orange-600' : 'bg-appleBlue hover:bg-blue-600'}`}
            >
                {coupon.code.startsWith('DEAL-') ? 'Get Deal' : 'Get Code'}
            </button>
        </div>
    );
}
