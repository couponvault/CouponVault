'use client';

import { useState, useEffect } from 'react';
import { FiPackage, FiGift, FiUsers, FiTrendingUp, FiAlertCircle, FiActivity, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [couponCount, setCouponCount] = useState(50);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');

            if (response.status === 401) {
                toast.error('Unauthorized! Please login as admin.');
                window.location.href = '/login';
                return;
            }

            const data = await response.json();

            if (data.success) {
                setStats(data);
            } else {
                toast.error(data.error || 'Failed to load statistics');
            }
        } catch (error) {
            toast.error('Error connecting to Server');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCoupons = async () => {
        if (!selectedPlatform) {
            toast.error('Please select a platform');
            return;
        }

        try {
            setGenerateLoading(true);
            const response = await fetch('/api/admin/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platformId: selectedPlatform,
                    count: couponCount
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                fetchStats();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Error generating coupons');
        } finally {
            setGenerateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-12 h-12"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-display mb-2">
                        Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your coupon vault and monitor system performance
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            icon: FiPackage,
                            label: 'Total Platforms',
                            value: stats?.stats.platforms.total || 0,
                            active: stats?.stats.platforms.active || 0,
                            color: 'from-blue-500 to-cyan-500'
                        },
                        {
                            icon: FiGift,
                            label: 'Total Coupons',
                            value: stats?.stats.coupons.total || 0,
                            active: stats?.stats.coupons.active || 0,
                            color: 'from-purple-500 to-pink-500'
                        },
                        {
                            icon: FiTrendingUp,
                            label: 'Claimed Coupons',
                            value: stats?.stats.coupons.claimed || 0,
                            color: 'from-green-500 to-emerald-500'
                        },
                        {
                            icon: FiAlertCircle,
                            label: 'Expired Coupons',
                            value: stats?.stats.coupons.expired || 0,
                            color: 'from-red-500 to-orange-500'
                        },
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="glass-card p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                                {stat.active !== undefined && (
                                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        {stat.active} active
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Generate Coupons */}
                <div className="glass-card p-6 rounded-xl mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                        <FiGift className="w-6 h-6" />
                        <span>Generate Coupons</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Platform</label>
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="w-full px-4 py-2 glass-card rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="">Choose a platform...</option>
                                {stats?.allPlatforms?.map((platform: any) => (
                                    <option key={platform._id} value={platform._id}>
                                        {platform.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Number of Coupons</label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={couponCount}
                                onChange={(e) => setCouponCount(parseInt(e.target.value))}
                                className="w-full px-4 py-2 glass-card rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleGenerateCoupons}
                                disabled={generateLoading || !selectedPlatform}
                                className="w-full px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generateLoading ? 'Generating...' : 'Generate Coupons'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Platforms */}
                <div className="glass-card p-6 rounded-xl mb-8">
                    <h2 className="text-2xl font-bold mb-6">Top Performing Platforms</h2>
                    <div className="space-y-4">
                        {stats?.topPlatforms?.map((platform: any, index: number) => (
                            <div key={platform._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{platform.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {platform.stats.activeCount} active coupons
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary-500">
                                        {platform.stats.totalClaimed}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        claimed
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity & Messages Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <div className="glass-card p-6 rounded-xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                            <FiActivity className="w-6 h-6" />
                            <span>Recent Activity</span>
                        </h2>
                        <div className="space-y-3">
                            {stats?.recentActivity?.slice(0, 8).map((activity: any) => (
                                <div key={activity._id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                    <div className="flex-1">
                                        <div className="font-medium capitalize">
                                            {activity.type.replace(/_/g, ' ')}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.severity === 'high' ? 'bg-red-100 text-red-700' :
                                        activity.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {activity.severity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Messages */}
                    <div className="glass-card p-6 rounded-xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                            <FiMessageSquare className="w-6 h-6 text-primary-500" />
                            <span>User Messages</span>
                        </h2>
                        <div className="space-y-4">
                            {stats?.recentMessages?.length > 0 ? (
                                stats.recentMessages.map((msg: any) => (
                                    <div key={msg._id} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg border-l-4 border-primary-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold flex items-center gap-2">
                                                    {msg.name}
                                                    <span className="text-xs font-normal text-gray-400">({msg.email})</span>
                                                </div>
                                                <div className="text-xs text-primary-500 font-semibold uppercase">{msg.subject || 'No Subject'}</div>
                                            </div>
                                            <div className="text-[10px] text-gray-400 uppercase">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-2">
                                            "{msg.message}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500 italic">
                                    No messages received yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
