'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';

const PLACEHOLDERS = [
    'Search Amazon Coupons...',
    'Search Walmart Deals...',
    'Search Target Promo Codes...',
    'Search Best Buy Offers...',
    'Search Sephora Discounts...',
    'Search Macy\'s Offers...',
];

const TRENDING = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Sephora', 'Macy\'s', 'DoorDash'];

interface Suggestion {
    type: 'store' | 'coupon' | 'category';
    icon: string;
    label: string;
}

const ALL_SUGGESTIONS: Suggestion[] = [
    { type: 'store', icon: '🏪', label: 'Amazon' },
    { type: 'store', icon: '🏪', label: 'Walmart' },
    { type: 'store', icon: '🏪', label: 'Target' },
    { type: 'store', icon: '🏪', label: 'Best Buy' },
    { type: 'store', icon: '🏪', label: 'Sephora' },
    { type: 'store', icon: '🏪', label: 'DoorDash' },
    { type: 'store', icon: '🏪', label: 'Uber Eats' },
    { type: 'store', icon: '🏪', label: 'Expedia' },
    { type: 'store', icon: '🏪', label: 'Netflix' },
    { type: 'store', icon: '🏪', label: 'Macy\'s' },
    { type: 'coupon', icon: '🎟', label: 'Amazon Coupons' },
    { type: 'coupon', icon: '🎟', label: 'Walmart Bank Offers' },
    { type: 'coupon', icon: '🎟', label: 'Target Promo Codes' },
    { type: 'coupon', icon: '🎟', label: 'DoorDash First Order' },
    { type: 'coupon', icon: '🎟', label: 'Uber Eats Pro Deals' },
    { type: 'coupon', icon: '🎟', label: 'Sephora Sale Codes' },
    { type: 'category', icon: '📂', label: 'Fashion' },
    { type: 'category', icon: '📂', label: 'Food Delivery' },
    { type: 'category', icon: '📂', label: 'Electronics' },
    { type: 'category', icon: '📂', label: 'Streaming' },
    { type: 'category', icon: '📂', label: 'Travel' },
    { type: 'category', icon: '📂', label: 'Beauty & Health' },
];

