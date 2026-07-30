'use client';

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
    const categoryIcons: Record<string, string> = {
        ecommerce: '🛍️',
        streaming: '📺',
        food: '🍔',
        travel: '✈️',
        fashion: '👗',
        other: '🎁',
    };

    return (
        <div
            onClick={onClick}
            className="coupon-card bg-white border-b border-l border-r border-appleBorder rounded-2xl p-6 cursor-pointer group hover:shadow-lg transition-all hover:-translate-y-1 shadow-sm border-t-4"
            style={{
                borderTopColor: platform.backgroundColor || '#007AFF',
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold overflow-hidden shrink-0"
                        style={{
                            backgroundColor: platform.backgroundColor,
                            color: platform.textColor,
                        }}
                    >
                        {platform.logo && platform.logo.startsWith('http') ? (
                            <img src={platform.logo} alt={platform.name} className="w-full h-full object-cover" />
                        ) : (
                            platform.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold group-hover:text-appleBlue text-appleText transition-colors">
                            {platform.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-appleMuted">
                            <span>{categoryIcons[platform.category]}</span>
                            <span className="capitalize">{platform.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-appleMuted text-sm mb-4 line-clamp-2">
                {platform.description}
            </p>

            <div className="pt-4 border-t border-appleBorder">
                <div className="text-2xl font-bold text-appleText">
                    {platform.stats.activeCount || 0}
                </div>
                <div className="text-xs text-appleMuted">
                    Available Coupons
                </div>
            </div>

            <button
                className="w-full mt-4 py-2 text-white font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: `linear-gradient(to right, ${platform.backgroundColor}, ${platform.backgroundColor}dd)`,
                }}
            >
                Get Coupon
            </button>
        </div>
    );
}
