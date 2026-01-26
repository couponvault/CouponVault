'use client';

import React from 'react';

interface AdBannerProps {
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'auto', className = '' }) => {
    return (
        <div className={`w-full overflow-hidden rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col items-center justify-center p-4 min-h-[100px] relative group transition-all duration-300 ${className}`}>
            {/* Disclaimer */}
            <div className="absolute top-1 right-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                ADVERTISEMENT
            </div>

            {/* Placeholder Content (Visible until code is added) */}
            {!slot ? (
                <div className="text-center py-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
                        Premium Ad Space Available
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                        Connect AdSense or Affiliate Network in Admin
                    </p>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    {/* This is where your Google AdSense code will go via an Effect/Script */}
                    <div className="text-gray-400 text-xs">Ad Slot: {slot}</div>
                </div>
            )}

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
    );
};

export default AdBanner;
