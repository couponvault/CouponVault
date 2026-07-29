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
        <footer className="bg-appleCard border-t border-appleBorder text-appleMuted mt-auto">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold text-appleText mb-3 font-display tracking-wider">CouponVault</h3>
                        <p className="text-appleMuted text-sm mb-4 leading-relaxed">
                            Your trusted source for exclusive discount codes and amazing deals from top brands.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="text-appleMuted hover:text-appleBlue transition-colors">
                                <FiTwitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="text-appleMuted hover:text-appleBlue transition-colors">
                                <FiGithub className="w-4 h-4" />
                            </a>
                            <a href="/contact" className="text-appleMuted hover:text-appleBlue transition-colors">
                                <FiMail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-appleText text-sm mb-3">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-appleMuted hover:text-appleBlue transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-appleText text-sm mb-3">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-appleMuted hover:text-appleBlue transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-appleText text-sm mb-3">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-appleMuted hover:text-appleBlue transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-appleBorder mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-appleMuted text-xs">
                        © {currentYear} CouponVault. All rights reserved.
                    </p>
                    <p className="text-appleMuted text-xs flex items-center mt-3 md:mt-0">
                        Made with <FiHeart className="w-3 h-3 mx-1 text-red-500" /> for savvy shoppers
                    </p>
                </div>
            </div>
        </footer>
    );
}
