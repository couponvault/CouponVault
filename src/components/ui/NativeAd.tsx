'use client';

import { useEffect, useRef } from 'react';

export default function NativeAd() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (containerRef.current.firstChild) return;

        // Setup container exactly as Adsterra requested
        const div = document.createElement('div');
        div.id = 'container-2f3f120cc58dbd153933e1e975c3e920';
        containerRef.current.appendChild(div);

        // Load Script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://pl30699560.effectivecpmnetwork.com/2f3f120cc58dbd153933e1e975c3e920/invoke.js';
        
        containerRef.current.appendChild(script);

    }, []);

    return (
        <div className="flex flex-col bg-white border border-appleBorder/60 rounded-2xl p-6 shadow-sm overflow-hidden min-h-[200px] items-center justify-center col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 w-full">
            <span className="text-[10px] text-appleMuted uppercase tracking-widest mb-2 font-semibold">Sponsored</span>
            <div ref={containerRef} className="w-full flex justify-center" />
        </div>
    );
}
