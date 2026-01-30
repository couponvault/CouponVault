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
            className="coupon-card glass-card p-6 cursor-pointer group"
            style={{
                borderTop: `4px solid ${platform.backgroundColor}`,
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold"
                        style={{
                            backgroundColor: platform.backgroundColor,
                            color: platform.textColor,
                        }}
                    >
                        {platform.logo || platform.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold group-hover:text-primary-500 transition-colors">
                            {platform.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{categoryIcons[platform.category]}</span>
                            <span className="capitalize">{platform.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {platform.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                <div>
                    <div className="text-2xl font-bold text-primary-500">
                        {platform.stats.activeCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Available
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-secondary-500">
                        {platform.stats.totalClaimed}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Claimed
                    </div>
                </div>
            </div>

            <button
                className="w-full mt-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: `linear-gradient(to right, ${platform.backgroundColor}, ${platform.backgroundColor}dd)`,
                }}
            >
                Get Coupon
            </button>
        </div>
    );
}
