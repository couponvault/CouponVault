'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'How does CouponVault work?',
            answer: 'CouponVault automatically generates verified coupon codes for various platforms. Simply click "Get Random Coupon" or browse platforms to receive an instant, working coupon code. Our system ensures all codes are valid and ready to use.',
        },
        {
            question: 'Are the coupons really free?',
            answer: 'Yes! All coupons on CouponVault are completely free. We don\'t charge users for accessing or using coupon codes. You can claim up to 10 coupons per day at no cost.',
        },
        {
            question: 'Why is there a daily limit on coupons?',
            answer: 'The daily limit of 10 coupons per day helps ensure fair distribution among all users and prevents abuse of the system. This way, everyone gets a chance to benefit from our coupon codes.',
        },
        {
            question: 'How often are new coupons added?',
            answer: 'Our system automatically generates fresh coupons daily for all active platforms. The coupon inventory is constantly updated to ensure availability and freshness.',
        },
        {
            question: 'Do I need to create an account?',
            answer: 'No account is required to access and use coupons! You can browse and claim working coupons immediately without ever signing up.',
        },
        {
            question: 'What if a coupon doesn\'t work?',
            answer: 'While our system ensures all coupons are valid at the time of generation, some may have platform-specific restrictions. If a code doesn\'t work, try getting another one. You can claim multiple coupons within your daily limit.',
        },
        {
            question: 'Which platforms do you support?',
            answer: 'We currently support top platforms including Amazon, Walmart, Target, Best Buy, Sephora, Macy\'s, Netflix, and many more. New platforms are added regularly.',
        },
        {
            question: 'Can I use multiple coupons on the same platform?',
            answer: 'This depends on the platform\'s terms and conditions. Most platforms allow one coupon code per order. Check the specific platform\'s coupon policy for details.',
        },
        {
            question: 'How long are coupons valid?',
            answer: 'Coupon validity varies by platform, typically ranging from 7 to 60 days. Each coupon displays its expiry date clearly. Use them before they expire!',
        },
        {
            question: 'Is my data safe?',
            answer: 'Yes! We take privacy seriously. We use industry-standard security measures including encryption, secure connections, and minimal data collection. We never share your personal information with third parties.',
        },
        {
            question: 'Can I suggest a new platform?',
            answer: 'Absolutely! We love hearing from our users. Contact us through our contact page with platform suggestions, and we\'ll consider adding them to our system.',
        },
        {
            question: 'How do you generate coupons?',
            answer: 'We use a sophisticated algorithm to generate unique, collision-free coupon codes. Each code is validated and tracked to ensure it hasn\'t been claimed before, providing you with fresh, working codes every time.',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Everything you need to know about CouponVault
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="glass-card rounded-xl overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                >
                                    <span className="font-semibold text-lg">{faq.question}</span>
                                    {openIndex === index ? (
                                        <FiChevronUp className="w-5 h-5 text-primary-500 flex-shrink-0 ml-4" />
                                    ) : (
                                        <FiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                                    )}
                                </button>

                                {openIndex === index && (
                                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed animate-slide-down">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 glass-card p-8 rounded-2xl text-center">
                        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-8 py-3 bg-appleBlue text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
