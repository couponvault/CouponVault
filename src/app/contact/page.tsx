'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMail, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSending(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Message sent successfully! We\'ll get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(data.error || 'Failed to send message');
            }
        } catch (error) {
            toast.error('Error connecting to Server');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            Get in <span className="gradient-text">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Have questions? We'd love to hear from you!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="glass-card p-6 rounded-xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                                    <FiMail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email Us</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">couponvault.support@gmail.com</p>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Send us an email for general inquiries or support questions
                            </p>
                        </div>

                        <div className="glass-card p-6 rounded-xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <FiMessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Response Time</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Within 24 hours</p>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                We typically respond to all inquiries within one business day
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Your Name *
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 glass-card rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Your Email *
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 glass-card rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 glass-card rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Message *
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 glass-card rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                    placeholder="Tell us what's on your mind..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="spinner w-5 h-5"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSend className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
