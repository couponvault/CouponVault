'use client';

import BrandLogo from './BrandLogo';

interface PlatformCardProps {
    platform: {
        _id: string;
        name: string;
        slug: string;
        description: string;
        logo: string;
        category: string;
        backgroundColor: string;
        textColor: string;
        stats: {
            activeCount: number;
            totalClaimed: number;
        };
    };
    onClick?: () => void;
}

export default function PlatformCard({ platform, onClick }: PlatformCardProps) {
    return (
        <div
            onClick={onClick}
            className="group flex flex-col items-center bg-white border border-appleBorder/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-2 hover:border-appleBlue/20 cursor-pointer"
        >
            <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.25rem] flex items-center justify-center text-3xl font-bold mb-5 shadow-sm border border-appleBorder/40 overflow-hidden shrink-0 group-hover:shadow-md transition-shadow"
                style={{ backgroundColor: platform.backgroundColor || '#f5f5f7', color: platform.textColor || '#1d1d1f' }}
            >
                <BrandLogo name={platform.name} logo={platform.logo} slug={platform.slug} />
            </div>
            
            <h3 className="text-lg font-bold text-appleText mb-3 group-hover:text-appleBlue transition-colors w-full text-center truncate px-2">
                {platform.name}
            </h3>
            
            <span className="px-3 py-1.5 bg-success/10 border border-success/20 rounded-full text-xs font-bold text-success whitespace-nowrap shadow-sm">
                {platform.stats?.activeCount || 0} Offers Available
            </span>
        </div>
    );
}
