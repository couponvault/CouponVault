'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlatformCard from '@/components/ui/PlatformCard';
import { FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PlatformsPage() {
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
        window.location.href = `/platforms/${slug}`;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            Explore <span className="gradient-text">Platforms</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Choose your favorite platform and get exclusive coupons
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 space-y-4">
                        {/* Search */}
                        <div className="relative max-w-md mx-auto">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search platforms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 glass-card rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map(category => (
                                <button
                                    key={category.value}
                                    onClick={() => setSelectedCategory(category.value)}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category.value
                                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                            : 'glass-card hover:shadow-card-hover'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-center mb-6 text-gray-600 dark:text-gray-400">
                        Showing {filteredPlatforms.length} platform{filteredPlatforms.length !== 1 ? 's' : ''}
                    </div>

                    {/* Platforms Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="shimmer h-64 rounded-2xl"></div>
                            ))}
                        </div>
                    ) : filteredPlatforms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPlatforms.map(platform => (
                                <PlatformCard
                                    key={platform._id}
                                    platform={platform}
                                    onClick={() => handlePlatformClick(platform.slug)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold mb-2">No platforms found</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
