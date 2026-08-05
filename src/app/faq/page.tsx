'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'How does CouponVault make money?',
            answer: 'Transparency is our core value. We partner with leading affiliate networks (such as Skimlinks, ShareASale, and Impact). When you click on a coupon link and make a purchase at a retailer\'s website, we may earn a small commission at no extra cost to you. This keeps our service free and pays our editorial team to manually verify deals.',
        },
        {
            question: 'How does CouponVault work?',
            answer: 'CouponVault automatically generates and curates verified coupon codes for various platforms. Our editorial team manually tests codes, and our algorithms track their success rates. Simply click "Get Code" or browse platforms to receive a working coupon code.',
        },
        {
            question: 'Are the coupons really free?',
            answer: 'Yes! All coupons on CouponVault are completely free. We don\'t charge users for accessing or using coupon codes. Our revenue comes entirely from retailer commissions.',
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
        <div className="min-h-screen flex flex-col bg-appleBg">
            <Navbar />

            <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-appleText mb-6 font-display tracking-tight">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h1>
                        <p className="text-lg md:text-xl text-appleMuted max-w-2xl mx-auto leading-relaxed">
                            Everything you need to know about CouponVault, our verification process, and how you can save more.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white border border-appleBorder/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 md:px-8 py-5 flex items-center justify-between text-left hover:bg-appleCard/50 transition-colors focus:outline-none"
                                >
                                    <span className="font-bold text-appleText text-lg pr-4">{faq.question}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openIndex === index ? 'bg-appleBlue text-white rotate-180' : 'bg-appleCard text-appleMuted'}`}>
                                        <FiChevronDown className="w-5 h-5" />
                                    </div>
                                </button>

                                {openIndex === index && (
                                    <div className="px-6 md:px-8 pb-6 text-appleMuted leading-relaxed animate-in slide-in-from-top-2 fade-in duration-300 border-t border-appleBorder/30 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-10 md:p-12 rounded-[2rem] text-center shadow-premium relative overflow-hidden isolate">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-appleBlue to-blue-500" />
                        <h2 className="text-2xl md:text-3xl font-extrabold text-appleText mb-4 font-display">Still have questions?</h2>
                        <p className="text-appleMuted text-lg mb-8 max-w-xl mx-auto">
                            Can't find the answer you're looking for? Our dedicated support team is here to help you get the most out of CouponVault.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center px-8 py-4 bg-appleBlue text-white font-bold text-lg rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95"
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
