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
                        <div className="glass-card p-8 rounded-2xl bg-white border border-appleBorder shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-appleBlue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiInfo className="w-6 h-6 text-appleBlue" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-appleText mb-4">About the Publisher</h2>
                                    <p className="text-appleMuted leading-relaxed mb-4">
                                        CouponVault is operated by an independent team of shopping experts and technology developers dedicated to bringing transparency to the digital coupon industry. Founded in 2026, our platform is built on the premise that consumers deserve verified, working deals without the clutter of expired codes.
                                    </p>
                                    <p className="text-appleMuted leading-relaxed mb-4">
                                        Our editorial team, led by seasoned retail analysts, manually curates and verifies promotional offers from hundreds of top global brands. We also publish original shopping guides, savings strategies, and product reviews to provide clear commercial value to our readers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-2xl bg-white border border-appleBorder shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiTarget className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-appleText mb-4">Our Editorial Policy</h2>
                                    <ul className="space-y-3">
                                        <li className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-600 font-bold">✓</span>
                                            </div>
                                            <span className="text-appleMuted">We only publish 100% original editorial content and shopping guides.</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-600 font-bold">✓</span>
                                            </div>
                                            <span className="text-appleMuted">All coupons are manually tested or sourced directly from certified merchant APIs.</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-600 font-bold">✓</span>
                                            </div>
                                            <span className="text-appleMuted">We strictly prohibit user-generated spam or scraped content.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-2xl bg-white border border-appleBorder shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiHeart className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-appleText mb-4">Contact & Transparency</h2>
                                    <p className="text-appleMuted leading-relaxed mb-4">
                                        Transparency is one of our core values. We actively partner with leading affiliate networks (including Skimlinks and ShareASale) to monetize our platform through legitimate CPA/CPS models. When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission.
                                    </p>
                                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="font-bold text-appleText mb-2">Operating Entity:</h3>
                                        <p className="text-sm text-appleMuted">CouponVault Operations Team</p>
                                        <p className="text-sm text-appleMuted">Email: couponvault.support@gmail.com</p>
                                        <p className="text-sm text-appleMuted">Website: https://couponvault.in</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
