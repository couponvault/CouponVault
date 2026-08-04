'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX, FiArrowLeft, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Handle scroll effect for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/platforms', label: 'Top Stores' },
        { href: '/categories', label: 'Categories' },
        { href: '/random', label: 'Daily Deals' },
        { href: '/blog', label: 'Blog' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-appleBorder shadow-sm py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12">
                    {/* Left: Back Button + Logo */}
                    <div className="flex items-center">
                        {pathname !== '/' && (
                            <button 
                                onClick={() => router.back()} 
                                className="group flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-appleCard/50 hover:bg-appleBorder transition-colors"
                                aria-label="Go Back"
                            >
                                <FiArrowLeft className="w-5 h-5 text-appleText group-hover:text-appleBlue transition-colors" />
                            </button>
                        )}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                <Image src="/logo.png" alt="CouponVault Logo" fill className="object-cover" priority sizes="36px" />
                            </div>
                            <span className="text-xl font-extrabold tracking-[0.15em] text-appleText uppercase font-display">
                                CouponVault
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive ? 'text-appleBlue bg-appleBlue/5' : 'text-appleMuted hover:text-appleText hover:bg-appleCard'}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/platforms" aria-label="Search" className="p-2 text-appleMuted hover:text-appleBlue hover:bg-appleCard rounded-full transition-all focus-visible:ring-2 focus-visible:ring-appleBlue outline-none">
                            <FiSearch className="w-5 h-5" />
                        </Link>
                        <Link href="/about" className="px-5 py-2.5 bg-appleText hover:bg-black text-white text-sm font-semibold rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                            Join Community
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden p-2 -mr-2 text-appleText hover:bg-appleCard rounded-full transition-colors"
                        aria-label="Open Menu"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[400px] bg-white z-[70] shadow-2xl flex flex-col md:hidden overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-appleBorder">
                                <span className="font-display font-bold tracking-wider uppercase text-lg">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close Menu"
                                    className="p-2 rounded-full bg-appleCard text-appleText hover:bg-appleBorder transition-colors focus-visible:ring-2 focus-visible:ring-appleBlue outline-none"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex-1 px-4 py-6 space-y-2">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-5 py-4 rounded-xl text-base font-semibold transition-all ${isActive ? 'bg-appleBlue/10 text-appleBlue' : 'text-appleText hover:bg-appleCard'}`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                                <Link
                                    href="/about"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-5 py-4 rounded-xl text-base font-semibold text-appleText hover:bg-appleCard transition-all"
                                >
                                    Community
                                </Link>
                            </div>

                            <div className="p-6 border-t border-appleBorder bg-appleCard/30">
                                <Link 
                                    href="/platforms" 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center space-x-2 w-full py-4 bg-appleBlue text-white font-bold rounded-xl shadow-md"
                                >
                                    <FiSearch className="w-5 h-5" />
                                    <span>Search Coupons</span>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
