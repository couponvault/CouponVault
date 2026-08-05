'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    slotId?: string;
    format?: 'banner' | 'square' | 'native';
    className?: string;
}

/**
 * Adsterra Ad Component
 * Safely injects Adsterra document.write scripts into a Next.js application
 * without destroying the DOM.
 */
export default function AdBanner({ slotId, format = 'square', className = '' }: AdBannerProps) {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bannerRef.current || !slotId) return;
        
        // Prevent multiple injections in React StrictMode
        if (bannerRef.current.firstChild) return;

        const conf = document.createElement('script');
        conf.type = 'text/javascript';
        
        let width = 300;
        let height = 250;
        
        if (format === 'banner') {
            width = 728;
            height = 90;
        }

        conf.innerHTML = `
            atOptions = {
                'key' : '${slotId}',
                'format' : 'iframe',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
            };
        `;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//www.highperformanceformat.com/${slotId}/invoke.js`;
        
        bannerRef.current.appendChild(conf);
        bannerRef.current.appendChild(script);

    }, [slotId, format]);

    if (!slotId) return null;

    return (
        <div className={`flex justify-center items-center w-full overflow-hidden min-h-[90px] ${className}`}>
            <div ref={bannerRef} />
        </div>
    );
}
