'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Successfully logged in!');
                // Redirect to admin if they are an admin
                if (data.user.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                toast.error(data.error || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-950">
                <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-2xl shadow-xl">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-glow">
                            <FiLogIn />
                        </div>
                        <h2 className="text-3xl font-extrabold font-display gradient-text">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to manage your CouponVault
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="admin@couponvault.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-glow transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-xs text-gray-500 italic">
                                Tip: Use the admin credentials from your setup guide
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
