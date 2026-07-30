import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold font-display mb-8">
                        Privacy <span className="gradient-text">Policy</span>
                    </h1>

                    <div className="glass-card p-8 rounded-2xl prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-sm text-gray-500">Last updated: January 26, 2026</p>

                        <h2>Introduction</h2>
                        <p>
                            CouponVault ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our coupon distribution platform.
                        </p>

                        <h2>Information We Collect</h2>

                        <h3>Information You Provide</h3>
                        <ul>
                            <li>Contact information (only when you voluntarily reach out to us via email or forms)</li>
                            <li>We <strong>do not</strong> require you to create an account, and we do not collect passwords or force you to sign up to use our coupons.</li>
                        </ul>

                        <h3>Automatically Collected Information</h3>
                        <ul>
                            <li>IP address and browser information</li>
                            <li>Coupon claim history</li>
                            <li>Usage patterns and statistics</li>
                            <li>Device information</li>
                        </ul>

                        <h2>How We Use Your Information</h2>
                        <p>We use collected information to:</p>
                        <ul>
                            <li>Provide and maintain our coupon distribution service</li>
                            <li>Process and track coupon claims</li>
                            <li>Prevent fraud and abuse</li>
                            <li>Improve our platform and user experience</li>
                            <li>Send important updates and notifications</li>
                            <li>Analyze usage patterns and optimize performance</li>
                        </ul>

                        <h2>Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your information:
                        </p>
                        <ul>
                            <li>HTTPS encryption for all data transmission</li>
                            <li>Rate limiting and anti-abuse protection</li>
                            <li>Regular security audits of our infrastructure</li>
                        </ul>

                        <h2>Data Sharing</h2>
                        <p>
                            We do not sell your personal information. We may share information only in these circumstances:
                        </p>
                        <ul>
                            <li>With your explicit consent</li>
                            <li>To comply with legal obligations</li>
                            <li>To protect our rights and prevent fraud</li>
                            <li>With service providers who assist in operations (under strict confidentiality)</li>
                        </ul>

                        <h2>Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar technologies for authentication, preferences, and analytics.
                        </p>

                        <h3>Google AdSense and DoubleClick Cookie</h3>
                        <p>
                            Google, as a third-party vendor, uses cookies to serve ads on CouponVault. Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our site or other sites on the Internet.
                        </p>
                        <p>
                            Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> page.
                        </p>

                        <h3>Third-Party Advertising</h3>
                        <p>
                            We allow third-party companies to serve ads and/or collect certain anonymous information when you visit our web site. These companies may use non-personally identifiable information (e.g., click stream information, browser type, time and date, subject of advertisements clicked or scrolled over) during your visits to this and other web sites in order to provide advertisements about goods and services likely to be of greater interest to you.
                        </p>

                        <h2>Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Export your data</li>
                        </ul>

                        <h2>Data Retention</h2>
                        <p>
                            We retain your information as long as your account is active or as needed to provide services. You can request deletion at any time through your account settings or by contacting us.
                        </p>

                        <h2>Children's Privacy</h2>
                        <p>
                            Our service is not intended for users under 13 years of age. We do not knowingly collect information from children under 13.
                        </p>

                        <h2>Changes to Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy periodically. Significant changes will be highlighted through announcements on our platform.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <p>
                            Email: privacy@couponvault.com<br />
                            Website: <a href="/contact">Contact Form</a>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
