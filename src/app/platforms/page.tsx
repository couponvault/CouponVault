'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlatformCard from '@/components/ui/PlatformCard';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import NativeAd from '@/components/ui/NativeAd';

export default function PlatformsPage() {
    const router = useRouter();
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'All Platforms' },
        { value: 'ecommerce', label: 'E-Commerce' },
        { value: 'streaming', label: 'Streaming' },
        { value: 'food', label: 'Food & Delivery' },
        { value: 'travel', label: 'Travel' },
        { value: 'fashion', label: 'Fashion' },
        { value: 'other', label: 'Other' },
    ];

    useEffect(() => {
        fetchPlatforms();
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const q = params.get('q');
            if (q) {
                setSearchQuery(q);
            }
        }
    }, []);

    const fetchPlatforms = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/platforms?active=true');
            const data = await response.json();

            if (data.success) {
                setPlatforms(data.platforms);
            } else {
                setError('Failed to load platforms');
            }
        } catch (err) {
            setError('Error loading platforms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredPlatforms = platforms.filter(platform => {
        const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (platform.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handlePlatformClick = (slug: string) => {
        router.push(`/platforms/${slug}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-appleBg">
            <Navbar />

            <main className="flex-1 py-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-appleText mb-4 font-display tracking-tight">
                            Explore <span className="gradient-text">Top Stores</span>
                        </h1>
                        <p className="text-appleMuted text-lg max-w-xl mx-auto">
                            Choose your favorite store and get exclusive coupons verified by our community.
                        </p>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="max-w-3xl mx-auto mb-10 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            {loading ? (
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-appleMuted/30 border-t-appleBlue rounded-full animate-spin" />
                            ) : (
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-appleMuted group-focus-within:text-appleBlue transition-colors duration-300" />
                            )}
                            <input
                                type="text"
                                placeholder="Looking for a specific store or brand?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (!searchQuery.trim()) {
                                            toast.error('Please enter a valid search term');
                                            return;
                                        }
                                        if (filteredPlatforms.length === 1) {
                                            router.push(`/platforms/${filteredPlatforms[0].slug}`);
                                        } else if (filteredPlatforms.length === 0) {
                                            toast.error('No stores found matching your search');
                                        } else {
                                            e.currentTarget.blur();
                                        }
                                    }
                                }}
                                className="w-full bg-white border border-appleBorder text-appleText pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-appleBlue focus:ring-[3px] focus:ring-appleBlue/20 transition-all duration-300 shadow-sm focus:shadow-md hover:border-appleBorder/80 placeholder-appleMuted focus:-translate-y-0.5"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${selectedCategory === cat.value
                                    ? 'bg-appleText text-white shadow-md hover:-translate-y-0.5'
                                    : 'bg-white border border-appleBorder text-appleMuted hover:text-appleText hover:border-appleText/30 hover:-translate-y-0.5'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-8 border-b border-appleBorder pb-4">
                        <h2 className="text-xl font-bold text-appleText">Store Directory</h2>
                        <div className="text-appleMuted text-sm font-medium bg-appleCard px-4 py-1.5 rounded-full">
                            {filteredPlatforms.length} {filteredPlatforms.length === 1 ? 'Store' : 'Stores'}
                        </div>
                    </div>

                    <div className="mb-10">
                        <NativeAd />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {[...Array(18)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center bg-white border border-appleBorder/60 rounded-2xl p-5 sm:p-6 isolate h-full animate-pulse">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.25rem] bg-appleCard mb-5" />
                                    <div className="h-4 bg-appleCard w-3/4 rounded mb-2" />
                                    <div className="h-6 bg-appleCard w-1/2 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-red-50 rounded-[2rem] border border-red-100 shadow-sm max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                ⚠️
                            </div>
                            <h3 className="text-2xl font-bold text-red-800 mb-3">Oops! Something went wrong</h3>
                            <p className="text-red-600/80 text-base mb-6">{error}</p>
                            <button 
                                onClick={fetchPlatforms}
                                className="px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredPlatforms.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                            {filteredPlatforms.map(platform => (
                                <PlatformCard
                                    key={platform._id}
                                    platform={platform}
                                    onClick={() => handlePlatformClick(platform.slug)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-appleBorder shadow-sm max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-appleCard rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔍</div>
                            <h3 className="text-2xl font-bold text-appleText mb-3">No stores found</h3>
                            <p className="text-appleMuted text-base">
                                We couldn't find any stores matching your current search or category filter.
                            </p>
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="mt-6 px-6 py-3 bg-appleBlue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
