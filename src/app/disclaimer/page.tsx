import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold font-display mb-8">
                        Legal <span className="gradient-text">Disclaimer</span>
                    </h1>

                    <div className="glass-card p-8 rounded-2xl prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-sm text-gray-500">Last updated: January 26, 2026</p>

                        <h2>General Information</h2>
                        <p>
                            All the information on this website - https://coupon-vault-ultimate.vercel.app - is published in good faith and for general information purpose only. CouponVault does not make any warranties about the completeness, reliability and accuracy of this information.
                        </p>

                        <h2>No Professional Advice</h2>
                        <p>
                            Any action you take upon the information you find on this website (CouponVault), is strictly at your own risk. CouponVault will not be liable for any losses and/or damages in connection with the use of our website.
                        </p>

                        <h2>External Links Disclaimer</h2>
                        <p>
                            From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
                        </p>
                        <p>
                            Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.
                        </p>

                        <h2>Affiliate & Advertisement Disclaimer</h2>
                        <p>
                            This website may contain advertisements, sponsored content, paid insertions, affiliate links or other forms of monetization.
                        </p>
                        <p>
                            We follow word of mouth marketing standards. We believe in honesty of relationship, opinion and identity. The compensation received may influence the advertising content, topics or posts made in this blog. That content, advertising space or post will be clearly identified as paid or sponsored content.
                        </p>

                        <h2>Coupon Accuracy</h2>
                        <p>
                            CouponVault is a distribution platform. We do not create the coupons ourselves; we aggregate them from various sources and partner platforms. We do not guarantee that any coupon code listed on our site will be accepted by the merchant. Users are encouraged to verify the discount and terms on the merchant's checkout page.
                        </p>

                        <h2>Consent</h2>
                        <p>
                            By using our website, you hereby consent to our disclaimer and agree to its terms.
                        </p>

                        <h2>Update</h2>
                        <p>
                            Should we update, amend or make any changes to this document, those changes will be prominently posted here.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at:
                        </p>
                        <p>
                            Email: support@couponvault.com<br />
                            Website: <a href="/contact">Contact Form</a>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
