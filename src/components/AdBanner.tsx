'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface AdBannerProps {
    slotId: string;
    format?: 'banner' | 'square' | 'native';
    className?: string;
}

/**
 * Adsterra Ad Component
 * Usage: <AdBanner slotId="your_id_here" format="banner" />
 */
export default function AdBanner({ slotId, format = 'banner', className = '' }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const getDimensions = () => {
        switch (format) {
            case 'square': return 'min-h-[250px] w-full max-w-[300px] shadow-sm';
            case 'native': return 'min-h-[200px] w-full';
            default: return 'min-h-[90px] w-full max-w-[728px]';
        }
    };

    return (
        <div
            className={`ad-container mx-auto flex flex-col items-center justify-center my-8 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-dark-800/20 ${getDimensions()} ${className}`}
        >
            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">Advertisement</div>

            <div id={`adsterra-${slotId}`} className="w-full h-full flex items-center justify-center">
                {/* We will use Next.js Script to load the Adsterra code here */}
                <script
                    type="text/javascript"
                    dangerouslySetInnerHTML={{
                        __html: `
                atOptions = {
                    'key' : '${slotId}',
                    'format' : 'iframe',
                    'height' : ${format === 'square' ? 250 : format === 'banner' ? 90 : 60},
                    'width' : ${format === 'square' ? 300 : format === 'banner' ? 728 : 468},
                    'params' : {}
                };
             `
                    }}
                />
                <script type="text/javascript" src={`//www.topcreativeformat.com/${slotId}/invoke.js`} async></script>
            </div>
        </div>
    );
}
