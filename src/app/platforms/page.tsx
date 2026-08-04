'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlatformCard from '@/components/ui/PlatformCard';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PlatformsPage() {
    const router = useRouter();
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
                toast.error('Failed to load platforms');
            }
        } catch (error) {
            toast.error('Error loading platforms');
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
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-appleMuted group-focus-within:text-appleBlue transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for your favorite store..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-appleBorder text-appleText pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-appleBlue/50 focus:ring-4 focus:ring-appleBlue/10 transition-all shadow-sm hover:shadow-md placeholder-appleMuted"
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

                    {/* Platforms Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {[...Array(18)].map((_, i) => (
                                <div key={i} className="h-56 rounded-3xl bg-appleCard border border-appleBorder animate-pulse"></div>
                            ))}
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
