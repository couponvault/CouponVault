'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
        setQuery(trend);
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (label: string) => {
        setQuery(label);
        setIsFocused(false);
    };

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
                            ? 'linear-gradient(135deg, rgba(216, 207, 188, 0.2), rgba(86, 84, 73, 0.4))'
                            : 'transparent',
                        filter: isFocused ? 'blur(12px)' : 'blur(0px)',
                        opacity: isFocused ? 1 : 0,
                    }}
                />

                {/* Input wrapper */}
                <div
                    className={`relative flex items-center bg-oliveDrab/10 rounded-2xl border transition-all duration-300 shadow-xl ${
                        isFocused
                            ? 'border-bone ring-2 ring-bone/30'
                            : 'border-oliveDrab hover:border-oliveDrab/80'
                    }`}
                >
                    {/* Search icon left */}
                    <div className="pl-5 md:pl-6 flex-shrink-0">
                        <FiSearch
                            className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                                isFocused ? 'text-floralWhite' : 'text-bone/70'
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
                        placeholder={PLACEHOLDERS[placeholderIndex]}
                        className={`w-full bg-transparent text-floralWhite text-base md:text-lg px-4 py-[18px] md:py-[20px] outline-none rounded-2xl transition-opacity duration-200 ${
                            placeholderFade ? 'placeholder-bone/50' : 'placeholder-transparent'
                        }`}
                        id="main-search"
                    />

                    {/* Clear button */}
                    {query && (
                        <button
                            onClick={clearQuery}
                            className="pr-3 pl-2 text-bone/70 hover:text-floralWhite transition-colors flex-shrink-0"
                            aria-label="Clear search"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    )}

                    {/* Keyboard hint */}
                    {!isFocused && !query && (
                        <div className="hidden md:flex items-center pr-5 flex-shrink-0">
                            <kbd className="px-2 py-1 bg-oliveDrab/20 border border-oliveDrab rounded-md text-bone/70 text-xs font-mono">
                                /
                            </kbd>
                        </div>
                    )}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-smokyBlack/95 backdrop-blur-md border border-oliveDrab rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {hasResults ? (
                            <div className="py-2 max-h-80 overflow-y-auto">
                                {stores.length > 0 && (
                                    <div>
                                        <p className="px-5 py-2 text-[10px] uppercase tracking-widest text-bone/60 font-semibold">Stores</p>
                                        {stores.map((s) => (
                                            <button
                                                key={s.label}
                                                onClick={() => handleSuggestionClick(s.label)}
                                                className="w-full text-left px-5 py-3 flex items-center space-x-3 hover:bg-oliveDrab/20 transition-colors group"
                                            >
                                                <span className="text-base group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
                                                <span className="text-bone group-hover:text-floralWhite transition-colors text-sm font-medium">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {coupons.length > 0 && (
                                    <div>
                                        <div className="mx-5 border-t border-oliveDrab my-1" />
                                        <p className="px-5 py-2 text-[10px] uppercase tracking-widest text-bone/60 font-semibold">Coupons</p>
                                        {coupons.map((s) => (
                                            <button
                                                key={s.label}
                                                onClick={() => handleSuggestionClick(s.label)}
                                                className="w-full text-left px-5 py-3 flex items-center space-x-3 hover:bg-oliveDrab/20 transition-colors group"
                                            >
                                                <span className="text-base group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
                                                <span className="text-bone group-hover:text-floralWhite transition-colors text-sm font-medium">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {categories.length > 0 && (
                                    <div>
                                        <div className="mx-5 border-t border-oliveDrab my-1" />
                                        <p className="px-5 py-2 text-[10px] uppercase tracking-widest text-bone/60 font-semibold">Categories</p>
                                        {categories.map((s) => (
                                            <button
                                                key={s.label}
                                                onClick={() => handleSuggestionClick(s.label)}
                                                className="w-full text-left px-5 py-3 flex items-center space-x-3 hover:bg-oliveDrab/20 transition-colors group"
                                            >
                                                <span className="text-base group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
                                                <span className="text-bone group-hover:text-floralWhite transition-colors text-sm font-medium">{s.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="py-8 px-5 text-center">
                                <p className="text-bone text-sm mb-4">No coupons found.</p>
                                <p className="text-bone/60 text-xs mb-4">Suggested Stores:</p>
                                <div className="flex items-center justify-center gap-2">
                                    {SUGGESTED_STORES.map((store) => (
                                        <button
                                            key={store}
                                            onClick={() => handleSuggestionClick(store)}
                                            className="px-4 py-1.5 bg-oliveDrab/10 border border-oliveDrab hover:border-bone rounded-full text-bone hover:text-floralWhite text-xs transition-all hover:-translate-y-0.5"
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
                <span className="text-bone text-sm mr-1 flex items-center font-medium">🔥 Trending</span>
                {TRENDING.map((trend) => (
                    <button
                        key={trend}
                        onClick={() => handleTrendingClick(trend)}
                        className="px-4 py-1.5 bg-oliveDrab/10 border border-oliveDrab rounded-full text-bone text-xs font-medium transition-all duration-200 hover:text-floralWhite hover:border-bone hover:-translate-y-0.5 hover:shadow-md"
                    >
                        {trend}
                    </button>
                ))}
            </div>
        </div>
    );
}
