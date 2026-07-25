'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiGift, FiHome, FiGrid, FiShield, FiHelpCircle, FiMail, FiInfo } from 'react-icons/fi';

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
        <nav className="sticky top-0 z-50 bg-[#111317]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-500 overflow-hidden">
                            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Outfit' }}>S</span>
                        </div>
                        <span className="text-2xl font-bold tracking-widest text-white uppercase" style={{ fontFamily: 'Outfit' }}>
                            CouponVault
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA Placeholder (Removed Login/Signup) */}
                    <div className="hidden md:block w-[100px]"></div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                    >
                        {isOpen ? (
                            <FiX className="w-6 h-6" />
                        ) : (
                            <FiMenu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-dark-700 animate-slide-down">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                        <Link
                            href="/random"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300"
                        >
                            Get Random Coupon
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
