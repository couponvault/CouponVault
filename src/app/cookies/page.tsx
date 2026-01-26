import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold font-display mb-8">
                        Cookie <span className="gradient-text">Policy</span>
                    </h1>

                    <div className="glass-card p-8 rounded-2xl prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-sm text-gray-500">Last updated: January 26, 2026</p>

                        <h2>What Are Cookies</h2>
                        <p>
                            Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
                        </p>

                        <h2>How CouponVault Uses Cookies</h2>
                        <p>
                            When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
                        </p>
                        <ul>
                            <li>To enable certain functions of the Service</li>
                            <li>To provide analytics</li>
                            <li>To store your preferences</li>
                            <li>To enable advertisement delivery, including behavioral advertising</li>
                        </ul>

                        <h2>Types of Cookies We Use</h2>
                        <p>
                            We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:
                        </p>
                        <ul>
                            <li><strong>Essential cookies:</strong> We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
                            <li><strong>Preferences cookies:</strong> We may use preferences cookies to remember information that changes the way the Service behaves or looks, such as the "remember me" functionality or your preferred theme.</li>
                            <li><strong>Analytics cookies:</strong> We may use analytics cookies to track information on how the Service is used so that we can make improvements. We may also use analytics cookies to test new advertisements, pages, features or new functionality of the Service to see how our users react to them.</li>
                            <li><strong>Advertising cookies:</strong> These cookies are used by third-party vendors, including Google, to serve ads based on our users' previous visits to our website or other websites.</li>
                        </ul>

                        <h2>Your Choices Regarding Cookies</h2>
                        <p>
                            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
                        </p>
                        <p>
                            Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
                        </p>

                        <h2>Third-Party Cookies</h2>
                        <p>
                            In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. This includes Google AdSense, Vercel Analytics, and other partner networks.
                        </p>

                        <h2>More Information</h2>
                        <p>
                            If you have any questions about our Cookie Policy, please contact us at:
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
