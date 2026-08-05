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

                        <h2>Federal Trade Commission (FTC) Affiliate Disclosure</h2>
                        <p>
                            In compliance with the FTC guidelines, please assume the following about links and posts on this site: 
                            Any/all of the links on CouponVault are affiliate links of which we receive a small commission from sales of certain items, but the price is the same for you. As CouponVault has grown, so have costs associated with running and maintaining it, and affiliate links are a way we help offset these costs.
                        </p>
                        <p>
                            CouponVault is a participant in various affiliate programs, including but not limited to the Amazon Services LLC Associates Program, Skimlinks, ShareASale, and Impact Radius. These programs are designed to provide a means for sites to earn advertising fees by advertising and linking to partner merchants.
                        </p>
                        
                        <h2>Editorial Independence</h2>
                        <p>
                            While we maintain affiliate relationships with many of the merchants listed on this site, our editorial content is not influenced by affiliate partnerships. We do not accept payment for guaranteed placement of deals, nor do we let affiliate commission rates dictate which coupons we verify and publish. Our analysts evaluate promotions based purely on their validity and value to the consumer.
                        </p>

                        <h2>Coupon Accuracy and Merchant Discretion</h2>
                        <p>
                            Our dedicated team manually tests and verifies coupon codes daily. However, merchants reserve the right to alter or terminate promotions at any time without notice. Consequently, we cannot guarantee that any specific promotional code will remain active or be accepted at the point of checkout. All transactions are exclusively between the user and the merchant.
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
