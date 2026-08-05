'use client';

import { useEffect, useRef } from 'react';

export default function NativeAd() {
    const containerRef = useRef<HTMLDivElement>(null);
    const nativeAdId = process.env.NEXT_PUBLIC_NATIVE_AD_ID;

    useEffect(() => {
        if (!containerRef.current || !nativeAdId) return;
        if (containerRef.current.firstChild) return;

        // Native Ads from Adsterra usually look like:
        // <script async="async" data-cfasync="false" src="//pl.../invoke.js"></script>
        // <div id="container-ID"></div>
        
        // Setup container
        const div = document.createElement('div');
        div.id = `container-${nativeAdId}`;
        containerRef.current.appendChild(div);

        // Load Script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = `//www.highperformanceformat.com/${nativeAdId}/invoke.js`;
        
        containerRef.current.appendChild(script);

    }, [nativeAdId]);

    if (!nativeAdId) return null;

    return (
        <div className="flex flex-col bg-white border border-appleBorder/60 rounded-2xl p-6 shadow-sm overflow-hidden min-h-[200px] items-center justify-center col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 w-full">
            <span className="text-[10px] text-appleMuted uppercase tracking-widest mb-2 font-semibold">Sponsored</span>
            <div ref={containerRef} className="w-full flex justify-center" />
        </div>
    );
}
