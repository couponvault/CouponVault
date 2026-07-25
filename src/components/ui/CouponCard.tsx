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
        <div className="coupon-card glass-card overflow-hidden">
            {/* Header */}
            <div
                className="p-6"
                style={{
                    background: `linear-gradient(135deg, ${coupon.platform.backgroundColor} 0%, ${coupon.platform.backgroundColor}dd 100%)`,
                }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: coupon.platform.textColor,
                            }}
                        >
                            {coupon.platform.logo || coupon.platform.name.charAt(0)}
                        </div>
                        <div>
                            <h3
                                className="text-lg font-bold"
                                style={{ color: coupon.platform.textColor }}
                            >
                                {coupon.platform.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                                <FiTag className="w-4 h-4" style={{ color: coupon.platform.textColor, opacity: 0.8 }} />
                                <span
                                    className="text-sm font-semibold"
                                    style={{ color: coupon.platform.textColor, opacity: 0.9 }}
                                >
                                    {formatDiscount()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coupon Code */}
                <div className="relative">
                    <div
                        className="px-4 py-3 rounded-lg font-mono text-lg font-bold text-center tracking-wider backdrop-blur-sm"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            color: coupon.platform.backgroundColor,
                        }}
                    >
                        {coupon.code}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        {copied ? (
                            <FiCheck className="w-5 h-5 text-green-600" />
                        ) : (
                            <FiCopy
                                className="w-5 h-5"
                                style={{ color: coupon.platform.backgroundColor }}
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Details */}
            <div className="p-6">
                {coupon.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {coupon.description}
                    </p>
                )}

                {coupon.minPurchase && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>•</span>
                        <span>Min. purchase: ₹{coupon.minPurchase}</span>
                    </div>
                )}

                {coupon.maxDiscount && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>•</span>
                        <span>Max. discount: ₹{coupon.maxDiscount}</span>
                    </div>
                )}

                <div className={`flex items-center space-x-2 text-sm mt-4 ${daysUntilExpiry <= 3 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    <FiClock className="w-4 h-4" />
                    <span>
                        {daysUntilExpiry <= 0
                            ? 'Expires today!'
                            : `Expires in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}`}
                    </span>
                </div>

                <button
                    onClick={handleCopy}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                    <FiCopy className="w-5 h-5" />
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
            </div>
        </div>
    );
}
