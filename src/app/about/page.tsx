import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiInfo, FiTarget, FiHeart } from 'react-icons/fi';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            About <span className="gradient-text">CouponVault</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Your trusted source for verified discount codes
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiInfo className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                        CouponVault is a cutting-edge platform that automatically generates, manages, and distributes exclusive coupon codes for India's top e-commerce and service platforms. We leverage advanced technology to ensure you always have access to valid, working coupon codes.
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Our mission is to make online shopping more affordable for everyone by providing instant access to verified discount codes, eliminating the frustration of expired or invalid coupons.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiTarget className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
                                    <ul className="space-y-3">
                                        <li className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-600 dark:text-green-400">✓</span>
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-400">Auto-generated verified coupon codes</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-600 dark:text-green-400">✓</span>
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-400">Partner platforms including Amazon, Walmart, Target</span>
                                        </li>
                                        {['Daily fresh coupon updates', 'Smart distribution system', 'No manual code hunting required', 'Free for all users'].map((item, index) => (
                                            <li key={index} className="flex items-center space-x-3">
                                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-green-600 dark:text-green-400">✓</span>
                                                </div>
                                                <span className="text-gray-600 dark:text-gray-400">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-2xl">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiHeart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                        Unlike traditional coupon websites that rely on user-submitted codes, CouponVault uses an intelligent auto-generation system that creates and validates codes in real-time. This means:
                                    </p>
                                    <ul className="space-y-2">
                                        {[
                                            'Zero expired coupons',
                                            'Instant availability',
                                            'Fair distribution',
                                            'Anti-abuse protection',
                                            'Always up-to-date',
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                                                <span className="text-primary-500">→</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-2xl text-center bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10">
                            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                We're committed to helping you save money on every purchase. Our platform is constantly evolving to bring you the best coupon experience possible. Join thousands of satisfied users who save money every day with CouponVault!
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