const SUGGESTED_STORES = ['Amazon', 'Walmart', 'Target'];

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [placeholderFade, setPlaceholderFade] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Rotating placeholder
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderFade(false);
            setTimeout(() => {
                setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
                setPlaceholderFade(true);
            }, 200);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Keyboard shortcut: press "/" to focus
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filteredSuggestions = useCallback(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return ALL_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q));
    }, [query]);

    const suggestions = filteredSuggestions();
    const showDropdown = isFocused && query.trim().length > 0;
    const hasResults = suggestions.length > 0;

    const handleTrendingClick = (trend: string) => {
        router.push('/platforms?q=' + encodeURIComponent(trend));
    };

    const handleSuggestionClick = (label: string) => {
        router.push('/platforms?q=' + encodeURIComponent(label));
        setIsFocused(false);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) {
            if (e.key === 'Enter' && query.trim()) {
                router.push('/platforms?q=' + encodeURIComponent(query.trim()));
                setIsFocused(false);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                handleSuggestionClick(suggestions[selectedIndex].label);
            } else if (query.trim()) {
                router.push('/platforms?q=' + encodeURIComponent(query.trim()));
                setIsFocused(false);
            }
        } else if (e.key === 'Escape') {
            setIsFocused(false);
            setSelectedIndex(-1);
        }
    };

    // Reset selected index when query changes
    useEffect(() => {
        setSelectedIndex(-1);
    }, [query]);

    const clearQuery = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    // Group suggestions by type
    const stores = suggestions.filter((s) => s.type === 'store');
    const coupons = suggestions.filter((s) => s.type === 'coupon');
    const categories = suggestions.filter((s) => s.type === 'category');

    return (
        <div className="w-full">
            {/* Search Bar Container */}
            <div ref={containerRef} className="max-w-3xl mx-auto mb-8 relative">
                {/* Blue glow on focus */}
                <div
                    className="absolute -inset-[2px] rounded-2xl transition-all duration-500 pointer-events-none"
                    style={{
                        background: isFocused
                            ? 'linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(0, 122, 255, 0.05))'
                            : 'transparent',
                        filter: isFocused ? 'blur(12px)' : 'blur(0px)',
                        opacity: isFocused ? 1 : 0,
                    }}
                />

                {/* Input wrapper */}
                <div
                    className={`relative flex items-center bg-appleCard rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${
                        isFocused
                            ? 'border-appleBlue ring-2 ring-appleBlue/20 bg-white'
                            : 'border-appleBorder hover:border-gray-300'
                    }`}
                >
                    {/* Search icon left */}
                    <div className="pl-5 md:pl-6 flex-shrink-0">
                        <FiSearch
                            className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                                isFocused ? 'text-appleBlue' : 'text-appleMuted'
                            }`}
                        />
                    </div>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={handleSearchSubmit}
                        placeholder={PLACEHOLDERS[placeholderIndex]}
                        className={`w-full bg-transparent text-appleText text-base md:text-lg px-4 py-[18px] md:py-[20px] outline-none rounded-2xl transition-opacity duration-200 ${
                            placeholderFade ? 'placeholder-appleMuted/70' : 'placeholder-transparent'
                        }`}
                        id="main-search"
                    />

                    {/* Clear button */}
                    {query && (
                        <button
                            onClick={clearQuery}
                            className="pr-3 pl-2 text-appleMuted hover:text-appleText transition-colors flex-shrink-0"
                            aria-label="Clear search"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    )}

                    {/* Keyboard hint */}
                    {!isFocused && !query && (
                        <div className="hidden md:flex items-center pr-5 flex-shrink-0">
                            <kbd className="px-2 py-1 bg-white border border-appleBorder shadow-sm rounded-md text-appleMuted text-xs font-mono">
                                /
                            </kbd>
                        </div>
                    )}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-appleBorder rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {hasResults ? (
                            <div className="py-2 max-h-80 overflow-y-auto">
                                {stores.length > 0 && (
                                    <div>
                                        <p className="px-5 py-2 text-[10px] uppercase tracking-widest text-appleMuted font-semibold">Stores</p>
                                        {stores.map((s) => {
                                            const globalIndex = suggestions.findIndex(sug => sug.label === s.label);
                                            const isActive = globalIndex === selectedIndex;
                                            return (
                                                <button
                                                    key={s.label}
                                                    onClick={() => handleSuggestionClick(s.label)}
                                                    className={`w-full text-left px-5 py-3 flex items-center space-x-3 transition-colors group ${isActive ? 'bg-appleCard' : 'hover:bg-appleCard'}`}
                                                >
                                                    <span className="text-base group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
                                                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-appleBlue' : 'text-appleText group-hover:text-appleBlue'}`}>{s.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                {coupons.length > 0 && (
                                    <div>
                                        <div className="mx-5 border-t border-appleBorder my-1" />
                                        <p className="px-5 py-2 text-[10px] uppercase tracking-widest text-appleMuted font-semibold">Coupons</p>
                                        {coupons.map((s) => {
                                            const globalIndex = suggestions.findIndex(sug => sug.label === s.label);
                                            const isActive = globalIndex === selectedIndex;
                                            return (
                                                <button
                                                    key={s.label}
                                                    onClick={() => handleSuggestionClick(s.label)}
                                                    className={`w-full text-left px-5 py-3 flex items-center space-x-3 transition-colors group ${isActive ? 'bg-appleCard' : 'hover:bg-appleCard'}`}
                                                >
                                                    <span className="text-base group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
                                                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-appleBlue' : 'text-appleText group-hover:text-appleBlue'}`}>{s.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                {categories.length > 0 && (
                                    <div>
                                        <div className="mx-5 border-t border-appleBorder my-1" />
                                        <p className="px-5 py-2 text-[10px] uppercase tracking-widest text-appleMuted font-semibold">Categories</p>
                                        {categories.map((s) => {
                                            const globalIndex = suggestions.findIndex(sug => sug.label === s.label);
                                            const isActive = globalIndex === selectedIndex;
                                            return (
                                                <button
                                                    key={s.label}
                                                    onClick={() => handleSuggestionClick(s.label)}
                                                    className={`w-full text-left px-5 py-3 flex items-center space-x-3 transition-colors group ${isActive ? 'bg-appleCard' : 'hover:bg-appleCard'}`}
                                                >
                                                    <span className="text-base group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
                                                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-appleBlue' : 'text-appleText group-hover:text-appleBlue'}`}>{s.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="py-8 px-5 text-center">
                                <p className="text-appleText text-sm mb-4">No coupons found.</p>
                                <p className="text-appleMuted text-xs mb-4">Suggested Stores:</p>
                                <div className="flex items-center justify-center gap-2">
                                    {SUGGESTED_STORES.map((store) => (
                                        <button
                                            key={store}
                                            onClick={() => handleSuggestionClick(store)}
                                            className="px-4 py-1.5 bg-appleCard border border-appleBorder hover:border-appleBlue rounded-full text-appleText hover:text-appleBlue text-xs transition-all hover:-translate-y-0.5"
                                        >
                                            {store}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Trending Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                <span className="text-appleText text-sm mr-1 flex items-center font-medium">🔥 Trending</span>
                {TRENDING.map((trend) => (
                    <button
                        key={trend}
                        onClick={() => handleTrendingClick(trend)}
                        className="px-4 py-1.5 bg-white border border-appleBorder rounded-full text-appleText text-xs font-medium transition-all duration-200 hover:text-appleBlue hover:border-appleBlue hover:-translate-y-0.5 hover:shadow-sm"
                    >
                        {trend}
                    </button>
                ))}
            </div>
        </div>
    );
}
