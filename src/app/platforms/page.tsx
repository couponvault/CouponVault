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
            platform.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handlePlatformClick = (slug: string) => {
        router.push(`/platforms/${slug}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-appleBg">
            <Navbar />

            <main className="flex-1 py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-bold text-appleText mb-3 font-display">
                            Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-appleBlue to-purple-500">Top Stores</span>
                        </h1>
                        <p className="text-appleMuted text-base">
                            Choose your favorite store and get exclusive coupons
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto mb-8 shadow-sm rounded-xl">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-appleMuted" />
                        <input
                            type="text"
                            placeholder="Search stores..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-appleBorder text-appleText text-sm pl-11 pr-4 py-3 rounded-xl outline-none focus:border-appleBlue/50 transition-colors placeholder-appleMuted"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${selectedCategory === cat.value
                                    ? 'bg-appleBlue text-white shadow-sm'
                                    : 'bg-white border border-appleBorder text-appleMuted hover:text-appleText hover:border-appleBlue/30'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <div className="text-center mb-6 text-appleMuted text-sm">
                        Showing {filteredPlatforms.length} store{filteredPlatforms.length !== 1 ? 's' : ''}
                    </div>

                    {/* Platforms Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-48 rounded-2xl bg-white border border-appleBorder animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredPlatforms.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {filteredPlatforms.map(platform => (
                                <PlatformCard
                                    key={platform._id}
                                    platform={platform}
                                    onClick={() => handlePlatformClick(platform.slug)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-appleBorder">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-appleText mb-2">No stores found</h3>
                            <p className="text-appleMuted text-sm">
                                Try adjusting your search or filter
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
