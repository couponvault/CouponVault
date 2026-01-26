import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold font-display mb-8">
                        Terms of <span className="gradient-text">Service</span>
                    </h1>

                    <div className="glass-card p-8 rounded-2xl prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-sm text-gray-500">Last updated: January 26, 2026</p>

                        <h2>Agreement to Terms</h2>
                        <p>
                            By accessing CouponVault, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                        </p>

                        <h2>Use License</h2>
                        <p>
                            Permission is granted to temporarily access and use CouponVault for personal, non-commercial purposes subject to these restrictions:
                        </p>
                        <ul>
                            <li>You may not modify or copy the materials</li>
                            <li>You may not use the materials for commercial purposes</li>
                            <li>You may not attempt to decompile or reverse engineer any software</li>
                            <li>You may not remove copyright or proprietary notations</li>
                            <li>You may not transfer the materials to another person</li>
                        </ul>

                        <h2>Coupon Usage</h2>

                        <h3>Fair Use Policy</h3>
                        <p>To ensure fair access for all users:</p>
                        <ul>
                            <li>Maximum 10 coupons per user per day</li>
                            <li>Coupons are for personal use only</li>
                            <li>Bulk claiming or automated access is prohibited</li>
                            <li>Reselling coupons is strictly forbidden</li>
                        </ul>

                        <h3>Coupon Validity</h3>
                        <p>
                            While we strive to ensure all coupons work, we do not guarantee:
                        </p>
                        <ul>
                            <li>Acceptance by merchant platforms</li>
                            <li>Specific discount values</li>
                            <li>Availability at time of use</li>
                            <li>Compatibility with all products/services</li>
                        </ul>

                        <h2>User Accounts</h2>
                        <p>
                            When you create an account:
                        </p>
                        <ul>
                            <li>You must provide accurate information</li>
                            <li>You are responsible for maintaining account security</li>
                            <li>You must not share your account credentials</li>
                            <li>You must notify us of any unauthorized access</li>
                            <li>We reserve the right to terminate accounts that violate terms</li>
                        </ul>

                        <h2>Prohibited Activities</h2>
                        <p>You may not:</p>
                        <ul>
                            <li>Use automated systems to access the service</li>
                            <li>Attempt to bypass rate limiting or security measures</li>
                            <li>Interfere with the proper functioning of the platform</li>
                            <li>Use coupons for fraudulent purposes</li>
                            <li>Impersonate others or provide false information</li>
                            <li>Violate any applicable laws or regulations</li>
                        </ul>

                        <h2>Disclaimer</h2>
                        <p>
                            The materials on CouponVault are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                        </p>

                        <h2>Limitations</h2>
                        <p>
                            In no event shall CouponVault or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CouponVault.
                        </p>

                        <h2>Accuracy of Materials</h2>
                        <p>
                            The materials appearing on CouponVault could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current.
                        </p>

                        <h2>Links to Third Parties</h2>
                        <p>
                            CouponVault may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.
                        </p>

                        <h2>Modifications</h2>
                        <p>
                            CouponVault may revise these Terms of Service at any time without notice. By using this service, you agree to be bound by the current version of these terms.
                        </p>

                        <h2>Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                        </p>

                        <h2>Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>

                        <h2>Contact Information</h2>
                        <p>
                            Questions about the Terms of Service should be sent to us at:
                        </p>
                        <p>
                            Email: legal@couponvault.com<br />
                            Website: <a href="/contact">Contact Form</a>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
