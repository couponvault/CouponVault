'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMonitor, FiShoppingBag, FiCoffee, FiMap, FiSmartphone, FiVideo } from 'react-icons/fi';
import AdBanner from '@/components/ui/AdBanner';

export default function CategoriesPage() {
    const categories = [
        { name: 'E-Commerce', icon: FiShoppingBag, count: 120, slug: 'ecommerce', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { name: 'Streaming', icon: FiVideo, count: 45, slug: 'streaming', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { name: 'Food & Delivery', icon: FiCoffee, count: 85, slug: 'food', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { name: 'Travel', icon: FiMap, count: 32, slug: 'travel', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        { name: 'Fashion', icon: FiMonitor, count: 150, slug: 'fashion', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { name: 'Electronics', icon: FiSmartphone, count: 65, slug: 'electronics', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0b0f]">
            <Navbar />

            <main className="flex-1 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display">
                            Shop by <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400">Category</span>
                        </h1>
                        <p className="text-gray-400 text-base max-w-xl mx-auto">
                            Browse through our extensive list of categories to find the best deals for exactly what you're looking for.
                        </p>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {categories.map((cat, i) => (
                            <Link 
                                href={`/platforms?category=${cat.slug}`} 
                                key={i}
                                className="group flex items-center p-6 bg-[#12131a] border border-white/5 hover:border-white/20 rounded-2xl transition-all hover:-translate-y-1 shadow-lg"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.border} border flex items-center justify-center mr-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <cat.icon className={`w-7 h-7 ${cat.color}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium">{cat.count} Active Deals</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <AdBanner slotId="150c3903e11298ce18dfe86139a7f4e0" format="square" />
                </div>
            </main>

            <Footer />
        </div>
    );
}
