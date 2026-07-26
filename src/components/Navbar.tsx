'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX, FiArrowLeft } from 'react-icons/fi';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/platforms', label: 'Top Stores' },
        { href: '/categories', label: 'Categories' },
        { href: '/random', label: 'Daily Deals' },
        { href: '/about', label: 'Community' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-appleBorder">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Back Button + Logo */}
                    <div className="flex items-center">
                        {pathname !== '/' && (
                            <button 
                                onClick={() => router.back()} 
                                className="flex items-center space-x-1 text-appleMuted hover:text-appleBlue transition-colors mr-4 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline text-sm font-medium">Back</span>
                            </button>
                        )}
                        <Link href="/" className="flex items-center space-x-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-appleBlue flex items-center justify-center">
                                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Outfit' }}>S</span>
                            </div>
                            <span className="text-lg font-bold tracking-[0.2em] text-appleText uppercase" style={{ fontFamily: 'Outfit' }}>
                                CouponVault
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-7">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-appleMuted hover:text-appleBlue transition-colors text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-appleMuted hover:text-appleBlue transition-colors"
                    >
                        {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-appleBorder bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 rounded-lg text-appleMuted hover:text-appleBlue hover:bg-gray-100 transition-colors text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
