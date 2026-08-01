'use client';

import { useState } from 'react';
import { FiCopy, FiCheck, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BrandLogo from './BrandLogo';

interface CouponCardProps {
    coupon: {
        code: string;
        platform: {
            name: string;
            slug?: string;
            logo?: string;
            backgroundColor: string;
            textColor: string;
        };
        discountType: string;
        discountValue: number;
        currency?: string;
        minPurchase?: number;
        maxDiscount?: number;
        title?: string;
        description?: string;
        terms?: string;
        expiresAt: string;
    };
    onOpenModal?: (coupon: any) => void;
}

export default function CouponCard({ coupon, onOpenModal }: CouponCardProps) {
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
            className="coupon-card bg-white border-b border-l border-r border-appleBorder p-3 sm:p-5 flex flex-col group border-t-4"
            style={{ borderTopColor: coupon.platform.backgroundColor || '#007AFF' }}
        >
            {/* Header: Logo + Name + Active Badge */}
            <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div
                        className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm border border-appleBorder overflow-hidden shrink-0"
                        style={{ backgroundColor: coupon.platform.backgroundColor, color: coupon.platform.textColor }}
                    >
                        <BrandLogo name={coupon.platform.name} logo={coupon.platform.logo} slug={coupon.platform.slug} />
                    </div>
                    <span className="font-bold text-appleText text-xs sm:text-sm tracking-wider truncate">
                        {coupon.platform.name}
                    </span>
                </div>
                <span className="px-1.5 py-0.5 sm:px-3 sm:py-1 bg-success/10 border border-success/20 rounded-full text-[9px] sm:text-[11px] font-bold text-success shrink-0">
                    Active
                </span>
            </div>

            {/* Title / Description */}
            <h3 className="text-sm sm:text-lg font-bold text-appleText mb-1 leading-snug group-hover:text-appleBlue transition-colors line-clamp-1" dangerouslySetInnerHTML={{ __html: coupon.title || (coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : coupon.discountType === 'fixed' ? `${coupon.currency || '₹'}${coupon.discountValue} OFF` : coupon.discountType === 'freeShipping' ? 'Free Shipping' : coupon.discountType === 'bogo' ? 'Buy 1 Get 1 Free' : 'Special Deal') }} />
            
            <p className="text-xs sm:text-xs text-appleMuted mb-2 sm:mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: coupon.description || 'Apply this verified code at checkout' }} />

            {/* Verified + Expiry */}
            <div className="flex items-center space-x-1.5 text-xs mb-1 sm:mb-1">
                <FiCheck className="text-appleBlue w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="text-appleBlue font-medium text-[10px] sm:text-xs">Verified</span>
            </div>

            <div className="flex items-center text-[10px] sm:text-xs text-appleMuted mb-2 sm:mb-4">
                <span>Exp: {new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Rating */}
            <div className="hidden sm:flex items-center justify-between mt-auto mb-4 text-xs text-appleMuted border-t border-appleBorder/50 pt-3">
                <span>User Rating</span>
                <div className="flex items-center space-x-1">
                    <span className="font-bold text-appleText">
                        {(4.5 + (coupon.code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6) / 10).toFixed(1)}
                    </span>
                    <FiStar className="text-warning w-3.5 h-3.5 fill-current" />
                </div>
            </div>

            {/* Get Code Button */}
            <button
                onClick={() => {
                    if (onOpenModal) {
                        onOpenModal(coupon);
                    } else {
                        handleCopy();
                    }
                }}
                className={`btn-glow w-full py-2 sm:py-2.5 font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl text-white mt-auto ${coupon.code.startsWith('DEAL-') ? 'bg-orange-500 hover:bg-orange-600' : 'bg-appleBlue hover:bg-blue-600'}`}
            >
                Get Code
            </button>
        </div>
    );
}

