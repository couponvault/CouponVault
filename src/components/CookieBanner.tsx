'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookieConsent');
        if (!hasConsented) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-appleBorder p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
                <h3 className="text-appleText font-bold text-lg mb-1">We use cookies</h3>
                <p className="text-appleMuted text-sm">
                    This website uses cookies, including third-party advertising cookies from Google AdSense, to ensure you get the best experience on our website and to serve personalized ads. By continuing to use this site, you consent to our use of cookies. 
                    <Link href="/privacy" className="text-appleBlue hover:underline ml-1">
                        Learn more
                    </Link>
                </p>
            </div>
            <div className="flex gap-3 shrink-0">
                <button 
                    onClick={acceptCookies}
                    className="px-6 py-2.5 bg-appleBlue text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    Accept & Continue
                </button>
            </div>
        </div>
    );
}
