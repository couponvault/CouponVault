'use client';
import Image from 'next/image';

import { useState } from 'react';

interface BrandLogoProps {
    name: string;
    logo?: string;
    slug?: string;
    className?: string;
}

// Extract domain from a clearbit URL or slug
function extractDomain(logo?: string, slug?: string): string | null {
    // Try to extract from clearbit URL like https://logo.clearbit.com/yatra.com
    if (logo && logo.includes('logo.clearbit.com/')) {
        const parts = logo.split('logo.clearbit.com/');
        if (parts[1]) return parts[1];
    }

    // Try to extract from slug (e.g. "yatracom" -> "yatra.com")
    if (slug) {
        const tldPatterns = [
            { suffix: 'comau', domain: '.com.au' },
            { suffix: 'couk', domain: '.co.uk' },
            { suffix: 'coid', domain: '.co.id' },
            { suffix: 'coin', domain: '.co.in' },
            { suffix: 'com', domain: '.com' },
            { suffix: 'in', domain: '.in' },
            { suffix: 'fr', domain: '.fr' },
            { suffix: 'de', domain: '.de' },
            { suffix: 'co', domain: '.co' },
        ];
        const lowerSlug = slug.toLowerCase();
        for (const { suffix, domain } of tldPatterns) {
            if (lowerSlug.endsWith(suffix)) {
                const name = lowerSlug.slice(0, lowerSlug.length - suffix.length);
                if (name.length > 0) return `${name}${domain}`;
            }
        }
    }

    return null;
}

// Build ordered list of logo URLs to try
function buildLogoSources(logo?: string, slug?: string): string[] {
    const sources: string[] = [];
    const domain = extractDomain(logo, slug);

    // 1. Original logo URL from database (if it's a valid http URL)
    if (logo && logo.startsWith('http')) {
        sources.push(logo);
    }

    if (domain) {
        // 2. Google high-res favicon (most reliable, works for almost everything)
        sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);

        // 3. Clearbit (high quality but doesn't work for all brands)  
        const clearbitUrl = `https://logo.clearbit.com/${domain}`;
        if (!sources.includes(clearbitUrl)) {
            sources.push(clearbitUrl);
        }
        
        // 4. DuckDuckGo icons (another fallback)
        sources.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    }

    return sources;
}

export default function BrandLogo({ name, logo, slug, className = "w-full h-full object-contain bg-white p-1" }: BrandLogoProps) {
    const [sourceIndex, setSourceIndex] = useState(0);
    const sources = buildLogoSources(logo, slug);

    const handleError = () => {
        // Try next source in the chain
        if (sourceIndex < sources.length - 1) {
            setSourceIndex(prev => prev + 1);
        } else {
            // All sources failed, force letter fallback
            setSourceIndex(sources.length);
        }
    };

    // If we still have sources to try, show image
    if (sourceIndex < sources.length) {
        return (
            <div className={`relative ${className.replace(/w-\w+ h-\w+/, 'w-full h-full')}`} style={{ minHeight: '100%', minWidth: '100%' }}>
                <Image
                    src={sources[sourceIndex]}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-1"
                    onError={handleError}
                    unoptimized={sources[sourceIndex].includes('.ico')} // skip optimization for ICO files
                />
            </div>
        );
    }

    // All sources exhausted — show letter initial
    return (
        <span className="font-bold flex items-center justify-center w-full h-full uppercase">
            {name.charAt(0)}
        </span>
    );
}

