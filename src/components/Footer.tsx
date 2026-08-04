'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiMail, FiHeart } from 'react-icons/fi';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Top Stores', href: '/platforms' },
            { label: 'Daily Deals', href: '/random' },
            { label: 'FAQ', href: '/faq' },
        ],
        company: [
            { label: 'Blog', href: '/blog' },
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy' },
        ],
        legal: [
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
            { label: 'Disclaimer', href: '/disclaimer' },
        ],
    };

    return (
        <footer className="bg-white border-t border-appleBorder text-appleMuted mt-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-appleCard/30 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                    {/* Brand & Newsletter (Spans 2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-extrabold text-appleText font-display tracking-widest uppercase">CouponVault</span>
                        </div>
                        <p className="text-appleMuted text-sm leading-relaxed max-w-sm">
                            Join over 50,000 smart shoppers who save money every day with our verified discount codes and exclusive deals.
                        </p>
                        
                        <div className="pt-4">
                            <h4 className="font-semibold text-appleText text-sm mb-3">Subscribe to Daily Deals</h4>
                            <form className="flex flex-col sm:flex-row max-w-sm gap-3 sm:gap-0" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="flex-1 px-4 py-3 bg-appleCard border border-appleBorder rounded-xl sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-appleBlue focus:border-transparent text-sm transition-all"
                                />
                                <button type="submit" className="px-6 py-3 bg-appleText text-white text-sm font-semibold rounded-xl sm:rounded-l-none hover:bg-appleBlue transition-colors shrink-0">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-appleText text-sm mb-5 tracking-wider uppercase">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-appleMuted hover:text-appleBlue hover:translate-x-1 inline-block transition-transform duration-200 text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-appleText text-sm mb-5 tracking-wider uppercase">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-appleMuted hover:text-appleBlue hover:translate-x-1 inline-block transition-transform duration-200 text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-appleText text-sm mb-5 tracking-wider uppercase">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-appleMuted hover:text-appleBlue hover:translate-x-1 inline-block transition-transform duration-200 text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-appleBorder mt-16 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-6">
                        <p className="text-appleMuted text-sm">
                            © {currentYear} CouponVault. All rights reserved.
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-5">
                        <a href="#" aria-label="Twitter" className="p-2 bg-appleCard hover:bg-appleBlue hover:text-white rounded-full text-appleMuted transition-all duration-300">
                            <FiTwitter className="w-4 h-4" />
                        </a>
                        <a href="#" aria-label="GitHub" className="p-2 bg-appleCard hover:bg-appleBlue hover:text-white rounded-full text-appleMuted transition-all duration-300">
                            <FiGithub className="w-4 h-4" />
                        </a>
                        <a href="/contact" aria-label="Contact Us" className="p-2 bg-appleCard hover:bg-appleBlue hover:text-white rounded-full text-appleMuted transition-all duration-300">
                            <FiMail className="w-4 h-4" />
                        </a>
                    </div>
                    
                    <p className="text-appleMuted text-sm flex items-center">
                        Made with <FiHeart className="w-4 h-4 mx-1.5 text-error fill-error/20" /> for savvy shoppers
                    </p>
                </div>
            </div>
        </footer>
    );
}
