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
            className="flex flex-col items-center text-center bg-white border border-appleBorder rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 shadow-sm cursor-pointer group"
        >
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-sm border border-appleBorder/50 overflow-hidden shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: platform.backgroundColor, color: platform.textColor }}
            >
                <BrandLogo name={platform.name} logo={platform.logo} />
            </div>
            
            <h3 className="text-lg font-bold text-appleText mb-2 group-hover:text-appleBlue transition-colors">
                {platform.name}
            </h3>
            
            <span className="px-3 py-1.5 bg-success/10 border border-success/20 rounded-full text-xs font-semibold text-success whitespace-nowrap">
                {platform.stats?.activeCount || 0} Offers Available
            </span>
        </div>
    );
}
