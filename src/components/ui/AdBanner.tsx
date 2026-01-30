'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    slotId?: string;
    format?: 'banner' | 'square' | 'native';
    className?: string;
}

/**
 * Adsterra Ad Component
 * Usage: <AdBanner slotId="your_id_here" format="banner" />
 */
export default function AdBanner({ slotId, format = 'square', className = '' }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && slotId && containerRef.current) {
            // Clear any existing children
            containerRef.current.innerHTML = '';

            // Set the options directly on the window object to ensure they are available
            // before the script loads.
            // @ts-ignore
            if (!window.atOptions) window.atOptions = {};
            
            // @ts-ignore
            window.atOptions = {
                'key' : slotId,
                'format' : 'iframe',
                'height' : format === 'square' ? 250 : 90,
                'width' : format === 'square' ? 300 : 728,
                'params' : {}
            };

            // Create the invocation script
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true; 
            script.src = `//www.highperformanceformat.com/${slotId}/invoke.js`;
            
            // Error handling
            script.onerror = () => {
                console.error(`Adsterra script failed to load for slot ${slotId}`);
            };

            containerRef.current.appendChild(script);
        }
    }, [slotId, format]);

    const getDimensions = () => {
        switch (format) {
            case 'square': return 'min-h-[250px] w-full max-w-[300px] shadow-sm';
            default: return 'min-h-[90px] w-full max-w-[728px]';
        }
    };

    return (
        <div
            className={`ad-container mx-auto flex flex-col items-center justify-center my-8 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-dark-800/20 ${getDimensions()} ${className}`}
        >
            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">Advertisement</div>

            <div ref={containerRef} className="w-full h-full flex items-center justify-center min-h-[250px]">
                {/* Adsterra scripts will be injected here */}
                {!slotId && (
                    <div className="text-gray-400 text-xs italic">Ad Slot Ready</div>
                )}
            </div>
        </div>
    );
}
