'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/platforms', label: 'Top Stores' },
        { href: '/categories', label: 'Categories' },
        { href: '/random', label: 'Daily Deals' },
        { href: '/about', label: 'Community' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-smokyBlack/90 backdrop-blur-md border-b border-oliveDrab/30">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-floralWhite flex items-center justify-center">
                            <span className="text-smokyBlack font-bold text-lg" style={{ fontFamily: 'Outfit' }}>S</span>
                        </div>
                        <span className="text-lg font-bold tracking-[0.2em] text-floralWhite uppercase" style={{ fontFamily: 'Outfit' }}>
                            CouponVault
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-7">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-bone/70 hover:text-floralWhite transition-colors text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-bone/70 hover:text-floralWhite transition-colors"
                    >
                        {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-oliveDrab/30 bg-smokyBlack">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 rounded-lg text-bone/70 hover:text-floralWhite hover:bg-oliveDrab/10 transition-colors text-sm font-medium"
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
