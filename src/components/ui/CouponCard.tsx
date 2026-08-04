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
            category?: string;
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
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCopy = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            toast.success('Coupon code copied!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy code');
        } finally {
            setIsProcessing(false);
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
            className="group relative bg-white border border-appleBorder/60 rounded-2xl p-4 sm:p-5 flex flex-col h-full transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-1 cursor-pointer overflow-hidden isolate"
        >
            {/* Top color bar indicator */}
            <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: coupon.platform.backgroundColor || '#007AFF' }} />
            
            {/* Background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-appleBlue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            {/* Header: Logo + Name + Active Badge */}
            <div className="flex-none flex items-start justify-between mb-4 mt-1">
                <div className="flex items-center space-x-3 min-w-0">
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] flex items-center justify-center font-bold text-sm sm:text-base shadow-sm border border-appleBorder/40 overflow-hidden shrink-0 group-hover:shadow-md transition-all"
                        style={{ backgroundColor: coupon.platform.backgroundColor, color: coupon.platform.textColor }}
                    >
                        <BrandLogo name={coupon.platform.name} logo={coupon.platform.logo} slug={coupon.platform.slug} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-appleText text-sm sm:text-base tracking-wide truncate group-hover:text-appleBlue transition-colors">
                            {coupon.platform.name}
                        </span>
                        <div className="flex items-center space-x-1 mt-0.5">
                            <FiCheck className="text-success w-3 h-3" />
                            <span className="text-success font-semibold text-[10px] uppercase tracking-wider">Verified Working</span>
                        </div>
                    </div>
                </div>
                <span className="px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[10px] sm:text-xs font-bold text-green-700 shrink-0 shadow-sm mt-1">
                    ● Active
                </span>
            </div>

            {/* Inner Flexible Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Title / Description */}
                <h3 className="text-base sm:text-lg font-extrabold text-appleText mb-2 leading-snug line-clamp-2 min-h-[2.75rem]" dangerouslySetInnerHTML={{ __html: coupon.title || (coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : coupon.discountType === 'fixed' ? `${coupon.currency || '₹'}${coupon.discountValue} OFF` : coupon.discountType === 'freeShipping' ? 'Free Shipping' : coupon.discountType === 'bogo' ? 'Buy 1 Get 1 Free' : 'Special Deal') }} />
                
                <p className="text-xs sm:text-sm text-appleMuted mb-4 line-clamp-2 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: coupon.description || 'Apply this verified code at checkout' }} />

                {/* Meta Info (hidden on very small screens) */}
                <div className="hidden sm:flex flex-col space-y-2 mb-4 p-3 bg-appleCard/50 rounded-xl text-xs text-appleMuted border border-appleBorder/50 flex-none">
                    <div className="flex items-center justify-between">
                        <span>Category</span>
                        <span className="text-appleText capitalize font-medium">{coupon.platform.category || 'Sitewide'}</span>
                    </div>
                    {coupon.minPurchase !== undefined && coupon.minPurchase > 0 && (
                        <div className="flex items-center justify-between">
                            <span>Min. Order</span>
                            <span className="text-appleText font-medium">{coupon.currency || '$'}{coupon.minPurchase}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center text-[11px] sm:text-xs text-appleMuted mb-4 font-medium flex-none">
                    <span className="px-2 py-1 bg-appleCard rounded-md">
                        Expires: {new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>


            {/* Get Code Button */}
            <button
                onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isProcessing) return;
                    
                    if (onOpenModal) {
                        onOpenModal(coupon);
                    } else {
                        await handleCopy();
                    }
                }}
                disabled={isProcessing}
                className={`mt-auto w-full py-3 sm:py-3.5 font-bold text-sm rounded-xl text-white shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${coupon.code.startsWith('DEAL-') ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' : 'bg-gradient-to-r from-appleBlue to-blue-500 hover:from-blue-600 hover:to-blue-600'}`}
            >
                <div className="flex items-center justify-center space-x-2">
                    {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>{coupon.code.startsWith('DEAL-') ? 'Get Deal' : 'Show Coupon Code'}</span>
                            {!coupon.code.startsWith('DEAL-') && <FiCopy className="w-4 h-4 opacity-80" />}
                        </>
                    )}
                </div>
            </button>
        </div>
    );
}
